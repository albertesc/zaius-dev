import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  buildConditions,
  buildKitCommand,
  buildTemplateValues,
  getDefaultAnswers,
  normalizeAnswers,
  parseLanguages,
  slugifyName,
  validateLanguages,
} from './installAnswers.mjs'

const defaults = getDefaultAnswers({ folderName: 'pedidos', hasPackageJson: false })

const appDefaults = getDefaultAnswers({ folderName: 'pedidos', hasPackageJson: false, type: 'app' })

describe('slugifyName', () => {
  it('quita los acentos y deja minúsculas y guiones', () => {
    assert.equal(slugifyName('Gestión de pedidos'), 'gestion-de-pedidos')
    assert.equal(slugifyName("L'aplicació 2!"), 'l-aplicacio-2')
    assert.equal(slugifyName('¡!'), 'app')
  })
})

describe('parseLanguages', () => {
  it('lee los códigos separados por comas o espacios, sin repetir', () => {
    assert.deepEqual(parseLanguages(' ES, ca  en,es '), ['es', 'ca', 'en'])
  })
})

describe('validateLanguages', () => {
  it('pide dos idiomas o más con multiidioma y uno sin él', () => {
    assert.equal(validateLanguages(['es', 'ca'], true), null)
    assert.match(validateLanguages(['es'], true), /dos idiomas o más/)
    assert.equal(validateLanguages(['es'], false), null)
  })

  it('rechaza los códigos que no son de dos o tres letras', () => {
    assert.match(validateLanguages(['es', 'es-ES'], true), /es-ES/)
  })
})

describe('getDefaultAnswers', () => {
  it('marca existente si ya hay un package.json', () => {
    assert.equal(defaults.existing, false)
    assert.equal(getDefaultAnswers({ folderName: 'x', hasPackageJson: true }).existing, true)
    assert.deepEqual(defaults.languages, ['es'])
  })

  it('da a un proyecto nuevo un nombre genérico y a uno existente el de su carpeta', () => {
    assert.equal(defaults.name, 'Mi proyecto')
    assert.equal(getDefaultAnswers({ folderName: 'pedidos', hasPackageJson: true }).name, 'pedidos')
  })

  it('usa el gestor de paquetes del proyecto o, si no lo hay, npm', () => {
    assert.equal(defaults.packageManager, 'npm')
    assert.equal(getDefaultAnswers({ folderName: 'x', hasPackageJson: true, packageManager: 'pnpm' }).packageManager, 'pnpm')
  })

  it('es una web si no se sabe el tipo, con lo mínimo y sin las respuestas de una app', () => {
    assert.equal(defaults.type, 'web')
    assert.deepEqual([defaults.server, defaults.content, defaults.privateArea], [false, false, false])
    assert.deepEqual([defaults.api, defaults.mocks], [null, null])
  })

  it('en una web, marca lo que se lee del proyecto', () => {
    const detected = getDefaultAnswers({ folderName: 'x', hasPackageJson: true, type: 'web', web: { server: true, content: true } })

    assert.deepEqual([detected.server, detected.content, detected.privateArea], [true, true, false])
    assert.deepEqual([detected.api, detected.mocks], [null, null])
  })

  it('en una app, marca la API y los mocks, sin las respuestas de una web aunque se lean', () => {
    const app = getDefaultAnswers({ folderName: 'x', hasPackageJson: true, type: 'app', web: { server: true, content: true } })

    assert.equal(app.type, 'app')
    assert.deepEqual([app.api, app.mocks], [true, true])
    assert.deepEqual([app.server, app.content, app.privateArea], [null, null, null])
  })
})

