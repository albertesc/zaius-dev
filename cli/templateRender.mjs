import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const PACKAGE_FRAGMENT = 'package.fragment.json'

const MARKER = /^\s*(?:<!--|\/\/|#)\s*kit:(if|else|end)(?:\s+(!?)(\w+))?\s*(?:-->)?\s*$/
const VALUE = /%%([A-Z_]+)%%/g

/**
 * Dice si se cumple una condición de la plantilla (`mocks`, `!i18n`).
 * @param condition El nombre de la condición, con `!` delante para negarla.
 * @param conditions Lo que vale cada condición en esta instalación.
 * @returns `true` si se cumple.
 * @throws {Error} si la condición no existe.
 */
export function isConditionMet (condition, conditions) {
  const negated = condition.startsWith('!')
  const name = negated ? condition.slice(1) : condition
  if (!Object.hasOwn(conditions, name)) throw new Error(`Condición desconocida: ${name}`)
  return negated ? !conditions[name] : Boolean(conditions[name])
}

/**
 * Sustituye los `%%VALOR%%` de un texto por los de esta instalación.
 * @param text El texto de la plantilla.
 * @param values Lo que vale cada placeholder.
 * @returns El texto con los valores puestos.
 * @throws {Error} si un placeholder no tiene valor.
 */
export function replaceTemplateValues (text, values) {
  return text.replace(VALUE, (match, name) => {
    if (!Object.hasOwn(values, name)) throw new Error(`Placeholder desconocido: ${match}`)
    return values[name]
  })
}

/**
 * Aplica a un fichero de la plantilla sus bloques `kit:if` / `kit:else` / `kit:end` y sus valores.
 * @param content El contenido del fichero.
 * @param conditions Lo que vale cada condición.
 * @param values Lo que vale cada placeholder.
 * @returns El contenido sin las líneas marcadoras ni los bloques que no tocan.
 * @throws {Error} si un bloque está mal cerrado, con su línea.
 */
export function renderTemplateText (content, conditions, values) {
  const stack = []
  const output = []
  let active = true
  for (const [index, line] of content.split('\n').entries()) {
    const marker = MARKER.exec(line)
    if (marker === null) {
      if (active) output.push(line)
      continue
    }
    const [, keyword, negation = '', name] = marker
    const top = stack.at(-1)
    if (keyword === 'if') {
      if (name === undefined) throw new Error(`kit:if sin condición en la línea ${index + 1}`)
      const met = isConditionMet(`${negation}${name}`, conditions)
      stack.push({ parent: active, met, line: index + 1, inElse: false })
      active = active && met
    } else if (top === undefined) {
      throw new Error(`kit:${keyword} sin kit:if en la línea ${index + 1}`)
    } else if (keyword === 'else') {
      if (top.inElse) throw new Error(`kit:else repetido en la línea ${index + 1}`)
      top.inElse = true
      active = top.parent && !top.met
    } else {
      stack.pop()
      active = top.parent
    }
  }
  if (stack.length > 0) throw new Error(`kit:if sin cerrar desde la línea ${stack.at(-1).line}`)
  return replaceTemplateValues(output.join('\n'), values)
}

/**
 * Pasa un patrón de `templateFiles.json` (`src/i18n/**`, `docs/*.md`) a una expresión regular.
 * @param pattern El patrón, con `**` para cualquier ruta y `*` para un segmento.
 * @returns La expresión, anclada al principio y al final.
 */
export function globToRegExp (pattern) {
  const source = pattern
    .split('**')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '[^/]*'))
    .join('.*')
  return new RegExp(`^${source}$`)
}

/**
 * Dice si un fichero de la plantilla se instala con estas respuestas: cumple todos los patrones que le tocan.
 * @param path La ruta lógica del fichero: dentro de su carpeta de la plantilla (`shared/`, `web/` o `app/`), sin ella, con `/`.
 * @param rules Las condiciones de `templateFiles.json`, por patrón.
 * @param conditions Lo que vale cada condición.
 * @returns `true` si se copia.
 */
export function isTemplatePathIncluded (path, rules, conditions) {
  return Object.entries(rules).every(([pattern, required]) => !globToRegExp(pattern).test(path) ||
    [required].flat().every((condition) => isConditionMet(condition, conditions)))
}

