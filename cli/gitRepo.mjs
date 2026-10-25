import { stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { runCommand } from './commandRunner.mjs'

/**
 * Dice si una carpeta está dentro de un repositorio git: ella o alguna de las de encima tiene `.git` (una carpeta o, en un worktree o un submódulo, un fichero). No lanza git.
 * @param dir La carpeta; no hace falta que exista (un proyecto nuevo aún no tiene la suya).
 * @returns `true` si está dentro de un repositorio.
 */
export async function isInsideGitRepo (dir) {
  let current = resolve(dir)
  while (true) {
    if (await stat(join(current, '.git')).then(() => true, () => false)) return true
    const parent = dirname(current)
    if (parent === current) return false
    current = parent
  }
}

/**
 * Dice si git está instalado en el equipo.
 * @returns `true` si `git --version` funciona.
 */
export async function isGitInstalled () {
  const result = await runCommand('git', ['--version'], tmpdir())
  return result.ok
}

/**
 * Inicia un repositorio git vacío en la carpeta del proyecto, sin ningún commit. La rama principal es la que diga la configuración de git de la persona.
 * @param dir La carpeta del proyecto.
 * @returns Lo que da `runCommand`: `ok` y la salida.
 */
export function initGitRepo (dir) {
  return runCommand('git', ['init'], dir)
}

/**
 * Lo que el instalador hace con git, junto, para que los tests le pasen uno falso.
 */
export const GIT_TOOLS = { isInstalled: isGitInstalled, isInsideRepo: isInsideGitRepo, init: initGitRepo }
