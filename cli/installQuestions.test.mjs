import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getDefaultAnswers } from './installAnswers.mjs'
import { askInstallQuestions, INSTALL_QUESTIONS } from './installQuestions.mjs'

const CANCEL = Symbol('cancel')

/**
 * Crea un módulo de preguntas falso que responde lo que se le da, por orden, y apunta lo que se le pregunta.
 * @param replies Las respuestas, en el orden de las preguntas.
 * @returns El módulo, con `asked`, las preguntas que ha recibido, y `logged`, los avisos que ha escrito.
 */
function createPrompts (replies) {
  const asked = []
  const reply = (options) => {
    asked.push(options)
    return Promise.resolve(replies.shift())
  }
  const logged = []
  return { asked, logged, select: reply, text: reply, isCancel: (value) => value === CANCEL, log: { info: (message) => logged.push(message) } }
}

/**
 * Da los mensajes de las preguntas que se han hecho.
 * @param prompts El módulo de preguntas falso.
 * @returns Los mensajes, en orden.
 */
function askedMessages (prompts) {
  return prompts.asked.map(({ message }) => message)
}

const defaults = getDefaultAnswers({ folderName: 'pedidos', hasPackageJson: false })

const appDefaults = getDefaultAnswers({ folderName: 'pedidos', hasPackageJson: false, type: 'app' })

