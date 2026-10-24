import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, describe, it } from 'node:test'
import { addProgressTask, noteKitNewTask, PROGRESS_FILE } from './progressNote.mjs'

describe('addProgressTask', () => {
  it('pone la tarea debajo de «Dónde estamos»', () => {
    const content = '# Próximos pasos\n\n## Dónde estamos\n\nAl día el 2026-10-22.\n'

    assert.equal(addProgressTask(content, 'Fusionar'), '# Próximos pasos\n\n## Dónde estamos\n\n- [ ] Fusionar\n\nAl día el 2026-10-22.\n')
  })

  it('la pone al final si no hay «Dónde estamos»', () => {
    assert.equal(addProgressTask('# Próximos pasos\n', 'Fusionar'), '# Próximos pasos\n\n- [ ] Fusionar\n')
  })
})

describe('noteKitNewTask', () => {
  let projectDir

  after(async () => {
    await rm(projectDir, { recursive: true, force: true })
  })

  it('apunta los ficheros por fusionar, y nada si no hay', async () => {
    projectDir = await mkdtemp(join(tmpdir(), 'kit-progress-'))
    await mkdir(join(projectDir, 'docs'))
    await writeFile(join(projectDir, PROGRESS_FILE), '## Dónde estamos\n')

    assert.equal(await noteKitNewTask(projectDir, [], '0.2.0'), false)
    assert.equal(await noteKitNewTask(projectDir, ['AGENTS.md'], '0.2.0'), true)
    assert.match(await readFile(join(projectDir, PROGRESS_FILE), 'utf8'), /- \[ \] Fusionar las versiones del kit 0\.2\.0 .*`AGENTS\.md`\./)
  })

  it('no hace nada si el proyecto no tiene next-steps.md', async () => {
    const emptyDir = await mkdtemp(join(tmpdir(), 'kit-progress-'))

    assert.equal(await noteKitNewTask(emptyDir, ['AGENTS.md'], '0.2.0'), false)

    await rm(emptyDir, { recursive: true, force: true })
  })
})
