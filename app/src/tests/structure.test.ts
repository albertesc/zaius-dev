import { describe, expect, it } from 'vitest'
// kit:if i18n
import { APP_DEFAULT_LANGUAGE, APP_LANGUAGES } from '@/constants/appLanguages'
// kit:end

const SHELL_DOMAINS: readonly string[] = ['session']

const sources = import.meta.glob<string>('/src/**/*.{ts,tsx}', { query: '?raw', import: 'default', eager: true })

const IMPORT_PATTERN = /\bfrom\s*['"]([^'"]+)['"]|\bimport\s*\(?\s*['"]([^'"]+)['"]/g
const BLOCK_COMMENT = /\/\*[\s\S]*?\*\//g
const FEATURES_PATH = /^(\/src\/features\/)([^/]+)\/(.+)$/
const ROUTER_ROUTES = /^\/src\/router\/\w+Routes\.tsx$/
const ROOT = /^\/src\/(components|hooks|utils|types|constants)\//
const DOMAIN = /^\/src\/domains\/([^/]+)\//
const UTILS_FILE = /\/utils\/[^/]+(?<!\.test)\.ts$/
const EXPORT = /^export (?:default |async |declare )*(?:function|const|let|var|class|type|interface|enum) (\w+)|^export \{/gm
const KIT_CODE = /^\/src\/(utils\/api\w*Utils\.ts|utils\/languageUtils\.ts|i18n\/i18n\.ts)$/
const WITHOUT_TEST = [/\.test\.tsx?$/, /^\/src\/tests\//, /\/(types|constants)\//, /\.d\.ts$/, /\.config\.ts$/, /^\/src\/main\.tsx$/, /Routes\.tsx$/, KIT_CODE]

/**
 * Pasa el texto de un import a la ruta del fichero de `src/` que importa, con sus `.` y sus `..` resueltos.
 * @param file El fichero que tiene el import (`/src/…`).
 * @param specifier Lo que va entre comillas en el import.
 * @returns La ruta con su extensión si es un `.ts` o `.tsx` de `src/`, o `null` si es un paquete.
 */
function resolveImport (file: string, specifier: string): string | null {
  const isAlias = specifier.startsWith('@/')
  if (!isAlias && !specifier.startsWith('.')) return null
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
 * @returns Los ficheros de `src/` que importa.
 */
function getImports (file: string, source: string): string[] {
  return [...source.replace(BLOCK_COMMENT, '').matchAll(IMPORT_PATTERN)]
    .map(([, from, imported]) => resolveImport(file, from ?? imported ?? ''))
    .filter((path) => path !== null)
}

/**
 * Busca la carpeta privada de una ruta: su feature o el `common` de su familia.
 * @param path La ruta de un fichero desde la raíz del proyecto (`/src/…`).
 * @returns La carpeta, con la barra final, o `null` si es de la raíz, de `services/` o de un dominio.
 */
function getPrivateRoot (path: string): string | null {
  const match = FEATURES_PATH.exec(path)
  if (!match) return null
  const [, features, first, rest] = match
  const [second, ...inside] = rest.split('/')
  const isFamily = inside.length > 0 && (second === 'common' || second.startsWith(first))
  return isFamily ? `${features}${first}/${second}/` : `${features}${first}/`
}

/**
 * Devuelve el dominio de una ruta de `src/`.
 * @param path La ruta del fichero desde la raíz del proyecto (`/src/…`).
 * @returns El nombre del dominio (`session`), o `null` si la ruta no es de `domains/`.
 */
function getDomain (path: string): string | null {
  return DOMAIN.exec(path)?.[1] ?? null
}

/**
 * Busca los ciclos entre los dominios a partir de lo que importa cada uno.
 * @param graph Los dominios que usa cada dominio.
 * @returns Cada ciclo como el camino que vuelve al dominio de partida («a → b → a»).
 */
function getDomainCycles (graph: Map<string, Set<string>>): string[] {
  const cycles = new Set<string>()
  const visit = (domain: string, path: string[]) => {
    if (path.includes(domain)) {
      const cycle = path.slice(path.indexOf(domain))
      const start = cycle.indexOf([...cycle].sort()[0] ?? domain)
      const ordered = [...cycle.slice(start), ...cycle.slice(0, start)]
      cycles.add([...ordered, ordered[0]].join(' → '))
      return
    }
    for (const next of graph.get(domain) ?? []) visit(next, [...path, domain])
  }
  for (const domain of graph.keys()) visit(domain, [])
  return [...cycles]
}

const imports = Object.entries(sources).map(([file, source]) => [file, getImports(file, source)] as const)

describe('independencia', () => {
  it('nada importa del interior de una feature que no es la suya', () => {
    const forbidden = imports.flatMap(([file, imported]) => imported
      .filter((path) => {
        const root = getPrivateRoot(path)
        const isOwn = root !== null && file.startsWith(root.replace(/common\/$/, ''))
        const isRouterRoutes = ROUTER_ROUTES.test(file) && path.endsWith('Routes.tsx')
        return root !== null && !isOwn && !isRouterRoutes
      })
      .map((path) => `${file} → ${path}`))

    expect(forbidden).toEqual([])
  })

  it('la raíz solo usa los dominios del marco de la app', () => {
    const forbidden = imports
      .filter(([file]) => ROOT.test(file))
      .flatMap(([file, imported]) => imported
        .filter((path) => {
          const domain = getDomain(path)
          return domain !== null && !SHELL_DOMAINS.includes(domain)
        })
        .map((path) => `${file} → ${path}`))

    expect(forbidden).toEqual([])
  })

  it('no hay ciclos entre dominios', () => {
    const graph = new Map<string, Set<string>>()
    for (const [file, imported] of imports) {
      const domain = getDomain(file)
      if (domain === null) continue
      const used = graph.get(domain) ?? new Set<string>()
      for (const path of imported) {
        const other = getDomain(path)
        if (other !== null && other !== domain) used.add(other)
      }
      graph.set(domain, used)
    }

    expect(getDomainCycles(graph)).toEqual([])
  })
})

describe('los nombres', () => {
  it('cada fichero de una feature empieza por el nombre de la feature', () => {
    const wrong = Object.keys(sources)
      .filter((file) => !/\.test\.tsx?$/.test(file))
      .flatMap((file) => {
        const root = getPrivateRoot(file)
        if (root === null || root.endsWith('/common/')) return []
        const feature = root.split('/').at(-2) ?? ''
        const name = file.slice(file.lastIndexOf('/') + 1).replace(/\..+$/, '').replace(/^use(?=[A-Z])/, '')
        return name.toLowerCase().startsWith(feature.toLowerCase()) ? [] : [`${file}: no empieza por ${feature}`]
      })

    expect(wrong).toEqual([])
  })
})

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
      .filter((file) => ![file.replace(/\.(tsx?)$/, '.test.$1'), file.replace(/\.ts$/, '.test.tsx')].some((test) => test !== file && test in sources))

    expect(missing).toEqual([])
  })
})
// kit:if i18n

