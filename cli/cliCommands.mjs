import { readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { buildKitCommand, getDefaultAnswers, normalizeAnswers, slugifyName } from './installAnswers.mjs'
import { GIT_TOOLS } from './gitRepo.mjs'
import { buildChangeWarnings, findFixedAnswerChange } from './installSummary.mjs'
import { runInstallFlow } from './installFlow.mjs'
import { askInstallQuestions } from './installQuestions.mjs'
import { buildMergeSteps, buildNextSteps } from './nextSteps.mjs'
import { detectProject } from './projectDetection.mjs'
import { readKitInfo } from './projectInstall.mjs'
import { buildStatusReport, getProjectStatus, isOlderVersion } from './projectStatus.mjs'

/**
 * Lee las respuestas de un fichero JSON (`--config`), para instalar sin preguntas.
 * @param configPath La ruta del fichero, o `null`.
 * @returns Las respuestas que trae, o `null` si no hay fichero.
 */
async function readConfigAnswers (configPath) {
  return configPath === null ? null : JSON.parse(await readFile(configPath, 'utf8'))
}

/**
 * Consigue las respuestas de una instalación: del fichero, las de por defecto con `--yes`, o preguntando.
 * @param options `configPath`, `yes`, `defaults`, `mode` (`init` o `change`), `prompts` y `questions`, lo que las preguntas saben ya (`known`, `git`, `hasPackageJson`, `validateName`).
 * @returns Las respuestas normalizadas, o `null` si se cancela.
 */
async function resolveAnswers ({ configPath, yes, defaults, mode, prompts, questions = {} }) {
  const fromConfig = await readConfigAnswers(configPath)
  const raw = fromConfig ?? (yes ? defaults : await askInstallQuestions(defaults, { mode, prompts, ...questions }))
  if (raw === null) return null
  return normalizeAnswers(raw, defaults)
}

/**
 * Da las respuestas de un proyecto con el kit, completadas con las de por defecto en lo que su manifiesto no tiene (las preguntas de una versión posterior del kit).
 * @param detected Lo que da `detectProject`, con el manifiesto.
 * @returns Las respuestas, sin comprobar con `normalizeAnswers`.
 */
function getProjectAnswers (detected) {
  const { answers } = detected.manifest
  return { ...getDefaultAnswers({ ...detected, type: answers.type ?? null, web: null }), ...answers }
}

/**
 * Avisa del tipo que se ha leído de un proyecto que ya existe: una web si usa Astro, una app si usa React.
 * @param detected Lo que da `detectProject`.
 * @param prompts El módulo de preguntas.
 */
function logDetectedType (detected, prompts) {
  if (detected.type === 'web') prompts.log.info('Es un proyecto Astro: lo trato como una web, con lo que se lee de su configuración.')
  if (detected.type === 'app') prompts.log.info('Es un proyecto React: lo trato como una app.')
}

/**
 * Para una orden lanzada con un kit más antiguo que el del proyecto: volver a generar sus ficheros con él lo bajaría de versión.
 * @param kit El kit que se ejecuta.
 * @param manifest El manifiesto del proyecto.
 * @param command La orden (`change`, `update`), para decir con qué versión lanzarla.
 * @param prompts El módulo de preguntas.
 * @returns `true` si el kit es más antiguo y la orden no sigue.
 */
function stopOlderKit (kit, manifest, command, prompts) {
  if (!isOlderVersion(kit.version, manifest.kitVersion)) return false
  prompts.log.warn(`Este proyecto tiene el kit ${manifest.kitVersion} y esta orden es la ${kit.version}: lánzala con «${buildKitCommand(kit.source, manifest.kitVersion)} ${command}».`)
  return true
}

/**
 * Dice si la carpeta de un proyecto nuevo ya está ocupada: existe y tiene algo más que ficheros ocultos. Es síncrona porque la usa también la pregunta del nombre, al escribirlo.
 * @param dir La carpeta.
 * @returns `true` si ya tiene ficheros.
 */
function isFolderTaken (dir) {
  try {
    return readdirSync(dir).some((name) => !name.startsWith('.'))
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}

/**
 * Comprueba el nombre de un proyecto nuevo: su carpeta, dentro de la carpeta desde la que se lanza, no puede tener ya ficheros.
 * @param projectDir La carpeta desde la que se lanza.
 * @param name El nombre escrito.
 * @returns El motivo por el que no vale, o `undefined` si vale.
 */
function validateNewProjectName (projectDir, name) {
  const folder = slugifyName(name)
  return isFolderTaken(join(projectDir, folder)) ? `Ya hay una carpeta ${folder} con ficheros: elige otro nombre para el proyecto.` : undefined
}

/**
 * Da la carpeta donde se instala: la del proyecto que ya existe o, en uno nuevo, una con su nombre dentro de la carpeta desde la que se lanza.
 * @param projectDir La carpeta desde la que se lanza.
 * @param answers Las respuestas, ya normalizadas.
 * @returns La carpeta del proyecto, o `null` si la nueva ya existe y tiene algo más que ficheros ocultos.
 */
function resolveTargetDir (projectDir, answers) {
  if (answers.existing) return projectDir
  const targetDir = join(projectDir, slugifyName(answers.name))
  return isFolderTaken(targetDir) ? null : targetDir
}

/**
 * Escribe un mensaje de varias líneas en un recuadro, con su título.
 * @param prompts El módulo de preguntas.
 * @param lines Las líneas.
 * @param title El título del recuadro.
 */
function printNote (prompts, lines, title) {
  if (lines.length > 0) prompts.note(lines.join('\n'), title)
}

/**
 * Ajusta la respuesta de git a lo que hay en la carpeta, también cuando llega de `--config`: un proyecto dentro de un repositorio lo tiene, y sin git instalado no se puede iniciar uno.
 * @param answers Las respuestas, ya normalizadas.
 * @param state `installed` e `inRepo`, el de la carpeta en la que se instala.
 * @param prompts El módulo de preguntas, para avisar.
 * @returns Las respuestas, con `git` ajustado.
 */
function fitGitAnswer (answers, state, prompts) {
  if (state.inRepo) return { ...answers, git: true }
  if (answers.git && !state.installed) {
    prompts.log.warn('git no está instalado en este equipo: el proyecto va sin historial de cambios. Cuando lo instales, «change» lo añade.')
    return { ...answers, git: false }
  }
  return answers
}

/**
 * `zaius-dev init`: instala el kit en un proyecto nuevo, en una carpeta con su nombre, o en uno existente, en su carpeta.
 * @param options `projectDir`, `kitDir`, `configPath`, `yes`, `skipInstall`, `prompts` y `git` (lo que se hace con git; uno falso en los tests).
 * @returns El código de salida: 0 si ha ido bien.
 */
export async function runInitCommand ({ projectDir, kitDir, configPath, yes, skipInstall, prompts, git = GIT_TOOLS }) {
  const kit = await readKitInfo(kitDir)
  const detected = await detectProject(projectDir, git)
  prompts.intro(`zaius-dev ${kit.version}`)
  prompts.log.info(`Carpeta: ${projectDir}${detected.isEmpty ? ' (vacía)' : ''}`)
  if (detected.manifest !== null) {
    prompts.log.warn(`Este proyecto ya tiene el kit: usa «${kit.run} status», «change» o «update».`)
    return 1
  }
  logDetectedType(detected, prompts)
  const questions = { known: detected.known, git: detected.git, hasPackageJson: detected.hasPackageJson, validateName: (name) => validateNewProjectName(projectDir, name) }
  const resolved = await resolveAnswers({ configPath, yes, defaults: getDefaultAnswers(detected), mode: 'init', prompts, questions })
  if (resolved === null) {
    prompts.cancel('Instalación cancelada.')
    return 1
  }
  const targetDir = resolveTargetDir(projectDir, resolved)
  if (targetDir === null) {
    prompts.log.warn(validateNewProjectName(projectDir, resolved.name))
    return 1
  }
  if (targetDir !== projectDir) prompts.log.info(`El proyecto va en una carpeta nueva: ${targetDir}`)
  const answers = fitGitAnswer(resolved, { ...detected.git, inRepo: await git.isInsideRepo(targetDir) }, prompts)
  const outcome = await runInstallFlow({ projectDir: targetDir, kitDir, answers, yes, skipInstall, prompts, git })
  if (outcome === null) return 1
  printNote(prompts, buildNextSteps(answers, kit.run, targetDir === projectDir ? null : basename(targetDir)), 'Ahora te toca a ti')
  prompts.outro(outcome.ok ? 'Listo.' : 'Instalado, con comprobaciones por revisar.')
  return outcome.ok ? 0 : 1
}

/**
 * `zaius-dev change`: cambia una respuesta (pasar a multiidioma, añadir una zona privada a una web, quitar los mocks, guardar el historial con git, terminar la migración…).
 * @param options `projectDir`, `kitDir`, `configPath`, `yes`, `skipInstall`, `prompts` y `git`.
 * @returns El código de salida: 0 si ha ido bien.
 */
export async function runChangeCommand ({ projectDir, kitDir, configPath, yes, skipInstall, prompts, git = GIT_TOOLS }) {
  const kit = await readKitInfo(kitDir)
  const detected = await detectProject(projectDir, git)
  const { manifest } = detected
  prompts.intro(`zaius-dev ${kit.version}: cambiar respuestas`)
  if (manifest === null) {
    prompts.log.warn(`Este proyecto no tiene el kit: empieza con «${kit.run} init».`)
    return 1
  }
  if (stopOlderKit(kit, manifest, 'change', prompts)) return 1
  const defaults = getProjectAnswers(detected)
  const fromConfig = await readConfigAnswers(configPath)
  const resolved = fromConfig === null
    ? await resolveAnswers({ configPath: null, yes, defaults, mode: 'change', prompts, questions: { known: detected.known, git: detected.git } })
    : normalizeAnswers(fromConfig, defaults)
  if (resolved === null) {
    prompts.cancel('No se ha cambiado nada.')
    return 1
  }
  const answers = fitGitAnswer(resolved, detected.git, prompts)
  const fixed = manifest.answers.existing ? null : findFixedAnswerChange(defaults, answers)
  if (fixed !== null) {
    prompts.log.warn(fixed)
    return 1
  }
  for (const warning of buildChangeWarnings(defaults, answers)) prompts.log.warn(warning)
  const outcome = await runInstallFlow({ projectDir, kitDir, answers, yes, skipInstall, prompts, git })
  if (outcome === null) return 0
  printNote(prompts, buildMergeSteps(outcome.result.groups.kitNew), 'Por fusionar')
  if (manifest.answers.existing && !answers.existing) printNote(prompts, buildNextSteps(answers, kit.run), 'Migración terminada')
  prompts.outro(outcome.ok ? 'Listo.' : 'Cambiado, con comprobaciones por revisar.')
  return outcome.ok ? 0 : 1
}

/**
 * `zaius-dev update`: pasa el proyecto a la versión del kit instalada en el equipo, con las mismas respuestas.
 * @param options `projectDir`, `kitDir`, `yes`, `skipInstall`, `prompts` y `git`.
 * @returns El código de salida: 0 si ha ido bien. La respuesta de git sale de lo que hay: con repositorio, sí; sin él, no (la actualización nunca inicia uno).
 */
export async function runUpdateCommand ({ projectDir, kitDir, yes, skipInstall, prompts, git = GIT_TOOLS }) {
  const kit = await readKitInfo(kitDir)
  const detected = await detectProject(projectDir, git)
  const { manifest } = detected
  prompts.intro(`zaius-dev ${kit.version}: actualizar`)
  if (manifest === null) {
    prompts.log.warn(`Este proyecto no tiene el kit: empieza con «${kit.run} init».`)
    return 1
  }
  if (stopOlderKit(kit, manifest, 'update', prompts)) return 1
  prompts.log.info(`Del kit ${manifest.kitVersion} al ${kit.version}. Los cambios de cada versión están en el CHANGELOG.md del kit.`)
  const answers = { ...normalizeAnswers(getProjectAnswers(detected), getDefaultAnswers(detected)), git: detected.git.inRepo }
  const outcome = await runInstallFlow({ projectDir, kitDir, answers, yes, skipInstall, prompts, git })
  if (outcome === null) return 0
  printNote(prompts, buildMergeSteps(outcome.result.groups.kitNew), 'Por fusionar')
  prompts.outro(outcome.ok ? 'Listo.' : 'Actualizado, con comprobaciones por revisar.')
  return outcome.ok ? 0 : 1
}

/**
 * `zaius-dev status`: enseña la versión del kit, las respuestas y el estado de sus ficheros.
 * @param options `projectDir`, `kitDir` y `prompts`.
 * @returns El código de salida: 0 si el proyecto tiene el kit.
 */
export async function runStatusCommand ({ projectDir, kitDir, prompts }) {
  const kit = await readKitInfo(kitDir)
  const detected = await detectProject(projectDir)
  const { manifest } = detected
  if (manifest === null) {
    prompts.log.warn(`Este proyecto no tiene el kit: empieza con «${kit.run} init».`)
    return 1
  }
  const report = buildStatusReport({ ...manifest, answers: getProjectAnswers(detected) }, await getProjectStatus(projectDir, manifest), { version: kit.version, dir: kitDir, run: kit.run })
  printNote(prompts, report, 'Estado del kit')
  return 0
}

/**
 * Elige la orden cuando se lanza `zaius-dev` sin ninguna: instalar, o el menú de un proyecto con el kit.
 * @param options `projectDir` y `prompts`.
 * @returns `init`, `change`, `update` o `status`, o `null` si se cancela.
 */
export async function chooseCommand ({ projectDir, prompts }) {
  const { manifest } = await detectProject(projectDir)
  if (manifest === null) return 'init'
  const command = await prompts.select({
    message: 'Este proyecto ya tiene el kit. ¿Qué quieres hacer?',
    options: [
      { value: 'status', label: 'Ver el estado', hint: 'La versión, las respuestas y los ficheros cambiados' },
      { value: 'change', label: 'Cambiar una respuesta', hint: manifest.answers.existing ? 'También para terminar la migración' : manifest.answers.type === 'web' ? 'La zona privada, la API, el servidor, el blog, multiidioma o git' : 'La API, los mocks, multiidioma o git' },
      { value: 'update', label: 'Actualizar el kit', hint: 'A la versión instalada en el equipo, con las mismas respuestas' },
    ],
  })
  return prompts.isCancel(command) ? null : command
}
