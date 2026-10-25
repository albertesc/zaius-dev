import * as clack from '@clack/prompts'
import { DEFAULT_I18N_LANGUAGES, parseLanguages, TYPE_DEFAULTS, validateLanguages } from './installAnswers.mjs'

const YES = 'yes'
const NO = 'no'

export const INSTALL_QUESTIONS = {
  existing: {
    message: '¿Es un proyecto nuevo o uno que ya existe?',
    options: [
      { value: NO, label: 'Nuevo', hint: 'Lo creo desde cero y lo dejo listo para empezar a trabajar con la IA' },
      { value: YES, label: 'Existente', hint: 'No toco tu código: dejo mis ficheros al lado (.kit-new) y la IA propone cómo ordenarlo' },
    ],
  },
  migrationDone: {
    message: '¿Ha terminado ya la migración?',
    options: [
      { value: NO, label: 'Todavía no', hint: 'Sigue con la documentación y las skills' },
      { value: YES, label: 'Sí', hint: 'Instalo el código base del kit y la comprobación de la estructura' },
    ],
  },
  type: {
    message: '¿Qué vas a construir?',
    options: [
      { value: 'web', label: 'Una web (Astro)', hint: 'Páginas que se leen y se encuentran en los buscadores: un negocio, un blog. Una zona privada pequeña se puede añadir después' },
      { value: 'app', label: 'Una app (React)', hint: 'Pantallas de trabajo con datos, como una herramienta de gestión, con una API o sin ella' },
    ],
  },
  name: {
    message: '¿Cómo se llama el proyecto? (uno nuevo se crea en una carpeta con este nombre; sale en AGENTS.md, en el README y en la pestaña del navegador)',
  },
  packageManager: {
    message: '¿Con qué gestor de paquetes?',
    options: [
      { value: 'npm', label: 'npm', hint: 'El que viene con Node; si no lo sabes, este' },
      { value: 'pnpm', label: 'pnpm' },
      { value: 'yarn', label: 'yarn', hint: 'Yarn 1 o Yarn 4' },
      { value: 'bun', label: 'bun' },
    ],
  },
  git: {
    message: '¿Guardamos el historial de cambios con git?',
    options: [
      { value: YES, label: 'Sí', hint: 'Inicio un repositorio git, sin ningún commit. Los commits y los push los haces tú; la IA te propone el mensaje y solo los hace si se lo pides' },
      { value: NO, label: 'No', hint: 'Sin historial de cambios; se añade después con change' },
    ],
  },
  i18n: {
    message: '¿Va a estar en más de un idioma?',
    options: [
      { value: NO, label: 'No', hint: 'Un solo idioma; sus textos van igual en un catálogo, y se añaden idiomas cuando haga falta' },
      { value: YES, label: 'Sí', hint: 'Cada texto, en el catálogo de cada idioma, con sus direcciones (/en/…)' },
    ],
  },
  languages: {
    message: '¿Qué idiomas? Sus códigos, separados por comas (es, en, ca); el primero es el de por defecto',
  },
  server: {
    message: '¿La web recibe mensajes o datos de quien la visita (un formulario de contacto, una petición de presupuesto)?',
    options: [
      { value: NO, label: 'No', hint: 'Solo páginas: sin servidor, más rápida y más fácil de publicar' },
      { value: YES, label: 'Sí', hint: 'Con un servidor que los recibe; dónde se publica se elige al publicar' },
    ],
  },
  content: {
    message: '¿Lleva blog, noticias o artículos?',
    options: [
      { value: NO, label: 'No', hint: 'Se pueden añadir más adelante' },
      { value: YES, label: 'Sí', hint: 'Se escriben en Markdown, en colecciones de contenido' },
    ],
  },
  backend: {
    message: '¿La web muestra datos que salen de otro sistema (una API), como las reservas de verdad?',
    options: [
      { value: NO, label: 'No', hint: 'Los datos van en la propia web y se cambian pidiéndoselo a la IA' },
      { value: YES, label: 'Sí', hint: 'Añado el transporte, los services y unos datos de ejemplo para trabajar sin ella' },
    ],
  },
  privateArea: {
    message: '¿La web tiene una zona privada, en la que se entra con una cuenta (la de los clientes)?',
    options: [
      { value: NO, label: 'No', hint: 'Toda la web es pública' },
      { value: YES, label: 'Sí', hint: 'Añado el servidor, la sesión y los permisos; si lo principal es esa zona, es mejor una app' },
    ],
  },
  platform: {
    message: '¿Dónde se va a publicar la web? El servidor cambia según la plataforma',
    options: [
      { value: 'node', label: 'Node', hint: 'Un servidor propio, con Node; si no lo sabes todavía, este' },
      { value: 'vercel', label: 'Vercel' },
      { value: 'netlify', label: 'Netlify' },
      { value: 'cloudflare', label: 'Cloudflare', hint: 'Workers, con wrangler' },
    ],
  },
  appBackend: {
    message: '¿La app saca sus datos de una API, la de un sistema que ya existe o una que se hará?',
    options: [
      { value: YES, label: 'Sí', hint: 'Con el transporte, los services, la sesión y los permisos; la API se documenta en docs/api/' },
      { value: NO, label: 'No', hint: 'Sin API: lo que la app guarde se decide en zaius-init (en el navegador, por ejemplo); la API se añade después con change' },
    ],
  },
  mocks: {
    message: '¿Quieres datos de ejemplo para avanzar sin esperar a la API?',
    options: [
      { value: YES, label: 'Sí', hint: 'La app arranca con respuestas inventadas que imitan las reales (mocks)' },
      { value: NO, label: 'No', hint: 'La app usa siempre la API de verdad' },
    ],
  },
}

