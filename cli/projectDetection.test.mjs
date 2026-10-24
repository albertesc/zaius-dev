import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, it } from 'node:test'
import { detectProject } from './projectDetection.mjs'
import { writeManifest } from './projectManifest.mjs'

let projectDir

beforeEach(async () => {
  const parent = await mkdtemp(join(tmpdir(), 'kit-detect-'))
  projectDir = join(parent, 'pedidos')
  await mkdir(projectDir)
})

afterEach(async () => {
  await rm(join(projectDir, '..'), { recursive: true, force: true })
})

describe('detectProject', () => {
  it('reconoce una carpeta vacía, aunque tenga ficheros ocultos', async () => {
    await writeFile(join(projectDir, '.gitkeep'), '')

    assert.deepEqual(await detectProject(projectDir), { folderName: 'pedidos', isEmpty: true, hasPackageJson: false, packageManager: null, type: null, web: null, known: {}, manifest: null })
  })

  it('reconoce el gestor de paquetes del proyecto', async () => {
    await writeFile(join(projectDir, 'package.json'), '{}')
    await writeFile(join(projectDir, 'pnpm-lock.yaml'), '')

    assert.equal((await detectProject(projectDir)).packageManager, 'pnpm')
  })

  it('reconoce una web en Astro y lee sus respuestas', async () => {
    await writeFile(join(projectDir, 'package.json'), JSON.stringify({ dependencies: { astro: '^7.4.2' } }))
    await writeFile(join(projectDir, 'astro.config.mjs'), "export default { output: 'server' }\n")
    await mkdir(join(projectDir, 'src'))
    await writeFile(join(projectDir, 'src/content.config.ts'), '')

    const detected = await detectProject(projectDir)

    assert.equal(detected.type, 'web')
    assert.deepEqual(detected.web, { server: true, content: true, platform: null })
    assert.deepEqual(detected.known, { type: 'web', server: true, content: true })
  })

  it('en una web sin servidor ni contenido, solo fija el tipo y el gestor', async () => {
    await writeFile(join(projectDir, 'package.json'), JSON.stringify({ dependencies: { astro: '^7.4.2' } }))
    await writeFile(join(projectDir, 'package-lock.json'), '{}')

    const detected = await detectProject(projectDir)

    assert.deepEqual(detected.web, { server: false, content: false, platform: null })
    assert.deepEqual(detected.known, { type: 'web', packageManager: 'npm' })
  })

  it('da lo que fija una app en React con su lockfile, sin respuestas de una web', async () => {
    await writeFile(join(projectDir, 'package.json'), JSON.stringify({ dependencies: { react: '^19.2.8' } }))
    await writeFile(join(projectDir, 'yarn.lock'), '')

    const detected = await detectProject(projectDir)

    assert.equal(detected.type, 'app')
    assert.equal(detected.web, null)
    assert.deepEqual(detected.known, { type: 'app', packageManager: 'yarn' })
  })

  it('reconoce un proyecto y su manifiesto del kit', async () => {
    await writeFile(join(projectDir, 'package.json'), '{}')
    await writeManifest(projectDir, { kitVersion: '0.1.0' })

    const detected = await detectProject(projectDir)

    assert.equal(detected.isEmpty, false)
    assert.equal(detected.hasPackageJson, true)
    assert.equal(detected.type, null)
    assert.deepEqual(detected.manifest, { kitVersion: '0.1.0' })
  })
})
