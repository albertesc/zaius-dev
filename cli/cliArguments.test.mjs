import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { describe, it } from 'node:test'
import { HELP_TEXT, parseCliArguments } from './cliArguments.mjs'

const cwd = resolve('/proyectos/pedidos')

describe('parseCliArguments', () => {
  it('sin nada, deja elegir la orden en la carpeta actual', () => {
    assert.deepEqual(parseCliArguments([], cwd), { command: null, projectDir: cwd, configPath: null, yes: false, skipInstall: false })
  })

  it('lee la orden y las opciones, con las rutas resueltas', () => {
    const options = parseCliArguments(['init', '--config', 'answers.json', '--yes', '--skip-install', '--cwd', '../otro'], cwd)

    assert.deepEqual(options, {
      command: 'init',
      projectDir: resolve(cwd, '../otro'),
      configPath: resolve(cwd, 'answers.json'),
      yes: true,
      skipInstall: true,
    })
  })

  it('reconoce la ayuda', () => {
    assert.equal(parseCliArguments(['--help'], cwd).command, 'help')
    assert.match(HELP_TEXT, /zaius-dev \[orden\]/)
  })

  it('falla con lo que no conoce o con una opción sin valor', () => {
    assert.throws(() => parseCliArguments(['install'], cwd), /Orden desconocida: install/)
    assert.throws(() => parseCliArguments(['--force'], cwd), /Opción desconocida: --force/)
    assert.throws(() => parseCliArguments(['--config'], cwd), /Falta el valor de --config/)
  })
})
