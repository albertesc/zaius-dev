import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, it } from 'node:test'
import { chooseCommand, runChangeCommand, runInitCommand, runStatusCommand, runUpdateCommand } from './cliCommands.mjs'
import { readManifest, readOptionalFile } from './projectManifest.mjs'

let kitDir
let workDir
let projectDir
let configPath

/**
 * Crea un módulo de preguntas falso que apunta todo lo que se escribe y elige lo que se le da.
 * @param choice Lo que responde a un `select`.
 * @returns El módulo, con `messages`, y `selects`, las preguntas de opciones que ha recibido.
 */
function createPrompts (choice = null) {
  const messages = []
  const selects = []
  const write = (message) => messages.push(message)
  return {
    messages,
    selects,
    intro: write,
    outro: write,
    note: write,
    cancel: write,
    log: { info: write, success: write, warn: write, error: write },
    spinner: () => ({ start: write, stop: write, error: write }),
    confirm: () => Promise.resolve(true),
    select: (options) => {
      selects.push(options)
      return Promise.resolve(choice)
    },
    isCancel: () => false,
  }
}

beforeEach(async () => {
  kitDir = await mkdtemp(join(tmpdir(), 'kit-cli-'))
  workDir = await mkdtemp(join(tmpdir(), 'kit-cli-work-'))
  projectDir = join(workDir, 'mi-proyecto')
  configPath = join(kitDir, 'answers.json')
  await writeFile(join(kitDir, 'package.json'), JSON.stringify({ version: '0.1.0' }))
  await writeFile(join(kitDir, 'templateFiles.json'), JSON.stringify({ base: 'shared', overlays: { web: 'web', app: 'app' }, conditions: { 'src/i18n/**': 'i18n' }, seeds: ['src/i18n/**'] }))
  await writeKitFile('shared/AGENTS.md', '# %%APP_NAME%%\n')
  await writeKitFile('shared/docs/next-steps.md', '## Dónde estamos\n')
  await writeKitFile('shared/src/i18n/%%LANGUAGE%%.json', '{}\n')
  await writeKitFile('shared/package.fragment.json', '{}')
  await writeKitFile('web/docs/web.md', '%%HUMAN_PORT%%\n<!-- kit:if privateArea -->\nzona privada\n<!-- kit:end -->\n')
  await writeKitFile('app/docs/app.md', '%%HUMAN_PORT%%\n')
})

/**
 * Escribe un fichero en el kit de prueba, con sus carpetas.
 * @param path La ruta del fichero, dentro del kit.
 * @param content Su contenido.
 */
async function writeKitFile (path, content) {
  await mkdir(join(kitDir, path, '..'), { recursive: true })
  await writeFile(join(kitDir, path), content)
}

/**
 * Dice si el módulo de preguntas falso ha escrito un mensaje con un texto.
 * @param prompts El módulo de preguntas falso.
 * @param text El texto que se busca.
 * @returns `true` si algún mensaje lo tiene.
 */
function hasMessage (prompts, text) {
  return prompts.messages.some((message) => String(message).includes(text))
}

afterEach(async () => {
  await rm(kitDir, { recursive: true, force: true })
  await rm(workDir, { recursive: true, force: true })
})

