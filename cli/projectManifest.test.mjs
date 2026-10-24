import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, it } from 'node:test'
import {
  applyProjectFiles,
  groupProjectActions,
  hashContent,
  MANIFEST_FILE,
  planProjectFiles,
  readManifest,
  readOptionalFile,
  writeManifest,
} from './projectManifest.mjs'

let projectDir

beforeEach(async () => {
  projectDir = await mkdtemp(join(tmpdir(), 'kit-project-'))
})

afterEach(async () => {
  await rm(projectDir, { recursive: true, force: true })
})

/**
 * Arma los ficheros de la plantilla para un caso.
 * @param files Cada ruta con su contenido, o con `{ content, seed }`.
 * @returns El mapa que da `renderTemplate`.
 */
function buildRendered (files) {
  return new Map(Object.entries(files).map(([path, value]) => [path, typeof value === 'string' ? { content: value, seed: false } : value]))
}

describe('hashContent', () => {
  it('da la misma huella con LF y con CRLF', () => {
    assert.equal(hashContent('a\r\nb\r\n'), hashContent('a\nb\n'))
    assert.notEqual(hashContent('a'), hashContent('b'))
  })
})

describe('readManifest y writeManifest', () => {
  it('da null sin manifiesto y lo lee después de escribirlo', async () => {
    assert.equal(await readManifest(projectDir), null)

    await writeManifest(projectDir, { kitVersion: '0.1.0' })

    assert.deepEqual(await readManifest(projectDir), { kitVersion: '0.1.0' })
    assert.match(await readFile(join(projectDir, MANIFEST_FILE), 'utf8'), /\n$/)
  })
})

describe('planProjectFiles', () => {
  it('crea lo que falta y reconoce lo que ya es igual', async () => {
    await writeFile(join(projectDir, 'same.md'), 'igual\r\n')

    const actions = await planProjectFiles(projectDir, buildRendered({ 'new.md': 'nuevo', 'same.md': 'igual\n' }), {})

    assert.deepEqual(actions.map(({ path, action }) => [path, action]), [['new.md', 'create'], ['same.md', 'same']])
  })

  it('sustituye lo que el proyecto no ha tocado y deja al lado lo que sí', async () => {
    await writeFile(join(projectDir, 'untouched.md'), 'v1')
    await writeFile(join(projectDir, 'touched.md'), 'v1 cambiado')
    const recorded = { 'untouched.md': hashContent('v1'), 'touched.md': hashContent('v1') }

    const actions = await planProjectFiles(projectDir, buildRendered({ 'untouched.md': 'v2', 'touched.md': 'v2' }), recorded)

    assert.deepEqual(actions.map(({ action }) => action), ['replace', 'kitNew'])
  })

  it('respeta lo que el proyecto cambió si el kit no lo ha cambiado, y las semillas', async () => {
    await writeFile(join(projectDir, 'rule.md'), 'v1 cambiado')
    await writeFile(join(projectDir, 'seed.md'), 'rellenado')
    const recorded = { 'rule.md': hashContent('v1') }

    const actions = await planProjectFiles(projectDir, buildRendered({ 'rule.md': 'v1', 'seed.md': { content: 'vacío', seed: true } }), recorded)

    assert.deepEqual(actions.map(({ action }) => action), ['keep', 'keep'])
  })

  it('en un proyecto sin el kit, deja al lado la versión del kit de lo que ya existe', async () => {
    await writeFile(join(projectDir, 'README.md'), 'el del proyecto')

    const actions = await planProjectFiles(projectDir, buildRendered({ 'README.md': 'el del kit' }), {})

    assert.equal(actions[0].action, 'kitNew')
  })

  it('quita lo que el kit ya no da si nadie lo tocó, y solo lo avisa si se tocó', async () => {
    await writeFile(join(projectDir, 'old.md'), 'v1')
    await writeFile(join(projectDir, 'edited.md'), 'v1 cambiado')
    const recorded = { 'old.md': hashContent('v1'), 'edited.md': hashContent('v1'), 'gone.md': hashContent('v1') }

    const actions = await planProjectFiles(projectDir, buildRendered({}), recorded)

    assert.deepEqual(actions.map(({ path, action }) => [path, action]), [['old.md', 'remove'], ['edited.md', 'orphan']])
  })
})

describe('applyProjectFiles', () => {
  it('escribe, deja el .kit-new, borra y devuelve las huellas', async () => {
    await writeFile(join(projectDir, 'touched.md'), 'del proyecto')
    await writeFile(join(projectDir, 'old.md'), 'v1')
    await writeFile(join(projectDir, 'same.md.kit-new'), 'antiguo')
    const rendered = buildRendered({ 'docs/new.md': 'nuevo', 'touched.md': 'del kit', 'same.md': 'igual' })
    await writeFile(join(projectDir, 'same.md'), 'igual')
    const actions = await planProjectFiles(projectDir, rendered, { 'touched.md': hashContent('v0'), 'old.md': hashContent('v1') })

    const recorded = await applyProjectFiles(projectDir, actions, rendered)

    assert.equal(await readFile(join(projectDir, 'docs/new.md'), 'utf8'), 'nuevo')
    assert.equal(await readFile(join(projectDir, 'touched.md'), 'utf8'), 'del proyecto')
    assert.equal(await readFile(join(projectDir, 'touched.md.kit-new'), 'utf8'), 'del kit')
    assert.equal(await readOptionalFile(join(projectDir, 'old.md')), null)
    assert.equal(await readOptionalFile(join(projectDir, 'same.md.kit-new')), null)
    assert.deepEqual(Object.keys(recorded), ['docs/new.md', 'same.md', 'touched.md'])
    assert.equal(recorded['touched.md'], hashContent('del kit'))
  })

  it('al quitar un fichero quita las carpetas que deja vacías, y solo esas', async () => {
    await mkdir(join(projectDir, 'skills/old/notes'), { recursive: true })
    await writeFile(join(projectDir, 'skills/old/notes/SKILL.md'), 'v1')
    await writeFile(join(projectDir, 'skills/kept.md'), 'del proyecto')
    const actions = await planProjectFiles(projectDir, buildRendered({}), { 'skills/old/notes/SKILL.md': hashContent('v1') })

    await applyProjectFiles(projectDir, actions, buildRendered({}))

    assert.deepEqual(await readdir(join(projectDir, 'skills')), ['kept.md'])
  })
})

describe('groupProjectActions', () => {
  it('reparte las rutas por acción', () => {
    const groups = groupProjectActions([{ path: 'a', action: 'create' }, { path: 'b', action: 'kitNew' }, { path: 'c', action: 'create' }])

    assert.deepEqual(groups.create, ['a', 'c'])
    assert.deepEqual(groups.kitNew, ['b'])
    assert.deepEqual(groups.remove, [])
  })
})
