import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, rm, rmdir, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

export const MANIFEST_FILE = 'zaius-dev.json'

export const KIT_NEW_SUFFIX = '.kit-new'

/**
 * Calcula la huella de un fichero, igual con finales de línea LF o CRLF.
 * @param content El contenido del fichero.
 * @returns El SHA-256 en hexadecimal.
 */
export function hashContent (content) {
  return createHash('sha256').update(content.replaceAll('\r\n', '\n')).digest('hex')
}

/**
 * Lee un fichero de texto que puede no existir.
 * @param path La ruta del fichero.
 * @returns Su contenido, o `null` si no existe.
 */
export async function readOptionalFile (path) {
  try {
    return await readFile(path, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

/**
 * Lee el manifiesto del kit de un proyecto (`zaius-dev.json`).
 * @param projectDir La carpeta del proyecto.
 * @returns El manifiesto, o `null` si el proyecto no tiene el kit.
 */
export async function readManifest (projectDir) {
  const content = await readOptionalFile(join(projectDir, MANIFEST_FILE))
  return content === null ? null : JSON.parse(content)
}

/**
 * Escribe el manifiesto del kit de un proyecto.
 * @param projectDir La carpeta del proyecto.
 * @param manifest La versión del kit, las respuestas, lo que añadió a `package.json` y la huella de cada fichero.
 */
export async function writeManifest (projectDir, manifest) {
  await writeFile(join(projectDir, MANIFEST_FILE), `${JSON.stringify(manifest, null, 2)}\n`)
}

/**
 * Decide qué hacer con cada fichero del kit: crearlo, sustituirlo, respetarlo o dejar la versión nueva al lado.
 * @param projectDir La carpeta del proyecto.
 * @param rendered Los ficheros que da la plantilla, con su contenido y si son semilla.
 * @param recorded La huella de cada fichero tal como lo dejó el kit la última vez.
 * @returns Una acción por fichero: `create`, `same`, `keep`, `replace`, `kitNew`, `remove` u `orphan`.
 */
export async function planProjectFiles (projectDir, rendered, recorded) {
  const actions = []
  for (const [path, { content, seed }] of rendered) {
    const current = await readOptionalFile(join(projectDir, path))
    const kitHash = hashContent(content)
    const currentHash = current === null ? null : hashContent(current)
    const recordedHash = recorded[path] ?? null
    const action = current === null
      ? 'create'
      : currentHash === kitHash
        ? 'same'
        : seed || recordedHash === kitHash
          ? 'keep'
          : recordedHash === currentHash ? 'replace' : 'kitNew'
    actions.push({ path, action, hash: action === 'keep' ? recordedHash ?? kitHash : kitHash })
  }
  for (const [path, recordedHash] of Object.entries(recorded)) {
    if (rendered.has(path)) continue
    const current = await readOptionalFile(join(projectDir, path))
    if (current !== null) actions.push({ path, action: hashContent(current) === recordedHash ? 'remove' : 'orphan', hash: null })
  }
  return actions
}

/**
 * Borra las carpetas que se quedan vacías al quitar un fichero, de dentro afuera, sin llegar a la del proyecto.
 * @param projectDir La carpeta del proyecto.
 * @param target El fichero que se ha quitado.
 */
async function removeEmptyFolders (projectDir, target) {
  for (let dir = dirname(target); relative(projectDir, dir) !== '' && !relative(projectDir, dir).startsWith('..'); dir = dirname(dir)) {
    if ((await readdir(dir)).length > 0) return
    await rmdir(dir)
  }
}

/**
 * Aplica al proyecto las acciones de `planProjectFiles`.
 * Al quitar un fichero, quita también las carpetas que deja vacías (la de una skill que cambia de nombre).
 * @param projectDir La carpeta del proyecto.
 * @param actions Las acciones, una por fichero.
 * @param rendered Los ficheros que da la plantilla.
 * @returns La huella de cada fichero del kit, para el manifiesto.
 */
export async function applyProjectFiles (projectDir, actions, rendered) {
  const recorded = {}
  for (const { path, action, hash } of actions) {
    const target = join(projectDir, path)
    if (action === 'remove') {
      await rm(target)
      await removeEmptyFolders(projectDir, target)
      continue
    }
    if (action === 'orphan') continue
    if (action === 'create' || action === 'replace' || action === 'kitNew') {
      await mkdir(dirname(target), { recursive: true })
      await writeFile(action === 'kitNew' ? `${target}${KIT_NEW_SUFFIX}` : target, rendered.get(path).content)
    }
    if (action !== 'kitNew' && action !== 'keep') await rm(`${target}${KIT_NEW_SUFFIX}`, { force: true })
    recorded[path] = hash
  }
  return Object.fromEntries(Object.entries(recorded).sort(([a], [b]) => a.localeCompare(b)))
}

/**
 * Cuenta las acciones de cada tipo, para el resumen que se enseña antes y después de instalar.
 * @param actions Las acciones de `planProjectFiles`.
 * @returns Las rutas de cada tipo de acción.
 */
export function groupProjectActions (actions) {
  const groups = { create: [], same: [], keep: [], replace: [], kitNew: [], remove: [], orphan: [] }
  for (const { path, action } of actions) groups[action].push(path)
  return groups
}
