import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, describe, it } from 'node:test'
import { hashContent } from './projectManifest.mjs'
import { buildStatusReport, getProjectStatus, isOlderVersion } from './projectStatus.mjs'

const answers = { existing: false, type: 'app', name: 'Pedidos', packageManager: 'pnpm', git: true, i18n: true, languages: ['es', 'ca'], server: null, content: null, privateArea: null, backend: true, mocks: false }

const webAnswers = { ...answers, type: 'web', server: true, content: false, privateArea: true, backend: true, platform: 'vercel', mocks: null }

describe('getProjectStatus', () => {
  let projectDir

  after(async () => {
    await rm(projectDir, { recursive: true, force: true })
  })

  it('separa lo cambiado, lo que falta y lo que espera fusión', async () => {
    projectDir = await mkdtemp(join(tmpdir(), 'kit-status-'))
    await writeFile(join(projectDir, 'same.md'), 'v1')
    await writeFile(join(projectDir, 'changed.md'), 'v1 cambiado')
    await writeFile(join(projectDir, 'changed.md.kit-new'), 'v2')
    await writeFile(join(projectDir, 'seed.md'), 'rellenado')
    const manifest = { seeds: ['seed.md'], files: { 'same.md': hashContent('v1'), 'changed.md': hashContent('v1'), 'missing.md': hashContent('v1'), 'seed.md': hashContent('vacío') } }

    assert.deepEqual(await getProjectStatus(projectDir, manifest), { changed: ['changed.md'], missing: ['missing.md'], kitNew: ['changed.md'] })
  })
})

describe('buildStatusReport', () => {
  it('dice la versión, las respuestas y los ficheros', () => {
    const kit = { version: '0.2.0', dir: '/kits/zaius-dev', run: 'npx github:albertesc/zaius-dev#v0.2.0' }
    const report = buildStatusReport({ kitVersion: '0.1.0', answers }, { changed: ['AGENTS.md'], missing: [], kitNew: [] }, kit).join('\n')

    assert.match(report, /hay una versión nueva: 0\.2\.0; «npx github:albertesc\/zaius-dev#v0\.2\.0 update»/)
    assert.match(report, /Carpeta del kit: \/kits\/zaius-dev/)
    assert.match(report, /Proyecto: Pedidos \(nuevo\)\. Gestor de paquetes: pnpm\. Git: sí\.\nTipo: app \(React\)\. API: sí\. Mocks: no\.\n/)
    assert.match(report, /Idiomas: es, ca\. Multiidioma: sí\.\n/)
    assert.match(report, /cambiado:\n {2}AGENTS\.md\nFicheros del kit que faltan:\n {2}ninguno/)
  })

  it('dice las respuestas de una web', () => {
    const kit = { version: '0.1.0', dir: '/kits/zaius-dev', run: 'zaius-dev' }
    const report = buildStatusReport({ kitVersion: '0.1.0', answers: webAnswers }, { changed: [], missing: [], kitNew: [] }, kit).join('\n')
    const publicReport = buildStatusReport({ kitVersion: '0.1.0', answers: { ...webAnswers, server: false, content: true, privateArea: false, backend: false } }, { changed: [], missing: [], kitNew: [] }, kit).join('\n')

    assert.match(report, /\nTipo: web \(Astro\)\. Servidor: sí, en vercel\. Blog: no\. API: sí\. Zona privada: sí\.\nIdiomas/)
    assert.match(publicReport, /Tipo: web \(Astro\)\. Servidor: no\. Blog: sí\. API: no\. Zona privada: no\./)
    assert.doesNotMatch(report, /mocks/)
  })

  it('dice si el proyecto existe y sigue en migración', () => {
    const report = buildStatusReport({ kitVersion: '0.1.0', answers: { ...answers, existing: true } }, { changed: [], missing: [], kitNew: [] }, { version: '0.1.0', dir: '/kits/zaius-dev', run: 'zaius-dev' })

    assert.match(report[2], /Proyecto: Pedidos \(existente, en migración\)/)
  })

  it('dice que está al día con la misma versión', () => {
    assert.match(buildStatusReport({ kitVersion: '0.1.0', answers }, { changed: [], missing: [], kitNew: [] }, { version: '0.1.0', dir: '/kits/zaius-dev', run: 'zaius-dev' })[0], /\(al día\)/)
  })

  it('con un kit más antiguo que el del proyecto no lo da por versión nueva', () => {
    const report = buildStatusReport({ kitVersion: '0.2.0', answers }, { changed: [], missing: [], kitNew: [] }, { version: '0.1.0', dir: '/kits/zaius-dev', run: 'zaius-dev' })

    assert.match(report[0], /esta orden es la 0\.1\.0, más antigua/)
  })
})

describe('isOlderVersion', () => {
  it('compara cada número como número', () => {
    assert.equal(isOlderVersion('0.1.0', '0.2.0'), true)
    assert.equal(isOlderVersion('0.9.0', '0.10.0'), true)
    assert.equal(isOlderVersion('0.2.0', '0.1.5'), false)
    assert.equal(isOlderVersion('0.2.0', '0.2.0'), false)
  })
})
