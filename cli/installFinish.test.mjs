import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { tailOutput } from './installFinish.mjs'

describe('tailOutput', () => {
  it('deja las últimas 40 líneas', () => {
    const output = Array.from({ length: 50 }, (_, index) => `línea ${index + 1}`).join('\r\n')

    const tail = tailOutput(`${output}\n`).split('\n')

    assert.equal(tail.length, 40)
    assert.equal(tail[0], 'línea 11')
    assert.equal(tail.at(-1), 'línea 50')
  })
})
