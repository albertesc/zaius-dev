import { resolve } from 'node:path'

export const CLI_COMMANDS = ['init', 'change', 'update', 'status', 'help']

export const HELP_TEXT = `zaius-dev: instala y mantiene el kit en un proyecto.

Uso: zaius-dev [orden] [opciones]

Órdenes:
  (ninguna)   Mira la carpeta: instala el kit o enseña el menú del proyecto
  init        Instala el kit en un proyecto nuevo o en uno existente
  change      Cambia una respuesta (multiidioma, la API o la zona privada de una web, mocks, terminar la migración)
  update      Pasa el proyecto a la versión del kit instalada en el equipo
  status      Enseña la versión, las respuestas y los ficheros cambiados
  help        Esta ayuda

Opciones:
  --cwd <carpeta>     Dónde se lanza (por defecto, la carpeta actual); un proyecto nuevo se crea dentro, en una carpeta con su nombre
  --config <fichero>  Las respuestas en un JSON, sin preguntas
  --yes               No pide confirmación; sin --config, usa las respuestas por defecto
  --skip-install      No instala las dependencias ni pasa las comprobaciones
`

/**
 * Lee la orden y las opciones de la línea de comandos.
 * @param argv Los argumentos, sin `node` ni el script.
 * @param cwd La carpeta desde la que se lanza.
 * @returns `command` (o `null` si no hay), `projectDir`, `configPath` (o `null`), `yes` y `skipInstall`.
 * @throws {Error} con una orden o una opción que no existen, o una opción sin su valor.
 */
export function parseCliArguments (argv, cwd) {
  const options = { command: null, projectDir: cwd, configPath: null, yes: false, skipInstall: false }
  const rest = [...argv]
  while (rest.length > 0) {
    const argument = rest.shift()
    if (argument === '--yes' || argument === '-y') options.yes = true
    else if (argument === '--skip-install') options.skipInstall = true
    else if (argument === '--help' || argument === '-h') options.command = 'help'
    else if (argument === '--cwd' || argument === '--config') {
      const value = rest.shift()
      if (value === undefined || value.startsWith('--')) throw new Error(`Falta el valor de ${argument}.`)
      if (argument === '--cwd') options.projectDir = resolve(cwd, value)
      else options.configPath = resolve(cwd, value)
    } else if (argument.startsWith('-')) {
      throw new Error(`Opción desconocida: ${argument}.`)
    } else if (options.command === null && CLI_COMMANDS.includes(argument)) {
      options.command = argument
    } else {
      throw new Error(`Orden desconocida: ${argument}.`)
    }
  }
  return options
}
