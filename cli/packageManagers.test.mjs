import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { buildProjectCommands, detectPackageManager, getExecCommand, PACKAGE_MANAGERS } from './packageManagers.mjs'

describe('getExecCommand', () => {
  it('da la orden de cada gestor para lanzar un binario, con yarn run en yarn', () => {
    assert.deepEqual(PACKAGE_MANAGERS.map(getExecCommand), ['npx', 'pnpm exec', 'yarn run', 'bunx'])
  })
})

describe('detectPackageManager', () => {
  it('reconoce el gestor por su lockfile', () => {
    assert.equal(detectPackageManager(['package.json', 'pnpm-lock.yaml'], '{}'), 'pnpm')
    assert.equal(detectPackageManager(['yarn.lock'], '{}'), 'yarn')
    assert.equal(detectPackageManager(['bun.lock'], '{}'), 'bun')
    assert.equal(detectPackageManager(['bun.lockb'], '{}'), 'bun')
    assert.equal(detectPackageManager(['package-lock.json'], '{}'), 'npm')
  })

  it('prefiere el campo packageManager de package.json al lockfile', () => {
    assert.equal(detectPackageManager(['package-lock.json'], '{ "packageManager": "yarn@4.18.1" }'), 'yarn')
  })

  it('da null si nada lo dice', () => {
    assert.equal(detectPackageManager([], null), null)
    assert.equal(detectPackageManager(['package.json'], '{ "packageManager": "otro@1.0.0" }'), null)
  })
})

describe('buildProjectCommands', () => {
  it('instala y pasa los tipos, el lint y los tests con el gestor del proyecto', () => {
    const { install, checks } = buildProjectCommands('pnpm')

    assert.deepEqual(install, { text: 'pnpm install', command: 'pnpm', args: ['install'] })
    assert.deepEqual(checks.map(({ label, text }) => `${label}: ${text}`), ['Tipos: pnpm run typecheck', 'Lint: pnpm run lint', 'Tests: pnpm run test'])
  })

  it('con bun pasa los tests de Vitest, no los de bun', () => {
    assert.equal(buildProjectCommands('bun').checks[2].text, 'bun run test')
  })
})
