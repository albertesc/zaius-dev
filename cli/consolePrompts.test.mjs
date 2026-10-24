import assert from 'node:assert/strict'
import { mkdtemp, realpath, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { createConsolePrompts, resolveProjectDir } from './consolePrompts.mjs'

describe('createConsolePrompts', () => {
  it('en una terminal deja el módulo tal cual', () => {
    const prompts = { log: {} }

    assert.equal(createConsolePrompts(prompts, true), prompts)
  })

  it('fuera de una terminal da el progreso en líneas sueltas', () => {
    const lines = []
    const prompts = { log: { step: (line) => lines.push(`step ${line}`), success: (line) => lines.push(`ok ${line}`), error: (line) => lines.push(`error ${line}`) } }

    const spinner = createConsolePrompts(prompts, false).spinner()
    spinner.start('Tipos')
    spinner.stop('Tipos: en verde')
    spinner.error('Tests: falla')

    assert.deepEqual(lines, ['step Tipos', 'ok Tipos: en verde', 'error Tests: falla'])
  })
})

describe('resolveProjectDir', () => {
  it('da la ruta real de una carpeta y la misma de una que no existe', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'kit-real-'))

    assert.equal(resolveProjectDir(dir), await realpath(dir))
    assert.equal(resolveProjectDir(join(dir, 'no-existe')), join(dir, 'no-existe'))

    await rm(dir, { recursive: true, force: true })
  })
})