/**
 * Pasa una ruta de la plantilla a la del proyecto: cada segmento `dot-x` es `.x`.
 * @param path La ruta lógica, sin la carpeta de la plantilla, con `/`.
 * @returns La ruta en el proyecto.
 */
export function toProjectPath (path) {
  return path.split('/').map((segment) => segment.startsWith('dot-') ? `.${segment.slice(4)}` : segment).join('/')
}

/**
 * Dice qué capas de la plantilla (`overlays` de `templateFiles.json`) se instalan con estas respuestas: todas sus condiciones se cumplen.
 * @param rules El contenido de `templateFiles.json`.
 * @param conditions Lo que vale cada condición.
 * @returns Cada carpeta de capa (`web`) con `true` si se instala.
 * @throws {Error} si una capa pide una condición que no existe.
 */
export function resolveOverlays (rules, conditions) {
  return Object.fromEntries(Object.entries(rules.overlays ?? {}).map(([folder, required]) =>
    [folder, [required].flat().every((condition) => isConditionMet(condition, conditions))]))
}

/**
 * Da las carpetas de la plantilla que se instalan, en el orden en que se suman: la base (`base` de `templateFiles.json`) y las capas que tocan.
 * @param rules El contenido de `templateFiles.json`.
 * @param conditions Lo que vale cada condición.
 * @returns Las carpetas, dentro de la del kit (`shared`, `web`).
 */
export function resolveTemplateRoots (rules, conditions) {
  const overlays = resolveOverlays(rules, conditions)
  return [rules.base, ...Object.keys(overlays).filter((folder) => overlays[folder])]
}

/**
 * Lista los ficheros de unas carpetas de la plantilla, sin sus fragmentos de `package.json`.
 * @param kitDir La carpeta del kit.
 * @param roots Las carpetas de la plantilla que se instalan (`resolveTemplateRoots`).
 * @returns Cada fichero con `source`, su ruta en el kit (`web/src/pages/index.astro`), y `path`, su ruta lógica (sin la carpeta), con `/`, por carpeta y ordenados por `source`.
 */
export async function listTemplateFiles (kitDir, roots) {
  const files = []
  for (const root of roots) {
    const rootDir = join(kitDir, root)
    const entries = await readdir(rootDir, { recursive: true, withFileTypes: true }).catch((error) => {
      if (error.code === 'ENOENT') return []
      throw error
    })
    const paths = entries
      .filter((entry) => entry.isFile())
      .map((entry) => join(entry.parentPath, entry.name).slice(rootDir.length + 1).replaceAll('\\', '/'))
      .filter((path) => path !== PACKAGE_FRAGMENT)
      .sort()
    files.push(...paths.map((path) => ({ source: `${root}/${path}`, path })))
  }
  return files
}

/**
 * Genera los ficheros del proyecto a partir de la plantilla y las respuestas: la base y la capa de su tipo.
 * @param options `kitDir`, la carpeta del kit; `rules`, el contenido de `templateFiles.json`; `conditions` y `values`; `languages`, para los ficheros con `%%LANGUAGE%%` en su ruta.
 * @returns Cada ruta del proyecto con su contenido y si es una semilla (se crea una vez y es del proyecto).
 * @throws {Error} si dos ficheros de la plantilla dan el mismo fichero del proyecto.
 */
export async function renderTemplate ({ kitDir, rules, conditions, values, languages }) {
  const seeds = (rules.seeds ?? []).map(globToRegExp)
  const files = new Map()
  const sources = new Map()
  for (const { source, path } of await listTemplateFiles(kitDir, resolveTemplateRoots(rules, conditions))) {
    if (!isTemplatePathIncluded(path, rules.conditions ?? {}, conditions)) continue
    const content = await readFile(join(kitDir, source), 'utf8')
    const seed = seeds.some((pattern) => pattern.test(path))
    const variants = path.includes('%%LANGUAGE%%')
      ? languages.map((language) => [path.replaceAll('%%LANGUAGE%%', language), { ...values, LANGUAGE: language }])
      : [[path, values]]
    for (const [variant, variantValues] of variants) {
      const projectPath = toProjectPath(variant)
      if (sources.has(projectPath)) throw new Error(`Dos ficheros de la plantilla dan ${projectPath}: ${sources.get(projectPath)} y ${source}`)
      sources.set(projectPath, source)
      files.set(projectPath, { content: renderTemplateText(content, conditions, variantValues), seed })
    }
  }
  return files
}
