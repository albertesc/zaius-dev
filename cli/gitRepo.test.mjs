import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, it } from 'node:test'
import { isInsideGitRepo } from './gitRepo.mjs'

let workDir

beforeEach(async () => {
  workDir = await mkdtemp(join(tmpdir(), 'kit-git-'))
})

afterEach(async () => {
  await rm(workDir, { recursive: true, force: true })
})

describe('isInsideGitRepo', () => {
  it('no ve repositorio en una carpeta temporal sin .git', async () => {
    assert.equal(await isInsideGitRepo(join(workDir, 'casa-del-roble')), false)
  })

  it('ve el repositorio de una carpeta de encima, aunque la del proyecto aún no exista', async () => {
    await mkdir(join(workDir, '.git'))
    assert.equal(await isInsideGitRepo(join(workDir, 'casa-del-roble')), true)
  })

  it('ve el .git de un worktree o un submódulo, que es un fichero', async () => {
    await mkdir(join(workDir, 'aforo'))
    await writeFile(join(workDir, 'aforo', '.git'), 'gitdir: ../.git/worktrees/aforo\n')
    assert.equal(await isInsideGitRepo(join(workDir, 'aforo')), true)
  })
})
