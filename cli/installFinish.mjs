import { runCommand } from './commandRunner.mjs'
import { buildProjectCommands } from './packageManagers.mjs'

const OUTPUT_LINES = 40

/**
 * Da las últimas líneas de la salida de una orden, para enseñar por qué ha fallado.
 * @param output La salida entera.
 * @returns Como mucho las últimas 40 líneas.
 */
export function tailOutput (output) {
  return output.trimEnd().split(/\r?\n/).slice(-OUTPUT_LINES).join('\n')
}

/**
 * Termina una instalación en un proyecto con el código del kit: instala las dependencias y pasa las comprobaciones.
 * @param options `projectDir`; `packageManager`, el gestor de paquetes del proyecto; `installDependencies`, si hay que instalarlas; `prompts`, para el progreso.
 * @returns `true` si todo ha ido bien.
 */
export async function finishInstall ({ projectDir, packageManager, installDependencies, prompts }) {
  const { install, checks } = buildProjectCommands(packageManager)
  const spinner = prompts.spinner()
  if (installDependencies) {
    spinner.start(`Instalando las dependencias (${install.text})`)
    const result = await runCommand(install.command, install.args, projectDir)
    if (!result.ok) {
      spinner.error('No se han podido instalar las dependencias')
      prompts.log.error(tailOutput(result.output))
      return false
    }
    spinner.stop('Dependencias instaladas')
  }
  let failed = false
  for (const check of checks) {
    const label = `${check.label} (${check.text})`
    spinner.start(label)
    const result = await runCommand(check.command, check.args, projectDir)
    if (result.ok) {
      spinner.stop(`${label}: en verde`)
      continue
    }
    failed = true
    spinner.error(`${label}: falla`)
    prompts.log.error(tailOutput(result.output))
  }
  return !failed
}
