import { GIT_TOOLS } from './gitRepo.mjs'
import { finishInstall } from './installFinish.mjs'
import { buildInstallQuestion, buildInstallWarnings, isInstallEmpty } from './installSummary.mjs'
import { noteKitNewTask } from './progressNote.mjs'
import { installProject } from './projectInstall.mjs'

/**
 * Da la fecha de un día en la forma de los documentos (`aaaa-mm-dd`), en la hora local.
 * @param date El día.
 * @returns La fecha (`2026-10-22`).
 */
export function formatInstallDate (date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((part) => String(part).padStart(2, '0')).join('-')
}

/**
 * Da la zona horaria del sistema, la que usan los tests del proyecto.
 * @returns La zona (`Europe/Madrid`), o `UTC` si el sistema no la da.
 */
export function getSystemTimezone () {
  return Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC'
}

/**
 * Inicia el repositorio git del proyecto y dice cómo ha ido; si falla, avisa y la instalación sigue.
 * @param projectDir La carpeta del proyecto.
 * @param git Lo que se hace con git.
 * @param prompts El módulo de preguntas, para el mensaje.
 */
async function startGitRepo (projectDir, git, prompts) {
  const result = await git.init(projectDir)
  if (result.ok) prompts.log.success('Repositorio git iniciado, sin ningún commit: los commits y los push los haces tú.')
  else prompts.log.warn(`No se ha podido iniciar el repositorio git (git init): ${result.output.trim()}`)
}

/**
 * Hace una instalación entera: el resumen, la confirmación, los ficheros, el repositorio git si se ha pedido y aún no lo hay, y, con el código del kit, las dependencias y las comprobaciones.
 * @param options `projectDir`, `kitDir`, `answers` ya normalizadas, `yes` (no confirmar), `skipInstall` (sin instalar las dependencias ni pasar las comprobaciones), `prompts`, `git` (lo que se hace con git; uno falso en los tests) y `today`.
 * @returns `ok` si todo ha ido bien y el resultado de `installProject`; `null` si no hay nada que hacer o la persona dice que no.
 */
export async function runInstallFlow ({ projectDir, kitDir, answers, yes, skipInstall, prompts, git = GIT_TOOLS, today = new Date() }) {
  const context = { projectDir, kitDir, answers, date: formatInstallDate(today), timezone: getSystemTimezone() }
  const preview = await installProject({ ...context, dryRun: true })
  const initGit = answers.git && !(await git.isInsideRepo(projectDir))
  if (isInstallEmpty(preview) && !initGit) {
    prompts.log.success('El proyecto ya está al día con el kit: no hay nada que cambiar.')
    return null
  }
  if (!yes) {
    const proceed = await prompts.confirm({ message: buildInstallQuestion(preview, { initGit }), active: 'Sí', inactive: 'No', initialValue: true })
    if (prompts.isCancel(proceed) || !proceed) {
      prompts.cancel('No se ha cambiado nada.')
      return null
    }
  }
  const result = await installProject(context)
  if (initGit) await startGitRepo(projectDir, git, prompts)
  await noteKitNewTask(projectDir, result.groups.kitNew, result.kitVersion)
  for (const warning of buildInstallWarnings(result)) prompts.log.warn(warning)
  if (answers.existing) {
    prompts.log.success('Instalado: la documentación y las skills. El código base llega al terminar la migración.')
    return { ok: true, result }
  }
  if (skipInstall) {
    prompts.log.info('Instalado sin instalar las dependencias ni pasar las comprobaciones (--skip-install).')
    return { ok: true, result }
  }
  const ok = await finishInstall({ projectDir, packageManager: answers.packageManager, installDependencies: result.packageChange?.changed ?? false, prompts })
  if (ok) prompts.log.success('Instalado: tipos, lint y tests en verde.')
  else prompts.log.warn('Instalado, pero alguna comprobación falla: el detalle está arriba.')
  return { ok, result }
}
