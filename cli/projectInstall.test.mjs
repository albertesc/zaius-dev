import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, it } from 'node:test'
import { getDefaultAnswers } from './installAnswers.mjs'
import { installProject, readKitInfo } from './projectInstall.mjs'
import { readManifest, readOptionalFile } from './projectManifest.mjs'

let kitDir
let projectDir

const answers = { ...getDefaultAnswers({ folderName: 'pedidos', hasPackageJson: false, type: 'app' }), name: 'Gestión de pedidos' }

const webAnswers = { ...getDefaultAnswers({ folderName: 'pedidos', hasPackageJson: false, type: 'web' }), name: 'Gestión de pedidos' }

const RULES = { base: 'shared', overlays: { web: 'web', app: 'app' }, conditions: { 'src/**': '!existing', 'src/utils/apiMock*': 'mocks' }, seeds: ['docs/next-steps.md'] }

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
 * Escribe un kit de prueba con su base (`shared/`), sus reglas y su versión. Las capas `web/` y `app/` están en las reglas, pero sin carpeta.
 * @param version La versión del kit.
 * @param agents El contenido de `AGENTS.md` en la base.
 */
async function writeKit (version, agents) {
  await writeFile(join(kitDir, 'package.json'), JSON.stringify({ version }))
  await writeFile(join(kitDir, 'templateFiles.json'), JSON.stringify(RULES))
  await writeKitFile('shared/AGENTS.md', agents)
  await writeKitFile('shared/docs/next-steps.md', '## Dónde estamos\n')
  await writeKitFile('shared/src/utils/apiMockUtils.ts', 'export {}\n')
  await writeKitFile('shared/package.fragment.json', JSON.stringify({ scripts: { test: 'vitest run' }, dependencies: { zod: '^4.1.0' }, when: { mocks: { devDependencies: { msw: '^1.0.0' } } } }))
}

beforeEach(async () => {
  kitDir = await mkdtemp(join(tmpdir(), 'kit-dir-'))
  projectDir = await mkdtemp(join(tmpdir(), 'kit-target-'))
})

afterEach(async () => {
  await rm(kitDir, { recursive: true, force: true })
  await rm(projectDir, { recursive: true, force: true })
})

describe('readKitInfo', () => {
  it('lee la versión, la carpeta del kit y las reglas', async () => {
    await writeKit('0.1.0', '# %%APP_NAME%%\n')

    const kit = await readKitInfo(kitDir)

    assert.equal(kit.version, '0.1.0')
    assert.equal(kit.dir, kitDir)
    assert.equal(kit.rules.base, 'shared')
    assert.deepEqual(kit.rules.seeds, ['docs/next-steps.md'])
    assert.equal(kit.source, null)
    assert.equal(kit.run, 'zaius-dev')
  })

  it('da la orden que lanza su versión desde el repositorio', async () => {
    await writeKit('0.1.0', '# %%APP_NAME%%\n')
    await writeFile(join(kitDir, 'package.json'), JSON.stringify({ version: '0.1.0', repository: 'github:albertesc/zaius-dev' }))

    const kit = await readKitInfo(kitDir)

    assert.equal(kit.source, 'github:albertesc/zaius-dev')
    assert.equal(kit.run, 'npx github:albertesc/zaius-dev#v0.1.0')
  })

  it('acepta el repositorio como objeto, con su url', async () => {
    await writeKit('0.1.0', '# %%APP_NAME%%\n')
    await writeFile(join(kitDir, 'package.json'), JSON.stringify({ version: '0.1.0', repository: { type: 'git', url: 'git+https://github.com/albertesc/zaius-dev.git' } }))

    assert.equal((await readKitInfo(kitDir)).run, 'npx git+https://github.com/albertesc/zaius-dev.git#v0.1.0')
  })
})

