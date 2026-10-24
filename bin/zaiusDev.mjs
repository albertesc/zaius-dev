#!/usr/bin/env node
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as clack from '@clack/prompts'
import { HELP_TEXT, parseCliArguments } from '../cli/cliArguments.mjs'
import { chooseCommand, runChangeCommand, runInitCommand, runStatusCommand, runUpdateCommand } from '../cli/cliCommands.mjs'
import { createConsolePrompts, resolveProjectDir } from '../cli/consolePrompts.mjs'

const kitDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const commands = { init: runInitCommand, change: runChangeCommand, update: runUpdateCommand, status: runStatusCommand }
const prompts = createConsolePrompts(clack, Boolean(process.stdout.isTTY))

try {
  const options = parseCliArguments(process.argv.slice(2), process.cwd())
  const projectDir = resolveProjectDir(options.projectDir)
  if (options.command === 'help') {
    console.log(HELP_TEXT)
  } else {
    const command = options.command ?? await chooseCommand({ projectDir, prompts })
    process.exitCode = command === null ? 1 : await commands[command]({ ...options, projectDir, kitDir, prompts })
  }
} catch (error) {
  prompts.log.error(error.message)
  process.exitCode = 1
}