describe('runInitCommand', () => {
  it('en un proyecto Astro, lo trata como una web y toma de él lo que fija', async () => {
    await writeFile(join(workDir, 'package.json'), JSON.stringify({ dependencies: { astro: '^7.4.2', '@astrojs/vercel': '^11.0.16', '@astrojs/mdx': '^8.1.1' } }))
    const prompts = createPrompts()

    assert.equal(await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts }), 0)
    const { answers } = await readManifest(workDir)
    assert.deepEqual([answers.existing, answers.type, answers.server, answers.content, answers.privateArea, answers.api, answers.mocks], [true, 'web', true, true, false, null, null])
    assert.ok(hasMessage(prompts, 'Es un proyecto Astro: lo trato como una web, con lo que se lee de su configuración.'))
    assert.equal(await readFile(join(workDir, 'docs/web.md'), 'utf8'), '4321\n')
    assert.equal(await readOptionalFile(join(workDir, 'docs/app.md')), null)
  })

  it('en un proyecto React, lo trata como una app', async () => {
    await writeFile(join(workDir, 'package.json'), JSON.stringify({ dependencies: { react: '^19.2.8' } }))
    const prompts = createPrompts()

    assert.equal(await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts }), 0)
    const { answers } = await readManifest(workDir)
    assert.deepEqual([answers.type, answers.api, answers.mocks, answers.server, answers.content, answers.privateArea], ['app', true, true, null, null, null])
    assert.ok(hasMessage(prompts, 'Es un proyecto React: lo trato como una app.'))
    assert.equal(await readFile(join(workDir, 'docs/app.md'), 'utf8'), '5173\n')
    assert.equal(await readOptionalFile(join(workDir, 'docs/web.md')), null)
  })

  it('instala con las respuestas de --config y enseña los pasos siguientes', async () => {
    await writeFile(configPath, JSON.stringify({ name: 'Pedidos', i18n: true, languages: ['es', 'ca'] }))
    const prompts = createPrompts()

    const code = await runInitCommand({ projectDir: workDir, kitDir, configPath, yes: true, skipInstall: true, prompts })

    assert.equal(code, 0)
    assert.equal(await readFile(join(workDir, 'pedidos/AGENTS.md'), 'utf8'), '# Pedidos\n')
    assert.notEqual(await readOptionalFile(join(workDir, 'pedidos/src/i18n/ca.json')), null)
    assert.equal(await readOptionalFile(join(workDir, 'AGENTS.md')), null)
    assert.ok(hasMessage(prompts, '/zaius-init'))
    assert.ok(hasMessage(prompts, 'cd pedidos'))
    assert.ok(!hasMessage(prompts, 'Es un proyecto'))
  })

  it('un proyecto nuevo es una web si no se dice otra cosa, y una app si se pide', async () => {
    assert.equal(await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() }), 0)
    await writeFile(configPath, JSON.stringify({ name: 'Gestión', type: 'app', mocks: false }))
    assert.equal(await runInitCommand({ projectDir: workDir, kitDir, configPath, yes: true, skipInstall: true, prompts: createPrompts() }), 0)

    const web = await readManifest(projectDir)
    const app = await readManifest(join(workDir, 'gestion'))
    assert.deepEqual([web.answers.type, web.answers.server, web.answers.privateArea], ['web', false, false])
    assert.notEqual(await readOptionalFile(join(projectDir, 'docs/web.md')), null)
    assert.deepEqual([app.answers.type, app.answers.api, app.answers.mocks], ['app', true, false])
    assert.notEqual(await readOptionalFile(join(workDir, 'gestion/docs/app.md')), null)
    assert.equal(await readOptionalFile(join(workDir, 'gestion/docs/web.md')), null)
  })

  it('usa una carpeta nueva que ya existe si solo tiene ficheros ocultos', async () => {
    await mkdir(projectDir)
    await writeFile(join(projectDir, '.gitkeep'), '')

    assert.equal(await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() }), 0)
    assert.notEqual(await readManifest(projectDir), null)
  })

  it('no instala en una carpeta con el nombre del proyecto que ya tiene ficheros', async () => {
    await mkdir(projectDir)
    await writeFile(join(projectDir, 'notas.txt'), 'mías\n')
    const prompts = createPrompts()

    assert.equal(await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts }), 1)
    assert.ok(hasMessage(prompts, 'Ya hay una carpeta mi-proyecto con ficheros'))
    assert.equal(await readManifest(projectDir), null)
  })

  it('en un proyecto que ya existe instala en su carpeta', async () => {
    await writeFile(join(workDir, 'package.json'), '{ "name": "legacy" }\n')
    const prompts = createPrompts()

    assert.equal(await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts }), 0)
    assert.equal((await readManifest(workDir)).answers.existing, true)
    assert.ok(!hasMessage(prompts, 'cd '))
  })

  it('con repositorio, deja en el proyecto la orden del kit con su versión', async () => {
    await writeFile(join(kitDir, 'package.json'), JSON.stringify({ version: '0.1.0', repository: 'github:albertesc/zaius-dev' }))
    await writeKitFile('shared/AGENTS.md', '`%%KIT_RUN%% change` y `%%KIT_UPDATE%%`\n')
    const prompts = createPrompts()

    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts })

    assert.equal(await readFile(join(projectDir, 'AGENTS.md'), 'utf8'), '`npx github:albertesc/zaius-dev#v0.1.0 change` y `npx github:albertesc/zaius-dev#v<versión> update`\n')
    assert.ok(hasMessage(prompts, 'npx github:albertesc/zaius-dev#v0.1.0 status'))
  })

  it('no vuelve a instalar en un proyecto que ya tiene el kit', async () => {
    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })
    const prompts = createPrompts()

    assert.equal(await runInitCommand({ projectDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts }), 1)
    assert.ok(hasMessage(prompts, 'ya tiene el kit'))
  })
})

