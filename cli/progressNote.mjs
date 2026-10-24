import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export const PROGRESS_FILE = 'docs/next-steps.md'

const WHERE_WE_ARE = /^## Dónde estamos[ \t]*\r?$/m

/**
 * Apunta una tarea en «Dónde estamos» de `docs/next-steps.md`, justo debajo del título.
 * @param content El contenido de `next-steps.md`.
 * @param task La tarea, en una línea, sin la casilla.
 * @returns El contenido con la tarea; si no hay «Dónde estamos», la tarea va al final.
 */
export function addProgressTask (content, task) {
  const line = `- [ ] ${task}`
  const match = WHERE_WE_ARE.exec(content)
  if (match === null) return `${content.trimEnd()}\n\n${line}\n`
  const end = match.index + match[0].length
  return `${content.slice(0, end)}\n\n${line}${content.slice(end)}`
}

/**
 * Apunta en el `next-steps.md` del proyecto que hay ficheros `.kit-new` por fusionar.
 * @param projectDir La carpeta del proyecto.
 * @param kitNewPaths Los ficheros que tienen su `.kit-new`.
 * @param kitVersion La versión del kit de la que vienen.
 * @returns `true` si se ha apuntado; `false` si no hay nada que apuntar o no existe el fichero.
 */
export async function noteKitNewTask (projectDir, kitNewPaths, kitVersion) {
  if (kitNewPaths.length === 0) return false
  const path = join(projectDir, PROGRESS_FILE)
  let content
  try {
    content = await readFile(path, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
  const files = kitNewPaths.map((file) => `\`${file}\``).join(', ')
  await writeFile(path, addProgressTask(content, `Fusionar las versiones del kit ${kitVersion} (\`.kit-new\`) con la skill \`zaius-merge\`: ${files}.`))
  return true
}
