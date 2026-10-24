/**
 * Arma el «Ahora te toca a ti» del final de una instalación: lo mismo que «Primeros pasos» del README del proyecto.
 * @param answers Las respuestas de la instalación; un proyecto existente lleva sus pasos de migración.
 * @param kitRun La orden que lanza esta versión del kit (`npx github:albertesc/zaius-dev#v0.1.0`).
 * @param folder La carpeta nueva del proyecto, en la que hay que entrar, o `null` si ya se está en ella.
 * @returns Las líneas del mensaje.
 */
export function buildNextSteps (answers, kitRun, folder = null) {
  const web = answers.type === 'web'
  const unit = web ? 'HOME' : 'RES001'
  const steps = answers.existing
    ? [
        '1. Abre la IA en esta carpeta (claude u opencode).',
        '2. Escribe /zaius-init',
        '   (en opencode: «usa la skill zaius-init»).',
        `   Te preguntará por la ${web ? 'web' : 'app'} y por cómo se verá, y después`,
        '   analizará el proyecto y propondrá cómo traerlo, por bloques.',
        '   Hasta entonces, la IA no empezará ninguna otra tarea.',
        '3. Revisa con la IA los ficheros .kit-new: son las versiones',
        '   del kit de ficheros que el proyecto ya tenía.',
        '4. Mira docs/next-steps.md, en «Dónde estamos».',
        '5. Al terminar, el código base y las comprobaciones de la',
        '   estructura llegan con «change».',
      ]
    : [
        '1. Abre la IA en esta carpeta (claude u opencode).',
        '2. Escribe /zaius-init',
        '   (en opencode: «usa la skill zaius-init»).',
        `   Te preguntará por la ${web ? 'web' : 'app'} y por cómo se verá, y lo dejará`,
        '   escrito, con una guía visual; no hace falta saber programar.',
        `3. /zaius-backlog: ${web ? 'las páginas y el mapa del sitio' : 'las épicas y las historias de usuario'}.`,
        `4. Para cada ${web ? 'página' : 'historia'}, tres pasos, y cada uno espera tu OK:`,
        `   /zaius-${web ? 'page' : 'spec'} ${unit}    ${web ? 'su documento, su boceto y sus tests' : 'sus criterios, su boceto y sus tests'}`,
        `   /zaius-build ${unit}   la construye contigo, test a test`,
        `   /zaius-review ${unit}  la revisa y, con tu OK, la da por hecha`,
        '5. Mira docs/next-steps.md, en «Dónde estamos»: ahí está siempre',
        '   por dónde va el trabajo, también al abrir una sesión nueva.',
      ]
  const commands = answers.existing
    ? []
    : [
        [`${answers.packageManager} run dev`, `arranca la ${web ? 'web' : 'app'}${answers.mocks ? ' con los datos de prueba (mocks)' : ''}`],
        [`${answers.packageManager} run test`, 'los tests, también el de la estructura'],
      ]
  const width = Math.max(0, ...commands.map(([command]) => command.length)) + 3
  return [
    'Ahora te toca a ti:',
    '',
    ...(folder === null ? [] : [`Primero, entra en la carpeta del proyecto: cd ${folder}`, '']),
    ...steps,
    '',
    ...commands.map(([command, text]) => `${command.padEnd(width)}${text}`),
    'El kit, con la versión de este proyecto (status, change, update):',
    `  ${kitRun} status`,
  ]
}

/**
 * Arma el aviso del final de un cambio o una actualización que ha dejado versiones nuevas al lado (`.kit-new`).
 * @param kitNewPaths Los ficheros que tienen su `.kit-new`.
 * @returns Las líneas del aviso, o ninguna si no hay nada que fusionar.
 */
export function buildMergeSteps (kitNewPaths) {
  if (kitNewPaths.length === 0) return []
  return [
    'Hay versiones nuevas del kit de ficheros que el proyecto ha cambiado:',
    '',
    ...kitNewPaths.map((path) => `  ${path}.kit-new`),
    '',
    'Pide a la IA «fusiona las versiones del kit» (skill zaius-merge):',
    'las fusiona con lo que ha cambiado el proyecto y te pide el OK.',
  ]
}