describe('runChangeCommand', () => {
  it('cambia una respuesta y añade lo que pide', async () => {
    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })
    await writeFile(configPath, JSON.stringify({ i18n: true, languages: ['es', 'en'] }))

    const code = await runChangeCommand({ projectDir, kitDir, configPath, yes: true, skipInstall: true, prompts: createPrompts() })

    assert.equal(code, 0)
    assert.notEqual(await readOptionalFile(join(projectDir, 'src/i18n/en.json')), null)
    assert.equal((await readManifest(projectDir)).answers.i18n, true)
  })

  it('apunta una respuesta nueva aunque no cambie ningún fichero', async () => {
    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })
    await writeFile(configPath, JSON.stringify({ content: true }))
    const prompts = createPrompts()

    assert.equal(await runChangeCommand({ projectDir, kitDir, configPath, yes: true, skipInstall: true, prompts }), 0)
    assert.equal((await readManifest(projectDir)).answers.content, true)
    assert.ok(!hasMessage(prompts, 'no hay nada que cambiar'))
  })

  it('pide el kit instalado', async () => {
    assert.equal(await runChangeCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() }), 1)
  })

  it('no cambia el tipo de un proyecto que ya tiene el código del kit', async () => {
    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })
    await writeFile(configPath, JSON.stringify({ type: 'app' }))
    const prompts = createPrompts()

    assert.equal(await runChangeCommand({ projectDir, kitDir, configPath, yes: true, skipInstall: true, prompts }), 1)
    assert.ok(hasMessage(prompts, 'el código del kit de una web: el tipo no se cambia con change'))
    assert.equal((await readManifest(projectDir)).answers.type, 'web')
    assert.equal(await readOptionalFile(join(projectDir, 'docs/app.md')), null)
  })

  it('añade una zona privada a una web, con su servidor', async () => {
    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })
    await writeFile(configPath, JSON.stringify({ privateArea: true }))
    const prompts = createPrompts()

    assert.equal(await runChangeCommand({ projectDir, kitDir, configPath, yes: true, skipInstall: true, prompts }), 0)
    const { answers } = await readManifest(projectDir)
    assert.deepEqual([answers.privateArea, answers.server], [true, true])
    assert.match(await readFile(join(projectDir, 'docs/web.md'), 'utf8'), /zona privada/)
    assert.ok(!hasMessage(prompts, 'Sin '))
  })

  it('quita la zona privada y el servidor de una web, avisando de lo que deja de funcionar', async () => {
    await writeFile(configPath, JSON.stringify({ privateArea: true }))
    await runInitCommand({ projectDir: workDir, kitDir, configPath, yes: true, skipInstall: true, prompts: createPrompts() })
    await writeFile(configPath, JSON.stringify({ privateArea: false, server: false }))
    const prompts = createPrompts()

    assert.equal(await runChangeCommand({ projectDir, kitDir, configPath, yes: true, skipInstall: true, prompts }), 0)
    const { answers } = await readManifest(projectDir)
    assert.deepEqual([answers.privateArea, answers.server], [false, false])
    assert.doesNotMatch(await readFile(join(projectDir, 'docs/web.md'), 'utf8'), /zona privada/)
    assert.ok(hasMessage(prompts, 'Sin zona privada se quitan la sesión y los permisos'))
    assert.ok(hasMessage(prompts, 'Sin servidor, los formularios'))
  })

  it('al quitar solo la zona privada, la web conserva su servidor', async () => {
    await writeFile(configPath, JSON.stringify({ privateArea: true }))
    await runInitCommand({ projectDir: workDir, kitDir, configPath, yes: true, skipInstall: true, prompts: createPrompts() })
    await writeFile(configPath, JSON.stringify({ privateArea: false }))
    const prompts = createPrompts()

    assert.equal(await runChangeCommand({ projectDir, kitDir, configPath, yes: true, skipInstall: true, prompts }), 0)
    assert.equal((await readManifest(projectDir)).answers.server, true)
    assert.ok(!hasMessage(prompts, 'Sin servidor'))
  })

  it('en un proyecto en migración, deja elegir el tipo', async () => {
    await writeFile(join(workDir, 'package.json'), '{ "name": "legacy" }\n')
    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })
    await writeFile(configPath, JSON.stringify({ type: 'app' }))

    assert.equal((await readManifest(workDir)).answers.type, 'web')
    assert.equal(await runChangeCommand({ projectDir: workDir, kitDir, configPath, yes: true, skipInstall: true, prompts: createPrompts() }), 0)
    const { answers } = await readManifest(workDir)
    assert.deepEqual([answers.type, answers.api, answers.mocks, answers.server], ['app', true, true, null])
    assert.notEqual(await readOptionalFile(join(workDir, 'docs/app.md')), null)
    assert.equal(await readOptionalFile(join(workDir, 'docs/web.md')), null)
  })

  it('al terminar la migración enseña los pasos siguientes', async () => {
    await writeFile(join(workDir, 'package.json'), '{ "name": "legacy" }\n')
    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })
    await writeFile(configPath, JSON.stringify({ existing: false }))
    const prompts = createPrompts()

    assert.equal(await runChangeCommand({ projectDir: workDir, kitDir, configPath, yes: true, skipInstall: true, prompts }), 0)
    assert.equal((await readManifest(workDir)).answers.existing, false)
    assert.ok(hasMessage(prompts, '/zaius-backlog'))
  })

  it('no sigue con un kit más antiguo que el del proyecto, y dice con qué versión lanzarlo', async () => {
    await writeFile(join(kitDir, 'package.json'), JSON.stringify({ version: '0.2.0', repository: 'github:albertesc/zaius-dev' }))
    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })
    await writeFile(join(kitDir, 'package.json'), JSON.stringify({ version: '0.1.0', repository: 'github:albertesc/zaius-dev' }))
    const prompts = createPrompts()

    assert.equal(await runChangeCommand({ projectDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts }), 1)
    assert.equal(await runUpdateCommand({ projectDir, kitDir, yes: true, skipInstall: true, prompts }), 1)
    assert.ok(hasMessage(prompts, '«npx github:albertesc/zaius-dev#v0.2.0 change»'))
    assert.equal((await readManifest(projectDir)).kitVersion, '0.2.0')
  })
})

