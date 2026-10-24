import assert from 'node:assert/strict'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, it } from 'node:test'
import { getDefaultAnswers } from './installAnswers.mjs'
import { formatInstallDate, getSystemTimezone, runInstallFlow } from './installFlow.mjs'
import { readOptionalFile } from './projectManifest.mjs'

let kitDir
let projectDir

/**
 * Crea un módulo de preguntas falso que confirma lo que se le dé y apunta lo que se le dice.
 * @param confirmation La respuesta a la confirmación.
 * @returns El módulo, con `messages`, lo que ha escrito.
 */
function createPrompts (confirmation) {
  const messages = []
  const write = (message) => messages.push(message)
  return {
    messages,
    confirm: (options) => {
      messages.push(options.message)
      return Promise.resolve(confirmation)
    },
    isCancel: () => false,
    cancel: write,
    log: { success: write, info: write, warn: write, error: write },
    spinner: () => ({ start: write, stop: write, error: write }),
  }
}

beforeEach(async () => {
  kitDir = await mkdtemp(join(tmpdir(), 'kit-flow-'))
  projectDir = await mkdtemp(join(tmpdir(), 'kit-flow-target-'))
  await mkdir(join(kitDir, 'shared/docs'), { recursive: true })
  await writeFile(join(kitDir, 'package.json'), JSON.stringify({ version: '0.1.0' }))
  await writeFile(join(kitDir, 'templateFiles.json'), JSON.stringify({ base: 'shared', overlays: { web: 'web', app: 'app' }, conditions: {}, seeds: [] }))
  await writeFile(join(kitDir, 'shared/AGENTS.md'), '# %%APP_NAME%%\n')
  await writeFile(join(kitDir, 'shared/docs/next-steps.md'), '## Dónde estamos\n')
  await writeFile(join(kitDir, 'shared/package.fragment.json'), '{}')
})

afterEach(async () => {
  await rm(kitDir, { recursive: true, force: true })
  await rm(projectDir, { recursive: true, force: true })
})

const answers = { ...getDefaultAnswers({ folderName: 'pedidos', hasPackageJson: false }), name: 'Pedidos' }

describe('formatInstallDate y getSystemTimezone', () => {
  it('da la fecha en aaaa-mm-dd y una zona horaria', () => {
    assert.equal(formatInstallDate(new Date(2026, 9, 2)), '2026-10-02')
    assert.equal(typeof getSystemTimezone(), 'string')
  })
})

describe('runInstallFlow', () => {
  it('pregunta con el resumen y no cambia nada si la respuesta es que no', async () => {
    const prompts = createPrompts(false)

    assert.equal(await runInstallFlow({ projectDir, kitDir, answers, yes: false, skipInstall: true, prompts }), null)
    assert.match(prompts.messages[0], /^Voy a crear 2 ficheros/)
    assert.equal(await readOptionalFile(join(projectDir, 'AGENTS.md')), null)
  })

  it('instala sin preguntar con yes, y la segunda vez dice que no hay nada que hacer', async () => {
    const prompts = createPrompts(true)

    const first = await runInstallFlow({ projectDir, kitDir, answers, yes: true, skipInstall: true, prompts })
    const second = await runInstallFlow({ projectDir, kitDir, answers, yes: true, skipInstall: true, prompts })

    assert.equal(first.ok, true)
    assert.equal(await readFile(join(projectDir, 'AGENTS.md'), 'utf8'), '# Pedidos\n')
    assert.equal(second, null)
    assert.match(prompts.messages.at(-1), /ya está al día/)
  })

  it('apunta en next-steps los .kit-new que deja', async () => {
    const prompts = createPrompts(true)
    await runInstallFlow({ projectDir, kitDir, answers, yes: true, skipInstall: true, prompts })
    await writeFile(join(projectDir, 'AGENTS.md'), '# Pedidos\n\nDel proyecto.\n')
    await writeFile(join(kitDir, 'shared/AGENTS.md'), '# %%APP_NAME%%\n\nDel kit.\n')

    const result = await runInstallFlow({ projectDir, kitDir, answers, yes: true, skipInstall: true, prompts })

    assert.deepEqual(result.result.groups.kitNew, ['AGENTS.md'])
    assert.match(await readFile(join(projectDir, 'docs/next-steps.md'), 'utf8'), /- \[ \] Fusionar las versiones del kit 0\.1\.0/)
  })
})