const TYPE_QUESTIONS = { web: ['server', 'content'], app: ['backend', 'mocks'] }

const APP_QUESTIONS = { backend: 'appBackend' }

const KNOWN_LABELS = { type: 'tipo', packageManager: 'gestor', server: 'servidor', content: 'contenido', backend: 'API', platform: 'plataforma' }

/**
 * Hace una pregunta de sí o no con sus dos opciones y la respuesta actual marcada.
 * @param prompts El módulo de preguntas (`@clack/prompts`, o uno falso en los tests).
 * @param question La pregunta de `INSTALL_QUESTIONS`.
 * @param current La respuesta que se marca de entrada.
 * @returns `true` o `false`, o `null` si se cancela.
 */
async function askYesNo (prompts, question, current) {
  const answer = await prompts.select({ ...question, initialValue: current ? YES : NO })
  return prompts.isCancel(answer) ? null : answer === YES
}

/**
 * Hace una pregunta de opciones con la respuesta actual marcada.
 * @param prompts El módulo de preguntas (`@clack/prompts`, o uno falso en los tests).
 * @param question La pregunta de `INSTALL_QUESTIONS`.
 * @param current La respuesta que se marca de entrada.
 * @returns La opción elegida, o `null` si se cancela.
 */
async function askSelect (prompts, question, current) {
  const answer = await prompts.select({ ...question, initialValue: current })
  return prompts.isCancel(answer) ? null : answer
}

/**
 * Dice lo que se toma de un proyecto existente sin preguntarlo, porque su código ya lo fija.
 * @param prompts El módulo de preguntas.
 * @param known Las respuestas que fija el proyecto.
 */
function logKnownAnswers (prompts, known) {
  const parts = Object.entries(known).map(([key, value]) => `${KNOWN_LABELS[key]}: ${value === true ? 'sí' : value}`)
  if (parts.length > 0) prompts.log?.info(`Tomado del proyecto, sin preguntarlo: ${parts.join(', ')}.`)
}

/**
 * Pregunta si el proyecto guarda su historial con git, solo si se puede elegir: un proyecto que ya está en un repositorio lo tiene, y sin git instalado no se puede iniciar uno.
 * @param prompts El módulo de preguntas.
 * @param state `installed` e `inRepo`, de `detectProject`.
 * @param current La respuesta que se marca de entrada.
 * @returns `true` o `false`, o `null` si se cancela.
 */
async function askGit (prompts, state, current) {
  if (state.inRepo) {
    prompts.log?.info('La carpeta ya está en un repositorio git: el proyecto guarda su historial en él.')
    return true
  }
  if (!state.installed) {
    prompts.log?.info('git no está instalado en este equipo: el proyecto va sin historial de cambios. Cuando lo instales, «change» lo añade.')
    return false
  }
  return askYesNo(prompts, INSTALL_QUESTIONS.git, current)
}

/**
 * Pregunta los idiomas de un proyecto multiidioma, con los de ahora o los de por defecto marcados.
 * @param prompts El módulo de preguntas.
 * @param current Los idiomas de ahora.
 * @returns Los códigos, o `null` si se cancela.
 */
async function askLanguages (prompts, current) {
  const initial = (current.length > 1 ? current : DEFAULT_I18N_LANGUAGES).join(', ')
  const languages = await prompts.text({
    ...INSTALL_QUESTIONS.languages,
    placeholder: initial,
    defaultValue: initial,
    initialValue: initial,
    validate: (value) => validateLanguages(parseLanguages(value ?? ''), true) ?? undefined,
  })
  return prompts.isCancel(languages) ? null : parseLanguages(languages)
}

