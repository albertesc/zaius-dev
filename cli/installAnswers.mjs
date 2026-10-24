import { DEFAULT_PACKAGE_MANAGER, getDlxCommand, getExecCommand, PACKAGE_MANAGERS } from './packageManagers.mjs'

export const DEFAULT_LANGUAGE = 'es'

export const DEFAULT_PROJECT_NAME = 'Mi proyecto'

export const DEFAULT_I18N_LANGUAGES = ['es', 'en']

export const TYPES = ['web', 'app']

export const DEFAULT_TYPE = 'web'

export const PLATFORMS = ['node', 'vercel', 'netlify', 'cloudflare']

const DEFAULT_PLATFORM = 'node'

const WEB_DEFAULTS = { server: false, content: false, privateArea: false, backend: false, platform: null }

const APP_DEFAULTS = { api: true, mocks: true }

export const TYPE_DEFAULTS = { web: WEB_DEFAULTS, app: APP_DEFAULTS }

const WITHOUT_WEB = { server: null, content: null, privateArea: null, backend: null, platform: null }

const WITHOUT_APP = { api: null, mocks: null }

const TYPE_VALUES = {
  web: { human: '4321', review: '4323', unit: 'página', units: 'páginas', unitExample: 'HOME', unitDocs: 'docs/pages', specSkill: 'zaius-page' },
  app: { human: '5173', review: '5175', unit: 'historia', units: 'historias', unitExample: 'ORD001', unitDocs: 'docs/specs', specSkill: 'zaius-spec' },
}

const LANGUAGE_CODE = /^[a-z]{2,3}$/

const ANSWER_FLAGS = ['existing', 'i18n']

/**
 * Pasa el nombre del proyecto al de su paquete npm: minúsculas, sin acentos y con guiones.
 * @param name El nombre del proyecto (`Gestión de pedidos`).
 * @returns El nombre del paquete (`gestion-de-pedidos`), o `app` si no queda nada.
 */
export function slugifyName (name) {
  const slug = name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return slug === '' ? 'app' : slug
}

/**
 * Lee la lista de idiomas que se escribe en la pregunta (`es, ca`).
 * @param text Los códigos, separados por comas o espacios.
 * @returns Los códigos en minúsculas, sin repetir y en el orden escrito.
 */
export function parseLanguages (text) {
  return [...new Set(text.split(/[\s,;]+/).map((code) => code.trim().toLowerCase()).filter((code) => code !== ''))]
}

/**
 * Comprueba los idiomas de una respuesta.
 * @param languages Los códigos de idioma.
 * @param i18n Si el proyecto es multiidioma, que pide dos o más.
 * @returns El motivo por el que no valen, o `null` si valen.
 */
export function validateLanguages (languages, i18n) {
  const invalid = languages.filter((code) => !LANGUAGE_CODE.test(code))
  if (invalid.length > 0) return `Códigos de idioma que no valen: ${invalid.join(', ')}. Usa dos o tres letras (es, en, ca).`
  if (i18n && languages.length < 2) return 'Un proyecto multiidioma necesita dos idiomas o más.'
  if (!i18n && languages.length !== 1) return 'Sin multiidioma, el proyecto tiene un solo idioma.'
  return null
}

/**
 * Da las respuestas propias de un tipo, con las del otro a `null`.
 * @param type `web` o `app`.
 * @param read Las respuestas de ese tipo que se leen de un proyecto que ya existe, o `null`.
 * @returns Las de una web (`server`, `content`, `privateArea`, `backend`, `platform`) y las de una app (`api`, `mocks`): las del tipo, con sus valores por defecto; las del otro, a `null`.
 */
function getTypeDefaults (type, read) {
  return type === 'web' ? { ...WEB_DEFAULTS, ...read, ...WITHOUT_APP } : { ...WITHOUT_WEB, ...APP_DEFAULTS, ...read }
}

/**
 * Da las respuestas por defecto de una instalación.
 * @param context `folderName`, el nombre de la carpeta; `hasPackageJson`, si ya hay un proyecto en ella; `packageManager` y `type`, los que usa, si se saben; `web`, las respuestas de una web que se leen de un proyecto Astro.
 * @returns Las respuestas que se marcan de entrada en cada pregunta. El nombre es el de la carpeta en un proyecto que ya existe; uno nuevo va en una carpeta propia, así que lleva uno genérico. Las de un tipo son `null` en el otro.
 */