const catalogs = import.meta.glob<Record<string, unknown>>('/src/**/i18n/*.json', { import: 'default', eager: true })
const catalogFolders = [...new Set(Object.keys(catalogs).map((file) => file.slice(0, file.lastIndexOf('/') + 1)))]
const languages: readonly string[] = APP_LANGUAGES

/**
 * Aplana las claves de un catálogo de textos, con sus grupos unidos por puntos.
 * @param catalog El catálogo o uno de sus grupos.
 * @param prefix El grupo del que cuelga, con el punto final.
 * @returns Las claves completas (`actions.save`).
 */
function getKeys (catalog: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(catalog).flatMap(([key, value]) => typeof value === 'object' && value !== null
    ? getKeys(value as Record<string, unknown>, `${prefix}${key}.`)
    : [`${prefix}${key}`])
}

/**
 * Da el namespace de los catálogos de una carpeta `i18n/`, como `i18n.ts`: la feature, la familia de un `common`, el dominio o `common` en la raíz.
 * @param folder La carpeta, con la barra final (`/src/features/orders/common/i18n/`).
 * @returns El namespace (`orders`).
 */
function getNamespace (folder: string): string {
  const segments = folder.split('/')
  const owner = segments.at(-3) ?? ''
  if (owner === 'src') return 'common'
  return owner === 'common' ? segments.at(-4) ?? owner : owner
}

describe('paridad de idiomas', () => {
  it('cada carpeta i18n tiene un catálogo por idioma de la app, y ninguno más', () => {
    const missing = catalogFolders.flatMap((folder) => languages
      .filter((language) => !(`${folder}${language}.json` in catalogs))
      .map((language) => `${folder} no tiene ${language}.json`))
    const unknown = Object.keys(catalogs)
      .filter((file) => !languages.includes(file.slice(file.lastIndexOf('/') + 1, -'.json'.length)))
      .map((file) => `${file} no es de un idioma de la app (${languages.join(', ')})`)

    expect([...missing, ...unknown]).toEqual([])
  })

  it('cada clave del idioma por defecto está en los demás, y al revés', () => {
    const different = catalogFolders.flatMap((folder) => {
      const reference = getKeys(catalogs[`${folder}${APP_DEFAULT_LANGUAGE}.json`] ?? {})
      return languages.filter((language) => language !== APP_DEFAULT_LANGUAGE).flatMap((language) => {
        const keys = getKeys(catalogs[`${folder}${language}.json`] ?? {})
        return [
          ...reference.filter((key) => !keys.includes(key)).map((key) => `${folder}${language}.json no tiene ${key}`),
          ...keys.filter((key) => !reference.includes(key)).map((key) => `${folder}${APP_DEFAULT_LANGUAGE}.json no tiene ${key}`),
        ]
      })
    })

    expect(different).toEqual([])
  })

  it('los catálogos que comparten namespace no repiten una clave', () => {
    const owners = new Map<string, string>()
    const repeated = catalogFolders.flatMap((folder) => getKeys(catalogs[`${folder}${APP_DEFAULT_LANGUAGE}.json`] ?? {}).flatMap((key) => {
      const id = `${getNamespace(folder)}:${key}`
      const owner = owners.get(id)
      owners.set(id, owner ?? folder)
      return owner === undefined ? [] : [`${id} está en ${owner} y en ${folder}`]
    }))

    expect(repeated).toEqual([])
  })
})
// kit:end