/**
 * Hace las preguntas de sí o no del tipo del proyecto que no fija ya su código, con la respuesta actual marcada o, si no la hay (se acaba de elegir el tipo), la de por defecto del tipo. Una app pregunta primero si tiene API y, solo con ella, por los mocks. En `change`, una web pregunta también por la API, por la zona privada y, con servidor, por la plataforma en la que se publica.
 * @param prompts El módulo de preguntas.
 * @param answers Las respuestas de partida, con el tipo ya elegido.
 * @param options `mode`, `known` (las que fija el proyecto) y `typeChanged`, si el tipo no es el de las respuestas de partida, que entonces no valen para él.
 * @returns Las respuestas del tipo, o `null` si se cancela.
 */
async function askTypeQuestions (prompts, answers, { mode, known, typeChanged }) {
  const names = [...TYPE_QUESTIONS[answers.type], ...(answers.type === 'web' && mode === 'change' ? ['backend', 'privateArea'] : [])]
  const result = {}
  for (const name of names) {
    if (answers.type === 'app' && name === 'mocks' && !result.backend) {
      result.mocks = false
      continue
    }
    const question = INSTALL_QUESTIONS[answers.type === 'app' ? APP_QUESTIONS[name] ?? name : name]
    const current = typeChanged ? TYPE_DEFAULTS[answers.type][name] : answers[name] ?? TYPE_DEFAULTS[answers.type][name]
    const answer = known[name] ?? await askYesNo(prompts, question, current)
    if (answer === null) return null
    result[name] = answer
  }
  if (answers.type === 'web' && mode === 'change' && (result.server || result.privateArea)) {
    result.platform = known.platform ?? await askSelect(prompts, INSTALL_QUESTIONS.platform, answers.platform ?? 'node')
    if (result.platform === null) return null
  }
  return result
}

/**
 * Hace las preguntas de la instalación, con las respuestas por defecto (o las actuales) marcadas. No pregunta lo que ya se sabe.
 * @param defaults Las respuestas de partida.
 * @param options `mode`: `init` pregunta si es nuevo o existente, solo si la carpeta tiene `package.json` (sin él, solo puede ser nuevo); `change`, en un proyecto existente, si ha terminado la migración, y no pregunta el tipo a uno que ya tiene el código del kit. `known`: lo que el código de un proyecto existente ya fija (el tipo, el gestor, el servidor, el contenido), que en un existente no se pregunta. `git`: lo que se sabe de git (`installed`, `inRepo`). `hasPackageJson`. `validateName`: comprueba el nombre de un proyecto nuevo al escribirlo y da el motivo si no vale. `prompts`, el módulo de preguntas.
 * @returns Las respuestas, sin comprobar con `normalizeAnswers`, o `null` si se cancela.
 */
export async function askInstallQuestions (defaults, { mode = 'init', prompts = clack, known = {}, git = { installed: true, inRepo: false }, hasPackageJson = true, validateName = () => undefined } = {}) {
  const answers = { ...defaults }
  if (mode === 'init') {
    answers.existing = hasPackageJson ? await askYesNo(prompts, INSTALL_QUESTIONS.existing, defaults.existing) : false
  } else if (defaults.existing) {
    const done = await askYesNo(prompts, INSTALL_QUESTIONS.migrationDone, false)
    answers.existing = done === null ? null : !done
  }
  if (answers.existing === null) return null
  const fixed = answers.existing ? known : {}
  logKnownAnswers(prompts, fixed)
  if (mode === 'init' || defaults.existing) {
    answers.type = fixed.type ?? await askSelect(prompts, INSTALL_QUESTIONS.type, defaults.type)
    if (answers.type === null) return null
  }
  const name = await prompts.text({
    ...INSTALL_QUESTIONS.name,
    placeholder: defaults.name,
    defaultValue: defaults.name,
    initialValue: defaults.name,
    validate: (value) => answers.existing ? undefined : validateName(value?.trim() || defaults.name),
  })
  if (prompts.isCancel(name)) return null
  answers.name = name
  answers.packageManager = fixed.packageManager ?? await askSelect(prompts, INSTALL_QUESTIONS.packageManager, defaults.packageManager)
  if (answers.packageManager === null) return null
  answers.git = await askGit(prompts, git, defaults.git)
  if (answers.git === null) return null
  answers.i18n = await askYesNo(prompts, INSTALL_QUESTIONS.i18n, defaults.i18n)
  if (answers.i18n === null) return null
  answers.languages = answers.i18n ? await askLanguages(prompts, defaults.languages) : defaults.languages.slice(0, 1)
  if (answers.languages === null) return null
  const typeAnswers = await askTypeQuestions(prompts, answers, { mode, known: fixed, typeChanged: answers.type !== defaults.type })
  return typeAnswers === null ? null : { ...answers, ...typeAnswers }
}