export function getDefaultAnswers ({ folderName, hasPackageJson, packageManager = null, type = null, web = null }) {
  const projectType = type ?? DEFAULT_TYPE
  return {
    existing: hasPackageJson,
    type: projectType,
    name: hasPackageJson ? folderName : DEFAULT_PROJECT_NAME,
    packageManager: packageManager ?? DEFAULT_PACKAGE_MANAGER,
    i18n: false,
    languages: [DEFAULT_LANGUAGE],
    ...getTypeDefaults(projectType, projectType === 'web' ? web : null),
  }
}

/**
 * Comprueba que una respuesta de opciones es una de ellas.
 * @param name El nombre de la respuesta (`packageManager`).
 * @param value Lo que vale.
 * @param choices Las opciones.
 * @throws {Error} si no es ninguna, con las que valen.
 */
function assertChoice (name, value, choices) {
  if (!choices.includes(value)) throw new Error(`La respuesta «${name}» tiene que ser ${choices.slice(0, -1).join(', ')} o ${choices.at(-1)}.`)
}

/**
 * Comprueba que unas respuestas son `true` o `false`.
 * @param answers Las respuestas.
 * @param names Las que tienen que ser de sí o no.
 * @throws {Error} si alguna no lo es.
 */
function assertFlags (answers, names) {
  for (const name of names) {
    if (typeof answers[name] !== 'boolean') throw new Error(`La respuesta «${name}» tiene que ser true o false.`)
  }
}

/**
 * Completa y comprueba las respuestas propias del tipo del proyecto.
 * @param answers Las respuestas, con las del tipo que falten a `null`.
 * @returns Las de una web y las de una app: las del tipo, completas; las del otro, a `null`. Una web con zona privada tiene servidor y API, y una con servidor, su plataforma (Node mientras no se elige otra); sin servidor, ninguna.
 * @throws {Error} si alguna no vale, con el motivo.
 */
function normalizeTypeAnswers (answers) {
  if (answers.type === 'app') {
    const app = { api: answers.api ?? APP_DEFAULTS.api, mocks: answers.mocks ?? APP_DEFAULTS.mocks }
    assertFlags(app, ['api', 'mocks'])
    return { ...WITHOUT_WEB, ...app }
  }
  const web = {
    server: answers.server ?? WEB_DEFAULTS.server,
    content: answers.content ?? WEB_DEFAULTS.content,
    privateArea: answers.privateArea ?? WEB_DEFAULTS.privateArea,
    backend: answers.backend ?? WEB_DEFAULTS.backend,
  }
  assertFlags(web, ['server', 'content', 'privateArea', 'backend'])
  const server = web.server || web.privateArea
  const platform = server ? answers.platform ?? DEFAULT_PLATFORM : null
  if (platform !== null) assertChoice('platform', platform, PLATFORMS)
  return { ...web, server, backend: web.backend || web.privateArea, platform, ...WITHOUT_APP }
}

/**
 * Completa y comprueba unas respuestas que llegan de un fichero (`--config`) o de las preguntas.
 * @param raw Las respuestas, completas o en parte.
 * @param defaults Las respuestas por defecto, para lo que falte.
 * @returns Las respuestas completas.
 * @throws {Error} si alguna no vale, con el motivo.
 */
export function normalizeAnswers (raw, defaults) {
  const answers = { ...defaults, ...raw }
  assertFlags(answers, ANSWER_FLAGS)
  if (typeof answers.name !== 'string' || answers.name.trim() === '') throw new Error('Falta el nombre del proyecto.')
  assertChoice('type', answers.type, TYPES)
  assertChoice('packageManager', answers.packageManager, PACKAGE_MANAGERS)
  const languages = Array.isArray(answers.languages) ? answers.languages.map((code) => String(code).toLowerCase()) : parseLanguages(String(answers.languages ?? ''))
  const fittedLanguages = answers.i18n || languages.length === 0 ? languages : languages.slice(0, 1)
  const problem = validateLanguages(fittedLanguages.length === 0 ? [DEFAULT_LANGUAGE] : fittedLanguages, answers.i18n)
  if (problem !== null) throw new Error(problem)
  const typeAnswers = normalizeTypeAnswers(answers)
  return {
    existing: answers.existing,
    type: answers.type,
    name: answers.name.trim(),
    packageManager: answers.packageManager,
    i18n: answers.i18n,
    languages: fittedLanguages.length === 0 ? [DEFAULT_LANGUAGE] : fittedLanguages,
    ...typeAnswers,
  }
}