describe('askInstallQuestions', () => {
  it('hace las preguntas en orden y con las respuestas por defecto marcadas', async () => {
    const prompts = createPrompts(['no', 'web', 'Gestión de pedidos', 'pnpm', 'yes', 'no', 'yes', 'no'])

    const answers = await askInstallQuestions(defaults, { prompts })

    assert.deepEqual(answers, { ...defaults, existing: false, type: 'web', name: 'Gestión de pedidos', packageManager: 'pnpm', git: true, i18n: false, languages: ['es'], server: true, content: false })
    assert.deepEqual(askedMessages(prompts), [
      INSTALL_QUESTIONS.existing.message,
      INSTALL_QUESTIONS.type.message,
      INSTALL_QUESTIONS.name.message,
      INSTALL_QUESTIONS.packageManager.message,
      INSTALL_QUESTIONS.git.message,
      INSTALL_QUESTIONS.i18n.message,
      INSTALL_QUESTIONS.server.message,
      INSTALL_QUESTIONS.content.message,
    ])
    assert.deepEqual(prompts.asked.map(({ initialValue }) => initialValue), ['no', 'web', 'Mi proyecto', 'npm', 'no', 'no', 'no', 'no'])
  })

  it('al elegir una app en un proyecto nuevo, marca el Sí de la API y de los mocks', async () => {
    const prompts = createPrompts(['no', 'app', 'Pedidos', 'npm', 'no', 'no', 'yes', 'yes'])

    const answers = await askInstallQuestions(defaults, { prompts })

    assert.equal(answers.type, 'app')
    assert.deepEqual(prompts.asked.slice(-2).map(({ message, initialValue }) => [message, initialValue]), [
      [INSTALL_QUESTIONS.appBackend.message, 'yes'],
      [INSTALL_QUESTIONS.mocks.message, 'yes'],
    ])
  })

  it('pone el No primero en la pregunta del multiidioma', () => {
    assert.deepEqual(INSTALL_QUESTIONS.i18n.options.map(({ value }) => value), ['no', 'yes'])
  })

  it('en una app pregunta por la API y los mocks, y no por las preguntas de una web', async () => {
    const prompts = createPrompts(['no', 'app', 'Pedidos', 'npm', 'no', 'no', 'yes', 'no'])

    const answers = await askInstallQuestions(appDefaults, { prompts })

    assert.deepEqual([answers.type, answers.backend, answers.mocks], ['app', true, false])
    assert.deepEqual(askedMessages(prompts).slice(6), [INSTALL_QUESTIONS.appBackend.message, INSTALL_QUESTIONS.mocks.message])
    assert.deepEqual(prompts.asked.slice(6).map(({ initialValue }) => initialValue), ['yes', 'yes'])
  })

  it('al instalar una web no pregunta por la zona privada', async () => {
    const prompts = createPrompts(['no', 'web', 'Pedidos', 'npm', 'no', 'no', 'no', 'no'])

    await askInstallQuestions(defaults, { prompts })

    assert.ok(!askedMessages(prompts).includes(INSTALL_QUESTIONS.privateArea.message))
  })

  it('pregunta los idiomas solo con multiidioma', async () => {
    const prompts = createPrompts(['no', 'web', 'Pedidos', 'npm', 'no', 'yes', 'es, ca', 'no', 'no'])

    const answers = await askInstallQuestions(defaults, { prompts })

    assert.deepEqual(answers.languages, ['es', 'ca'])
    assert.equal(prompts.asked[6].message, INSTALL_QUESTIONS.languages.message)
    assert.equal(prompts.asked[6].initialValue, 'es, en')
    assert.match(prompts.asked[6].validate('es'), /dos idiomas o más/)
    assert.equal(prompts.asked[6].validate('es, ca'), undefined)
  })

  it('al cambiar un proyecto existente pregunta si ha terminado la migración y el tipo', async () => {
    const prompts = createPrompts(['yes', 'app', 'Pedidos', 'npm', 'no', 'no', 'yes', 'yes'])

    const answers = await askInstallQuestions({ ...defaults, existing: true }, { mode: 'change', prompts })

    assert.deepEqual([answers.existing, answers.type], [false, 'app'])
    assert.equal(prompts.asked[0].message, INSTALL_QUESTIONS.migrationDone.message)
    assert.equal(prompts.asked[0].initialValue, 'no')
    assert.equal(prompts.asked[1].message, INSTALL_QUESTIONS.type.message)
  })

  it('al cambiar un proyecto que sigue en migración no pregunta lo que su código ya fija', async () => {
    const prompts = createPrompts(['no', 'Pedidos', 'no', 'no', 'no', 'no', 'no'])

    const answers = await askInstallQuestions({ ...defaults, existing: true }, { mode: 'change', prompts, known: { type: 'web', packageManager: 'pnpm', server: true, platform: 'netlify' } })

    assert.deepEqual([answers.existing, answers.type, answers.packageManager, answers.server, answers.backend, answers.privateArea, answers.platform], [true, 'web', 'pnpm', true, false, false, 'netlify'])
    assert.deepEqual(askedMessages(prompts), [
      INSTALL_QUESTIONS.migrationDone.message,
      INSTALL_QUESTIONS.name.message,
      INSTALL_QUESTIONS.git.message,
      INSTALL_QUESTIONS.i18n.message,
      INSTALL_QUESTIONS.content.message,
      INSTALL_QUESTIONS.backend.message,
      INSTALL_QUESTIONS.privateArea.message,
    ])
  })

  it('al cambiar una web con el código del kit no pregunta el tipo, y sí la API y la zona privada', async () => {
    const current = { ...defaults, server: true, backend: true, privateArea: true, platform: 'node' }
    const prompts = createPrompts(['Pedidos', 'npm', 'no', 'no', 'yes', 'no', 'yes', 'no', 'vercel'])

    const answers = await askInstallQuestions(current, { mode: 'change', prompts })

    assert.deepEqual([answers.existing, answers.type, answers.server, answers.content, answers.backend, answers.privateArea, answers.platform], [false, 'web', true, false, true, false, 'vercel'])
    assert.deepEqual(askedMessages(prompts), [
      INSTALL_QUESTIONS.name.message,
      INSTALL_QUESTIONS.packageManager.message,
      INSTALL_QUESTIONS.git.message,
      INSTALL_QUESTIONS.i18n.message,
      INSTALL_QUESTIONS.server.message,
      INSTALL_QUESTIONS.content.message,
      INSTALL_QUESTIONS.backend.message,
      INSTALL_QUESTIONS.privateArea.message,
      INSTALL_QUESTIONS.platform.message,
    ])
    assert.deepEqual(prompts.asked.slice(4).map(({ initialValue }) => initialValue), ['yes', 'no', 'yes', 'yes', 'node'])
  })

  it('al cambiar una app con el código del kit no pregunta el tipo ni la zona privada', async () => {
    const prompts = createPrompts(['Pedidos', 'npm', 'no', 'no', 'yes', 'no'])

    const answers = await askInstallQuestions(appDefaults, { mode: 'change', prompts })

    assert.deepEqual([answers.existing, answers.type, answers.backend, answers.mocks], [false, 'app', true, false])
    assert.equal(prompts.asked[0].message, INSTALL_QUESTIONS.name.message)
    assert.deepEqual(askedMessages(prompts).slice(4), [INSTALL_QUESTIONS.appBackend.message, INSTALL_QUESTIONS.mocks.message])
  })

  it('en una app sin API no pregunta por los mocks', async () => {
    const prompts = createPrompts(['no', 'app', 'Pedidos', 'npm', 'no', 'no', 'no'])

    const answers = await askInstallQuestions(defaults, { prompts })

    assert.deepEqual([answers.type, answers.backend, answers.mocks], ['app', false, false])
    assert.equal(askedMessages(prompts).at(-1), INSTALL_QUESTIONS.appBackend.message)
    assert.ok(!askedMessages(prompts).includes(INSTALL_QUESTIONS.mocks.message))
  })

  it('sin package.json en la carpeta, no pregunta si es nuevo: solo puede serlo', async () => {
    const prompts = createPrompts(['web', 'Pedidos', 'npm', 'no', 'no', 'no', 'no'])

    const answers = await askInstallQuestions(defaults, { prompts, hasPackageJson: false })

    assert.equal(answers.existing, false)
    assert.equal(prompts.asked[0].message, INSTALL_QUESTIONS.type.message)
  })

  it('en un proyecto existente no pregunta lo que su código ya fija', async () => {
    const existing = getDefaultAnswers({ folderName: 'pedidos', hasPackageJson: true, type: 'web', web: { server: true, content: false } })
    const known = { type: 'web', packageManager: 'pnpm', server: true }
    const prompts = createPrompts(['yes', 'pedidos', 'no', 'no', 'yes'])

    const answers = await askInstallQuestions(existing, { prompts, known })

    assert.deepEqual([answers.type, answers.packageManager, answers.server, answers.content], ['web', 'pnpm', true, true])
    assert.deepEqual(askedMessages(prompts), [
      INSTALL_QUESTIONS.existing.message,
      INSTALL_QUESTIONS.name.message,
      INSTALL_QUESTIONS.git.message,
      INSTALL_QUESTIONS.i18n.message,
      INSTALL_QUESTIONS.content.message,
    ])
    assert.deepEqual(prompts.logged, ['Tomado del proyecto, sin preguntarlo: tipo: web, gestor: pnpm, servidor: sí.'])
  })

  it('en un proyecto existente en React no pregunta el tipo', async () => {
    const existing = getDefaultAnswers({ folderName: 'pedidos', hasPackageJson: true, type: 'app' })
    const prompts = createPrompts(['yes', 'pedidos', 'npm', 'no', 'no', 'yes', 'yes'])

    const answers = await askInstallQuestions(existing, { prompts, known: { type: 'app' } })

    assert.equal(answers.type, 'app')
    assert.ok(!askedMessages(prompts).includes(INSTALL_QUESTIONS.type.message))
    assert.deepEqual(prompts.logged, ['Tomado del proyecto, sin preguntarlo: tipo: app.'])
  })

  it('en un proyecto nuevo no usa lo que fija la carpeta desde la que se lanza', async () => {
    const prompts = createPrompts(['no', 'app', 'Pedidos', 'npm', 'no', 'no', 'yes', 'yes'])

    const answers = await askInstallQuestions(defaults, { prompts, known: { type: 'web', packageManager: 'pnpm', server: true } })

    assert.deepEqual([answers.type, answers.packageManager], ['app', 'npm'])
    assert.deepEqual(prompts.logged, [])
  })

  it('comprueba el nombre de un proyecto nuevo al escribirlo, con el de por defecto si se deja vacío', async () => {
    const checked = []
    const validateName = (name) => {
      checked.push(name)
      return name === 'Pedidos' ? 'Ya hay una carpeta pedidos con ficheros' : undefined
    }
    const prompts = createPrompts(['no', 'web', 'Otro', 'npm', 'no', 'no', 'no', 'no'])

    await askInstallQuestions(defaults, { prompts, validateName })
    const { validate } = prompts.asked[2]

    assert.match(validate('Pedidos'), /Ya hay una carpeta pedidos/)
    assert.equal(validate('Otro'), undefined)
    assert.equal(validate(''), undefined)
    assert.deepEqual(checked, ['Pedidos', 'Otro', 'Mi proyecto'])
  })

  it('no comprueba la carpeta del nombre en un proyecto existente', async () => {
    const prompts = createPrompts(['yes', 'web', 'pedidos', 'npm', 'no', 'no', 'no', 'no'])

    await askInstallQuestions({ ...defaults, existing: true }, { prompts, validateName: () => 'ocupada' })

    assert.equal(prompts.asked[2].validate('pedidos'), undefined)
  })

  it('pone el Sí primero en la pregunta de git, y marca el de por defecto: sí en un proyecto nuevo con git instalado', async () => {
    const prompts = createPrompts(['no', 'web', 'Pedidos', 'npm', 'yes', 'no', 'no', 'no'])
    const withGit = getDefaultAnswers({ folderName: 'pedidos', hasPackageJson: false, git: { installed: true, inRepo: false } })

    await askInstallQuestions(withGit, { prompts })

    assert.deepEqual(INSTALL_QUESTIONS.git.options.map(({ value }) => value), ['yes', 'no'])
    assert.equal(prompts.asked[4].message, INSTALL_QUESTIONS.git.message)
    assert.equal(prompts.asked[4].initialValue, 'yes')
  })

  it('no pregunta por git si la carpeta ya está en un repositorio: el proyecto lo tiene', async () => {
    const prompts = createPrompts(['no', 'web', 'Pedidos', 'npm', 'no', 'no', 'no'])

    const answers = await askInstallQuestions(defaults, { prompts, git: { installed: true, inRepo: true } })

    assert.equal(answers.git, true)
    assert.ok(!askedMessages(prompts).includes(INSTALL_QUESTIONS.git.message))
    assert.match(prompts.logged.join('\n'), /ya está en un repositorio git/)
  })

  it('no pregunta por git si no está instalado: el proyecto va sin historial', async () => {
    const prompts = createPrompts(['no', 'web', 'Pedidos', 'npm', 'no', 'no', 'no'])

    const answers = await askInstallQuestions(defaults, { prompts, git: { installed: false, inRepo: false } })

    assert.equal(answers.git, false)
    assert.ok(!askedMessages(prompts).includes(INSTALL_QUESTIONS.git.message))
    assert.match(prompts.logged.join('\n'), /git no está instalado/)
  })

  it('da null si se cancela', async () => {
    const init = ['no', 'web', 'Pedidos', 'npm', 'no', 'yes', 'es, ca', 'no', 'no']
    for (let answered = 0; answered < init.length; answered++) {
      assert.equal(await askInstallQuestions(defaults, { prompts: createPrompts([...init.slice(0, answered), CANCEL]) }), null)
    }
    for (const answered of [[], ['yes']]) {
      assert.equal(await askInstallQuestions(appDefaults, { prompts: createPrompts(['no', 'app', 'Pedidos', 'npm', 'no', 'no', ...answered, CANCEL]) }), null)
    }
    assert.equal(await askInstallQuestions({ ...defaults, existing: true }, { mode: 'change', prompts: createPrompts([CANCEL]) }), null)
    assert.equal(await askInstallQuestions(defaults, { mode: 'change', prompts: createPrompts(['Pedidos', 'npm', 'no', 'no', 'no', 'no', CANCEL]) }), null)
  })
})
