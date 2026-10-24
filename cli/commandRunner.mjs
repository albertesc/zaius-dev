import { spawn } from 'node:child_process'

/**
 * Lanza una orden en la carpeta del proyecto y recoge lo que escribe.
 * @param command La orden (`npm`, `pnpm`, `npx`).
 * @param args Sus argumentos.
 * @param cwd La carpeta en la que se lanza.
 * @returns `ok` si termina con 0, y su salida y sus errores juntos.
 */
export function runCommand (command, args, cwd) {
  return new Promise((resolve) => {
    const child = spawn([command, ...args].join(' '), { cwd, shell: true, env: { ...process.env, FORCE_COLOR: '0' } })
    let output = ''
    child.stdout.on('data', (chunk) => { output += chunk })
    child.stderr.on('data', (chunk) => { output += chunk })
    child.on('error', (error) => resolve({ ok: false, output: `${output}${error.message}` }))
    child.on('close', (code) => resolve({ ok: code === 0, output }))
  })
}