describe('runUpdateCommand', () => {
  it('pasa a la versión nueva del kit con las mismas respuestas', async () => {
    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })
    await writeFile(join(kitDir, 'package.json'), JSON.stringify({ version: '0.2.0' }))
    await writeKitFile('shared/AGENTS.md', '# %%APP_NAME%%\n\nNuevo.\n')

    const code = await runUpdateCommand({ projectDir, kitDir, yes: true, skipInstall: true, prompts: createPrompts() })

    assert.equal(code, 0)
    assert.match(await readFile(join(projectDir, 'AGENTS.md'), 'utf8'), /Nuevo/)
    assert.equal((await readManifest(projectDir)).kitVersion, '0.2.0')
  })

  it('completa las respuestas que el manifiesto no tiene, con el gestor de paquetes del proyecto', async () => {
    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })
    const { packageManager, ...answers } = (await readManifest(projectDir)).answers
    await writeFile(join(projectDir, 'zaius-dev.json'), JSON.stringify({ ...await readManifest(projectDir), answers }))
    await writeFile(join(projectDir, 'yarn.lock'), '')
    await writeKitFile('shared/AGENTS.md', '# %%APP_NAME%%\n\n%%PM%% run test\n')

    assert.equal(await runUpdateCommand({ projectDir, kitDir, yes: true, skipInstall: true, prompts: createPrompts() }), 0)
    assert.equal(packageManager, 'npm')
    assert.equal((await readManifest(projectDir)).answers.packageManager, 'yarn')
    assert.match(await readFile(join(projectDir, 'AGENTS.md'), 'utf8'), /yarn run test/)
  })

  it('completa las respuestas de su tipo que el manifiesto no tiene', async () => {
    await writeFile(configPath, JSON.stringify({ type: 'app', mocks: false }))
    await runInitCommand({ projectDir: workDir, kitDir, configPath, yes: true, skipInstall: true, prompts: createPrompts() })
    const { api, ...answers } = (await readManifest(projectDir)).answers
    await writeFile(join(projectDir, 'zaius-dev.json'), JSON.stringify({ ...await readManifest(projectDir), answers }))
    await writeKitFile('shared/AGENTS.md', '# %%APP_NAME%%\n\nNuevo.\n')

    assert.equal(await runUpdateCommand({ projectDir, kitDir, yes: true, skipInstall: true, prompts: createPrompts() }), 0)
    const updated = (await readManifest(projectDir)).answers
    assert.equal(api, true)
    assert.deepEqual([updated.type, updated.api, updated.mocks, updated.server, updated.privateArea], ['app', true, false, null, null])
  })

  it('el tipo es el del manifiesto, aunque el código del proyecto diga otro', async () => {
    await writeFile(configPath, JSON.stringify({ type: 'app' }))
    await runInitCommand({ projectDir: workDir, kitDir, configPath, yes: true, skipInstall: true, prompts: createPrompts() })
    await writeFile(join(projectDir, 'package.json'), JSON.stringify({ dependencies: { astro: '^7.4.2', '@astrojs/node': '^11.1.9' } }))
    await writeKitFile('shared/AGENTS.md', '# %%APP_NAME%%\n\nNuevo.\n')

    assert.equal(await runUpdateCommand({ projectDir, kitDir, yes: true, skipInstall: true, prompts: createPrompts() }), 0)
    const { answers } = await readManifest(projectDir)
    assert.deepEqual([answers.type, answers.server], ['app', null])
    assert.equal(await readOptionalFile(join(projectDir, 'docs/web.md')), null)
  })
})