describe('normalizeAnswers', () => {
  it('completa con los valores por defecto', () => {
    assert.deepEqual(normalizeAnswers({ name: ' Pedidos ' }, defaults), { ...defaults, name: 'Pedidos' })
    assert.deepEqual(normalizeAnswers({ name: ' Pedidos ' }, appDefaults), { ...appDefaults, name: 'Pedidos' })
  })

  it('acepta los idiomas como texto o como lista', () => {
    assert.deepEqual(normalizeAnswers({ i18n: true, languages: 'es, ca' }, defaults).languages, ['es', 'ca'])
    assert.deepEqual(normalizeAnswers({ i18n: true, languages: ['ES', 'en'] }, defaults).languages, ['es', 'en'])
  })

  it('sin multiidioma se queda con el primer idioma', () => {
    assert.deepEqual(normalizeAnswers({ i18n: false, languages: ['ca', 'es'] }, defaults).languages, ['ca'])
  })

  it('falla con una respuesta que no vale', () => {
    assert.throws(() => normalizeAnswers({ i18n: true, languages: ['es'] }, defaults), /dos idiomas o más/)
    assert.throws(() => normalizeAnswers({ name: '' }, defaults), /Falta el nombre/)
    assert.throws(() => normalizeAnswers({ packageManager: 'deno' }, defaults), /«packageManager» tiene que ser npm, pnpm, yarn o bun/)
    assert.throws(() => normalizeAnswers({ type: 'next' }, defaults), /«type» tiene que ser web o app/)
  })

  it('no pierde ninguna respuesta', () => {
    assert.deepEqual(Object.keys(normalizeAnswers({}, defaults)), Object.keys(defaults))
    assert.deepEqual(Object.keys(normalizeAnswers({}, appDefaults)), Object.keys(appDefaults))
  })

  it('en una web, deja a null las respuestas de una app', () => {
    const answers = normalizeAnswers({ api: false, mocks: 'sí' }, defaults)

    assert.deepEqual([answers.api, answers.mocks], [null, null])
  })

  it('en una app, deja a null las respuestas de una web', () => {
    const answers = normalizeAnswers({ type: 'app', server: true, content: true, privateArea: true }, defaults)

    assert.deepEqual([answers.server, answers.content, answers.privateArea], [null, null, null])
    assert.deepEqual([answers.api, answers.mocks], [true, true])
  })

  it('al cambiar de tipo, completa las del tipo nuevo con las de por defecto', () => {
    const web = normalizeAnswers({ type: 'web' }, appDefaults)

    assert.deepEqual([web.server, web.content, web.privateArea], [false, false, false])
    assert.deepEqual([web.api, web.mocks], [null, null])
  })

  it('una web con zona privada tiene servidor', () => {
    assert.equal(normalizeAnswers({ privateArea: true, server: false }, defaults).server, true)
    assert.equal(normalizeAnswers({ privateArea: false, server: true }, defaults).server, true)
    assert.equal(normalizeAnswers({ privateArea: false }, defaults).server, false)
  })

  it('en una web, falla con una respuesta que no vale', () => {
    assert.throws(() => normalizeAnswers({ server: 'sí' }, defaults), /«server» tiene que ser true o false/)
    assert.throws(() => normalizeAnswers({ content: 'sí' }, defaults), /«content» tiene que ser true o false/)
    assert.throws(() => normalizeAnswers({ privateArea: 'sí' }, defaults), /«privateArea» tiene que ser true o false/)
  })

  it('en una app, falla con una respuesta que no vale', () => {
    assert.throws(() => normalizeAnswers({ api: 'sí' }, appDefaults), /«api» tiene que ser true o false/)
    assert.throws(() => normalizeAnswers({ mocks: 'sí' }, appDefaults), /«mocks» tiene que ser true o false/)
  })
})

describe('buildConditions', () => {
  it('da una condición por pregunta de sí o no, por gestor de paquetes y por tipo, con las de una app falsas en una web', () => {
    assert.deepEqual(buildConditions(defaults), {
      existing: false,
      i18n: false,
      npm: true,
      pnpm: false,
      yarn: false,
      bun: false,
      web: true,
      app: false,
      server: false,
      content: false,
      privateArea: false,
      api: false,
      mocks: false,
    })
    assert.equal(buildConditions({ ...defaults, packageManager: 'bun' }).bun, true)
  })

  it('en una web, da el servidor, el contenido y la zona privada', () => {
    const conditions = buildConditions(normalizeAnswers({ content: true, privateArea: true }, defaults))

    assert.deepEqual([conditions.web, conditions.app], [true, false])
    assert.deepEqual([conditions.server, conditions.content, conditions.privateArea], [true, true, true])
    assert.deepEqual([conditions.api, conditions.mocks], [false, false])
  })

  it('en una app, da la API y los mocks, con las de una web falsas', () => {
    const conditions = buildConditions(normalizeAnswers({ mocks: false }, appDefaults))

    assert.deepEqual([conditions.web, conditions.app], [false, true])
    assert.deepEqual([conditions.api, conditions.mocks], [true, false])
    assert.deepEqual([conditions.server, conditions.content, conditions.privateArea], [false, false, false])
  })

  it('las de un tipo son falsas en el otro aunque las respuestas digan que sí', () => {
    const web = buildConditions({ ...defaults, api: true, mocks: true })
    const app = buildConditions({ ...appDefaults, server: true, content: true, privateArea: true })

    assert.deepEqual([web.api, web.mocks], [false, false])
    assert.deepEqual([app.server, app.content, app.privateArea], [false, false, false])
  })
})