describe('installProject', () => {
  it('instala la plantilla, el package.json y el manifiesto en un proyecto nuevo', async () => {
    await writeKit('0.1.0', '# %%APP_NAME%%\n')

    const result = await installProject({ projectDir, kitDir, answers, date: '2026-10-22', timezone: 'Europe/Madrid' })

    assert.deepEqual(result.groups.create.sort(), ['AGENTS.md', 'docs/next-steps.md', 'src/utils/apiMockUtils.ts'])
    assert.equal(await readFile(join(projectDir, 'AGENTS.md'), 'utf8'), '# Gestión de pedidos\n')
    const pkg = JSON.parse(await readFile(join(projectDir, 'package.json'), 'utf8'))
    assert.equal(pkg.name, 'gestion-de-pedidos')
    assert.deepEqual(pkg.devDependencies, { msw: '^1.0.0' })
    const manifest = await readManifest(projectDir)
    assert.equal(manifest.kitVersion, '0.1.0')
    assert.deepEqual(manifest.answers, answers)
    assert.deepEqual(Object.keys(manifest.files), ['AGENTS.md', 'docs/next-steps.md', 'src/utils/apiMockUtils.ts'])
    assert.deepEqual(manifest.seeds, ['docs/next-steps.md'])
  })

  it('con dryRun calcula el resumen sin escribir nada', async () => {
    await writeKit('0.1.0', '# %%APP_NAME%%\n')

    const result = await installProject({ projectDir, kitDir, answers, date: '2026-10-22', timezone: 'UTC', dryRun: true })

    assert.equal(result.groups.create.length, 3)
    assert.equal(await readOptionalFile(join(projectDir, 'AGENTS.md')), null)
    assert.equal(await readManifest(projectDir), null)
  })

  it('al actualizar sustituye lo no tocado, deja .kit-new de lo tocado y respeta las semillas', async () => {
    await writeKit('0.1.0', '# %%APP_NAME%%\n')
    await installProject({ projectDir, kitDir, answers, date: '2026-10-22', timezone: 'UTC' })
    await writeFile(join(projectDir, 'AGENTS.md'), '# Gestión de pedidos\n\nUna regla del proyecto.\n')
    await writeFile(join(projectDir, 'docs/next-steps.md'), '## Dónde estamos\n\nAl día.\n')
    await writeKit('0.2.0', '# %%APP_NAME%%\n\nUna regla nueva del kit.\n')
    await writeKitFile('shared/src/utils/apiMockUtils.ts', 'export const x = 1\n')

    const result = await installProject({ projectDir, kitDir, answers, date: '2026-11-01', timezone: 'UTC' })

    assert.deepEqual(result.groups.kitNew, ['AGENTS.md'])
    assert.deepEqual(result.groups.replace, ['src/utils/apiMockUtils.ts'])
    assert.deepEqual(result.groups.keep, ['docs/next-steps.md'])
    assert.match(await readFile(join(projectDir, 'AGENTS.md.kit-new'), 'utf8'), /regla nueva del kit/)
    assert.match(await readFile(join(projectDir, 'AGENTS.md'), 'utf8'), /regla del proyecto/)
    const manifest = await readManifest(projectDir)
    assert.equal(manifest.kitVersion, '0.2.0')
    assert.equal(manifest.installedAt, '2026-10-22')
    assert.equal(manifest.updatedAt, '2026-11-01')
  })

  it('al quitar los mocks borra sus ficheros y su dependencia', async () => {
    await writeKit('0.1.0', '# %%APP_NAME%%\n')
    await installProject({ projectDir, kitDir, answers, date: '2026-10-22', timezone: 'UTC' })

    const result = await installProject({ projectDir, kitDir, answers: { ...answers, mocks: false }, date: '2026-10-23', timezone: 'UTC' })

    assert.deepEqual(result.groups.remove, ['src/utils/apiMockUtils.ts'])
    assert.equal(await readOptionalFile(join(projectDir, 'src/utils/apiMockUtils.ts')), null)
    assert.equal(JSON.parse(await readFile(join(projectDir, 'package.json'), 'utf8')).devDependencies, undefined)
  })

  it('en un proyecto existente no toca el código ni el package.json y deja .kit-new', async () => {
    await writeKit('0.1.0', '# %%APP_NAME%%\n')
    await writeFile(join(projectDir, 'package.json'), '{ "name": "legacy" }\n')
    await writeFile(join(projectDir, 'AGENTS.md'), '# Lo de antes\n')

    const result = await installProject({ projectDir, kitDir, answers: { ...answers, existing: true }, date: '2026-10-22', timezone: 'UTC' })

    assert.equal(result.packageChange, null)
    assert.deepEqual(result.groups.kitNew, ['AGENTS.md'])
    assert.equal(await readOptionalFile(join(projectDir, 'src/utils/apiMockUtils.ts')), null)
    assert.equal(await readFile(join(projectDir, 'package.json'), 'utf8'), '{ "name": "legacy" }\n')
  })

  it('mover ficheros de la base a la capa de su tipo no cambia nada en un proyecto instalado', async () => {
    await writeKit('0.1.0', '# %%APP_NAME%%\n')
    await installProject({ projectDir, kitDir, answers, date: '2026-10-22', timezone: 'UTC' })
    await mkdir(join(kitDir, 'app/src'), { recursive: true })
    await rename(join(kitDir, 'shared/src/utils'), join(kitDir, 'app/src/utils'))
    await rename(join(kitDir, 'shared/package.fragment.json'), join(kitDir, 'app/package.fragment.json'))
    await writeFile(join(kitDir, 'shared/package.fragment.json'), '{}')

    const result = await installProject({ projectDir, kitDir, answers, date: '2026-10-23', timezone: 'UTC' })

    assert.deepEqual(result.groups.same.sort(), ['AGENTS.md', 'docs/next-steps.md', 'src/utils/apiMockUtils.ts'])
    assert.deepEqual([result.groups.create, result.groups.replace, result.groups.remove], [[], [], []])
    assert.equal(result.packageChange.changed, false)
  })

  it('instala la capa de su tipo, con su fragmento de package.json, y no la del otro', async () => {
    await writeKit('0.1.0', '# %%APP_NAME%%\n')
    await writeKitFile('web/src/layouts/BaseLayout.astro', '<slot />\n')
    await writeKitFile('web/package.fragment.json', JSON.stringify({ scripts: { dev: 'astro dev' }, dependencies: { astro: '^7.4.2' }, when: { server: { dependencies: { '@astrojs/node': '^11.1.9' } } } }))
    await writeKitFile('app/src/main.tsx', 'export {}\n')
    await writeKitFile('app/package.fragment.json', JSON.stringify({ scripts: { dev: 'vite' }, dependencies: { react: '^19.2.8' } }))

    const result = await installProject({ projectDir, kitDir, answers: { ...webAnswers, server: true }, date: '2026-10-22', timezone: 'UTC' })

    const pkg = JSON.parse(await readFile(join(projectDir, 'package.json'), 'utf8'))
    assert.deepEqual(result.groups.create.sort(), ['AGENTS.md', 'docs/next-steps.md', 'src/layouts/BaseLayout.astro'])
    assert.equal(await readFile(join(projectDir, 'src/layouts/BaseLayout.astro'), 'utf8'), '<slot />\n')
    assert.equal(await readOptionalFile(join(projectDir, 'src/main.tsx')), null)
    assert.deepEqual(pkg.dependencies, { '@astrojs/node': '^11.1.9', astro: '^7.4.2', zod: '^4.1.0' })
    assert.deepEqual(pkg.scripts, { test: 'vitest run', dev: 'astro dev' })
    assert.equal(pkg.devDependencies, undefined)
  })

  it('al quitar el servidor de una web quita la dependencia que solo va con él', async () => {
    await writeKit('0.1.0', '# %%APP_NAME%%\n')
    await writeKitFile('web/package.fragment.json', JSON.stringify({ dependencies: { astro: '^7.4.2' }, when: { server: { dependencies: { '@astrojs/node': '^11.1.9' } } } }))
    await installProject({ projectDir, kitDir, answers: { ...webAnswers, server: true }, date: '2026-10-22', timezone: 'UTC' })

    await installProject({ projectDir, kitDir, answers: webAnswers, date: '2026-10-23', timezone: 'UTC' })

    assert.deepEqual(JSON.parse(await readFile(join(projectDir, 'package.json'), 'utf8')).dependencies, { astro: '^7.4.2', zod: '^4.1.0' })
  })
})