/**
 * Da las condiciones de la plantilla que salen de las respuestas.
 * @param answers Las respuestas de la instalación.
 * @returns `existing` e `i18n`; una por gestor de paquetes (`npm`…) y una por tipo (`web`, `app`), verdadera la del proyecto; las de una web (`server`, `content`, `privateArea` y una por plataforma, `adapterNode`…, verdadera la suya si tiene servidor), falsas en una app, y `api`, falsa en una web; `backend`, si los datos salen de otro sistema (siempre en una app; en una web, con su API), y `mocks`, la respuesta de una app o, en una web, con su API.
 */
export function buildConditions (answers) {
  const web = answers.type === 'web'
  const app = answers.type === 'app'
  return {
    ...Object.fromEntries(ANSWER_FLAGS.map((flag) => [flag, answers[flag]])),
    ...Object.fromEntries(PACKAGE_MANAGERS.map((name) => [name, answers.packageManager === name])),
    ...Object.fromEntries(TYPES.map((name) => [name, answers.type === name])),
    server: web && answers.server === true,
    content: web && answers.content === true,
    privateArea: web && answers.privateArea === true,
    backend: app || (web && answers.backend === true),
    ...Object.fromEntries(PLATFORMS.map((name) => [`adapter${name[0].toUpperCase()}${name.slice(1)}`, web && answers.server === true && (answers.platform ?? DEFAULT_PLATFORM) === name])),
    api: app && answers.api === true,
    mocks: app ? answers.mocks === true : web && answers.backend === true,
  }
}

/**
 * Escapa un texto para ponerlo dentro de HTML.
 * @param text El texto.
 * @returns El texto con `&`, `<`, `>`, `"` y `'` escapados.
 */
function escapeHtml (text) {
  return text.replace(/[&<>"']/g, (character) => `&#${character.charCodeAt(0)};`)
}

/**
 * Da la orden que lanza el kit desde su repositorio, fijada a una versión para que nadie actualice sin querer.
 * @param source El repositorio del kit (`github:albertesc/zaius-dev`), o `null` si no tiene.
 * @param version La versión, sin la `v` de la etiqueta.
 * @returns `npx github:albertesc/zaius-dev#v0.1.0`, o `zaius-dev` sin repositorio.
 */
export function buildKitCommand (source, version) {
  return source === null ? 'zaius-dev' : `npx ${source}#v${version}`
}

/**
 * Da los valores de los placeholders de la plantilla.
 * @param answers Las respuestas de la instalación.
 * @param context `kitVersion`; `kitSource`, el repositorio del kit, o `null`; `date` (`aaaa-mm-dd`) y `timezone`, la zona horaria de los tests.
 * @returns Lo que vale cada `%%PLACEHOLDER%%`.
 */
export function buildTemplateValues (answers, { kitVersion, kitSource = null, date, timezone }) {
  const type = TYPE_VALUES[answers.type]
  return {
    APP_NAME: answers.name,
    APP_NAME_JSON: JSON.stringify(answers.name),
    APP_NAME_HTML: escapeHtml(answers.name),
    APP_SLUG: slugifyName(answers.name),
    PM: answers.packageManager,
    PM_EXEC: getExecCommand(answers.packageManager),
    PM_DLX: getDlxCommand(answers.packageManager),
    DEFAULT_LANGUAGE: answers.languages[0],
    LANGUAGES: answers.languages.join(', '),
    LANGUAGES_TS: answers.languages.map((code) => `'${code}'`).join(', '),
    TEST_TIMEZONE: timezone,
    KIND: answers.type,
    UNIT: type.unit,
    UNITS: type.units,
    UNIT_EXAMPLE: type.unitExample,
    UNIT_DOCS: type.unitDocs,
    SPEC_SKILL: type.specSkill,
    HUMAN_PORT: type.human,
    REVIEW_PORT: type.review,
    KIT_VERSION: kitVersion,
    KIT_RUN: buildKitCommand(kitSource, kitVersion),
    KIT_UPDATE: `${buildKitCommand(kitSource, '<versión>')} update`,
    DATE: date,
  }
}