describe('runStatusCommand', () => {
  it('enseña el estado de un proyecto con el kit', async () => {
    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })
    const prompts = createPrompts()

    assert.equal(await runStatusCommand({ projectDir, kitDir, prompts }), 0)
    assert.match(prompts.messages.at(-1), /Kit en el proyecto: 0\.1\.0 \(al día\)/)
    assert.ok(prompts.messages.at(-1).includes(`Carpeta del kit: ${kitDir}`))
    assert.match(prompts.messages.at(-1), /Tipo: web \(Astro\) · servidor: no · blog: no · API: no · zona privada: no/)
  })

  it('pide el kit instalado', async () => {
    const prompts = createPrompts()

    assert.equal(await runStatusCommand({ projectDir: workDir, kitDir, prompts }), 1)
    assert.ok(hasMessage(prompts, 'Este proyecto no tiene el kit: empieza con «zaius-dev init».'))
  })
})

describe('chooseCommand', () => {
  it('instala en un proyecto sin el kit y pregunta en uno con el kit', async () => {
    assert.equal(await chooseCommand({ projectDir: workDir, prompts: createPrompts() }), 'init')

    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })

    assert.equal(await chooseCommand({ projectDir, prompts: createPrompts('status') }), 'status')
  })

  it('dice qué se puede cambiar según el tipo del proyecto o si sigue en migración', async () => {
    await runInitCommand({ projectDir: workDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })
    await writeFile(configPath, JSON.stringify({ name: 'Gestión', type: 'app' }))
    await runInitCommand({ projectDir: workDir, kitDir, configPath, yes: true, skipInstall: true, prompts: createPrompts() })
    const legacyDir = join(workDir, 'legacy')
    await mkdir(legacyDir)
    await writeFile(join(legacyDir, 'package.json'), '{ "name": "legacy" }\n')
    await runInitCommand({ projectDir: legacyDir, kitDir, configPath: null, yes: true, skipInstall: true, prompts: createPrompts() })

    const changeHint = async (dir) => {
      const prompts = createPrompts('change')
      assert.equal(await chooseCommand({ projectDir: dir, prompts }), 'change')
      return prompts.selects[0].options.find(({ value }) => value === 'change').hint
    }

    assert.equal(await changeHint(projectDir), 'La zona privada, la API, el servidor, el blog o multiidioma')
    assert.equal(await changeHint(join(workDir, 'gestion')), 'Multiidioma, mocks o los documentos de la API')
    assert.equal(await changeHint(legacyDir), 'También para terminar la migración')
  })
})
