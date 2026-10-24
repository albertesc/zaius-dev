import assert from 'node:assert/strict'
import { tmpdir } from 'node:os'
import { describe, it } from 'node:test'
import { runCommand } from './commandRunner.mjs'

describe('runCommand', () => {
  it('recoge la salida y dice si ha ido bien', async () => {
    const result = await runCommand('node', ['-e', '"console.log(\'hola\')"'], tmpdir())

    assert.equal(result.ok, true)
    assert.match(result.output, /hola/)
  })

  it('dice si ha fallado, con sus errores', async () => {
    const result = await runCommand('node', ['-e', '"console.error(\'mal\'); process.exit(2)"'], tmpdir())

    assert.equal(result.ok, false)
    assert.match(result.output, /mal/)
  })
})