describe('buildKitCommand', () => {
  it('fija la versión en la etiqueta del repositorio', () => {
    assert.equal(buildKitCommand('github:albertesc/zaius-dev', '0.2.0'), 'npx github:albertesc/zaius-dev#v0.2.0')
  })

  it('sin repositorio, es la orden enlazada en el equipo', () => {
    assert.equal(buildKitCommand(null, '0.2.0'), 'zaius-dev')
  })
})

describe('buildTemplateValues', () => {
  it('da cada valor en la forma de su sitio', () => {
    const values = buildTemplateValues({ ...defaults, name: 'Pedidos "Sur" & Co', i18n: true, languages: ['es', 'ca'] }, { kitVersion: '0.1.0', date: '2026-10-22', timezone: 'Europe/Madrid' })

    assert.equal(values.APP_NAME_JSON, '"Pedidos \\"Sur\\" & Co"')
    assert.equal(values.APP_NAME_HTML, 'Pedidos &#34;Sur&#34; &#38; Co')
    assert.equal(values.APP_SLUG, 'pedidos-sur-co')
    assert.equal(values.LANGUAGES_TS, "'es', 'ca'")
    assert.equal(values.LANGUAGES, 'es, ca')
    assert.equal(values.DEFAULT_LANGUAGE, 'es')
    assert.equal(values.TEST_TIMEZONE, 'Europe/Madrid')
    assert.equal(values.DATE, '2026-10-22')
  })

  it('da los puertos del tipo', () => {
    const web = buildTemplateValues(defaults, { kitVersion: '0.1.0', date: '2026-10-22', timezone: 'UTC' })
    const app = buildTemplateValues(appDefaults, { kitVersion: '0.1.0', date: '2026-10-22', timezone: 'UTC' })

    assert.deepEqual([web.HUMAN_PORT, web.REVIEW_PORT], ['4321', '4323'])
    assert.deepEqual([app.HUMAN_PORT, app.REVIEW_PORT], ['5173', '5175'])
  })

  it('da la unidad de trabajo del tipo, su ejemplo, su carpeta y su skill', () => {
    const web = buildTemplateValues(defaults, { kitVersion: '0.1.0', date: '2026-10-22', timezone: 'UTC' })
    const app = buildTemplateValues(appDefaults, { kitVersion: '0.1.0', date: '2026-10-22', timezone: 'UTC' })

    assert.deepEqual([web.KIND, web.UNIT, web.UNITS, web.UNIT_EXAMPLE, web.UNIT_DOCS, web.SPEC_SKILL], ['web', 'página', 'páginas', 'HOME', 'docs/pages', 'zaius-page'])
    assert.deepEqual([app.KIND, app.UNIT, app.UNITS, app.UNIT_EXAMPLE, app.UNIT_DOCS, app.SPEC_SKILL], ['app', 'historia', 'historias', 'ORD001', 'docs/specs', 'zaius-spec'])
  })

  it('da la orden del kit con la versión instalada y la de actualizar', () => {
    const values = buildTemplateValues(defaults, { kitVersion: '0.1.0', kitSource: 'github:albertesc/zaius-dev', date: '2026-10-22', timezone: 'UTC' })

    assert.equal(values.KIT_VERSION, '0.1.0')
    assert.equal(values.KIT_RUN, 'npx github:albertesc/zaius-dev#v0.1.0')
    assert.equal(values.KIT_UPDATE, 'npx github:albertesc/zaius-dev#v<versión> update')
  })

  it('da las órdenes del gestor de paquetes', () => {
    const values = buildTemplateValues({ ...defaults, packageManager: 'yarn' }, { kitVersion: '0.1.0', date: '2026-10-22', timezone: 'UTC' })

    assert.equal(values.PM, 'yarn')
    assert.equal(values.PM_EXEC, 'yarn run')
    assert.equal(values.PM_DLX, 'npx')
    assert.equal(buildTemplateValues({ ...defaults, packageManager: 'pnpm' }, { kitVersion: '0.1.0', date: '2026-10-22', timezone: 'UTC' }).PM_DLX, 'pnpm dlx')
  })
})
