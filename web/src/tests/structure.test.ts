import { describe, expect, it } from 'vitest'
// kit:if i18n
import { APP_DEFAULT_LANGUAGE, APP_LANGUAGES } from '@/constants/appLanguages'
// kit:end

const sources = import.meta.glob<string>('/src/**/*.{ts,tsx,astro}', { query: '?raw', import: 'default', eager: true })

// kit:if backend
const IMPORT_PATTERN = /\bfrom\s*['"]([^'"]+)['"]|\bimport\s*\(?\s*['"]([^'"]+)['"]/g
const BLOCK_COMMENT = /\/\*[\s\S]*?\*\//g
const API = /^\/src\/(services\/.+Service\.ts|utils\/api\w*Utils\.ts)$/
// kit:if server
const API_CALLERS = [/^\/src\/(pages|actions|services|tests)\//, /^\/src\/middleware\.ts$/, /^\/src\/utils\/api\w*Utils\.ts$/, /\.test\.tsx?$/]
const SERVER_ISLAND = /<(\w+)\b[^>]*\bserver:defer\b/g
// kit:else
const API_CALLERS = [/^\/src\/(pages|services|tests)\//, /^\/src\/utils\/api\w*Utils\.ts$/, /\.test\.tsx?$/]
// kit:end
// kit:end
const UTILS_FILE = /\/utils\/[^/]+(?<!\.test)\.ts$/
const EXPORT = /^export (?:default |async |declare )*(?:function|const|let|var|class|type|interface|enum) (\w+)|^export \{/gm
const KIT_CODE = /^\/src\/(utils\/api\w*Utils\.ts|utils\/languageUtils\.ts|i18n\/i18n\.ts)$/
// kit:if server
const WITHOUT_TEST = [/\.test\.tsx?$/, /^\/src\/tests\//, /^\/src\/pages\//, /^\/src\/actions\/index\.ts$/, /\/(types|constants)\//, /\.d\.ts$/, /\.config\.ts$/, KIT_CODE]
// kit:else
const WITHOUT_TEST = [/\.test\.tsx?$/, /^\/src\/tests\//, /^\/src\/pages\//, /\/(types|constants)\//, /\.d\.ts$/, /\.config\.ts$/, KIT_CODE]
// kit:end
const PAGE = /^\/src\/pages\/(.+)\.(astro|ts)$/
// kit:if backend

/**
 * Pasa el texto de un import a la ruta del fichero de `src/` que importa, con sus `.` y sus `..` resueltos.
 * @param file El fichero que tiene el import (`/src/…`).
 * @param specifier Lo que va entre comillas en el import.
 * @returns La ruta con su extensión si es un fichero de `src/`; el texto tal cual si es un módulo de Astro (`astro:env/server`) o un paquete.
 */
function resolveImport (file: string, specifier: string): string {
  const isAlias = specifier.startsWith('@/')
  if (!isAlias && !specifier.startsWith('.')) return specifier
  const base = isAlias ? `/src/${specifier.slice(2)}` : `${file.slice(0, file.lastIndexOf('/') + 1)}${specifier}`
  const segments: string[] = []
  for (const segment of base.split('/')) {
    if (segment === '..') segments.pop()
    else if (segment !== '.' && segment !== '') segments.push(segment)
  }
  const path = `/${segments.join('/')}`
  return [`${path}.ts`, `${path}.tsx`].find((candidate) => candidate in sources) ?? path
}

/**
 * Lee los imports de un fichero de `src/`, también los dinámicos y los de `vi.mock`.
 * @param file La ruta del fichero desde la raíz del proyecto (`/src/…`).
 * @param source El texto del fichero.
 * @returns Lo que importa: las rutas de `src/` y los demás módulos tal cual.
 */
function getImports (file: string, source: string): string[] {
  return [...source.replace(BLOCK_COMMENT, '').matchAll(IMPORT_PATTERN)]
    .map(([, from, imported]) => resolveImport(file, from ?? imported ?? ''))
}
// kit:if server

/**
 * Busca los componentes que se pintan como isla de servidor (`server:defer`): leen sus datos en el servidor, como una página.
 * @returns Las rutas de esos componentes (`/src/components/…`).
 */
function getServerIslands (): string[] {
  return Object.entries(sources).flatMap(([file, source]) => [...source.matchAll(SERVER_ISLAND)].flatMap(([, name]) => {
    const specifier = new RegExp(`import\\s+${name}\\s+from\\s+['"]([^'"]+)['"]`).exec(source)?.[1]
    return specifier === undefined ? [] : [resolveImport(file, specifier)]
  }))
}
// kit:end

const imports = Object.entries(sources).map(([file, source]) => [file, getImports(file, source)] as const)
// kit:if server
const serverIslands = getServerIslands()
// kit:end
// kit:end
// kit:if backend

describe('quién llama a la API', () => {
  // kit:if server
  it('solo las páginas, los endpoints, las actions, el middleware y las islas de servidor llaman a los services y al transporte', () => {
    const forbidden = imports
      .filter(([file]) => !API_CALLERS.some((pattern) => pattern.test(file)) && !serverIslands.includes(file))
  // kit:else
  it('solo las páginas llaman a los services y al transporte', () => {
    const forbidden = imports
      .filter(([file]) => !API_CALLERS.some((pattern) => pattern.test(file)))
  // kit:end
      .flatMap(([file, imported]) => imported.filter((path) => API.test(path)).map((path) => `${file} → ${path}`))

    expect(forbidden).toEqual([])
  })
})
// kit:end

describe('los utils', () => {
  it('cada fichero de utils exporta un solo objeto, que se llama como el fichero y acaba en Utils', () => {
    const wrong = Object.entries(sources)
      .filter(([file]) => UTILS_FILE.test(file))
      .flatMap(([file, source]) => {
        const name = file.slice(file.lastIndexOf('/') + 1, -'.ts'.length)
        const exported = [...source.matchAll(EXPORT)].map((match) => match[1] ?? '{…}')
        const isRight = name.endsWith('Utils') && exported.length === 1 && exported[0] === name && source.includes(`export const ${name} = {`)
        return isRight ? [] : [`${file}: ${exported.join(', ')}`]
      })

    expect(wrong).toEqual([])
  })
})

describe('un test por fichero', () => {
  it('cada fichero con código tiene su test al lado', () => {
    const missing = Object.keys(sources)
      .filter((file) => !WITHOUT_TEST.some((pattern) => pattern.test(file)))
      .filter((file) => ![file.replace(/\.(astro|ts)$/, '.test.ts'), file.replace(/\.tsx$/, '.test.tsx'), file.replace(/\.ts$/, '.test.tsx')].some((test) => test !== file && test in sources))

    expect(missing).toEqual([])
  })

  it('cada página y cada endpoint tienen su test en src/tests/pages, con la misma ruta', () => {
    const missing = Object.keys(sources)
      .flatMap((file) => {
        const route = PAGE.exec(file)?.[1]
        return route === undefined || `/src/tests/pages/${route}.test.ts` in sources ? [] : [`${file}: falta /src/tests/pages/${route}.test.ts`]
      })

    expect(missing).toEqual([])
  })
})
// kit:if i18n

const catalogs = import.meta.glob<Record<string, unknown>>('/src/i18n/*.json', { import: 'default', eager: true })
const languages: readonly string[] = APP_LANGUAGES

/**
 * Aplana las claves de un catálogo de textos, con sus grupos unidos por puntos.
 * @param catalog El catálogo o uno de sus grupos.
 * @param prefix El grupo del que cuelga, con el punto final.
 * @returns Las claves completas (`rooms.index.title`).
 */
function getKeys (catalog: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(catalog).flatMap(([key, value]) => typeof value === 'object' && value !== null
    ? getKeys(value as Record<string, unknown>, `${prefix}${key}.`)
    : [`${prefix}${key}`])
}

describe('paridad de idiomas', () => {
  it('src/i18n tiene un catálogo por idioma de la app, y ninguno más', () => {
    const missing = languages.filter((language) => !(`/src/i18n/${language}.json` in catalogs)).map((language) => `falta /src/i18n/${language}.json`)
    const unknown = Object.keys(catalogs)
      .filter((file) => !languages.includes(file.slice(file.lastIndexOf('/') + 1, -'.json'.length)))
      .map((file) => `${file} no es de un idioma de la app (${languages.join(', ')})`)

    expect([...missing, ...unknown]).toEqual([])
  })

  it('cada clave del idioma por defecto está en los demás, y al revés', () => {
    const reference = getKeys(catalogs[`/src/i18n/${APP_DEFAULT_LANGUAGE}.json`] ?? {})
    const different = languages.filter((language) => language !== APP_DEFAULT_LANGUAGE).flatMap((language) => {
      const keys = getKeys(catalogs[`/src/i18n/${language}.json`] ?? {})
      return [
        ...reference.filter((key) => !keys.includes(key)).map((key) => `/src/i18n/${language}.json no tiene ${key}`),
        ...keys.filter((key) => !reference.includes(key)).map((key) => `/src/i18n/${APP_DEFAULT_LANGUAGE}.json no tiene ${key}`),
      ]
    })

    expect(different).toEqual([])
  })
})
// kit:end
