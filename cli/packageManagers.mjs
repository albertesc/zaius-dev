export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun']

export const DEFAULT_PACKAGE_MANAGER = 'npm'

const EXEC_COMMANDS = { npm: 'npx', pnpm: 'pnpm exec', yarn: 'yarn run', bun: 'bunx' }

const DLX_COMMANDS = { npm: 'npx', pnpm: 'pnpm dlx', yarn: 'npx', bun: 'bunx' }

const LOCKFILES = {
  'bun.lock': 'bun',
  'bun.lockb': 'bun',
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
  'npm-shrinkwrap.json': 'npm',
}

const DECLARED = /"packageManager"\s*:\s*"(npm|pnpm|yarn|bun)@/

/**
 * Da la orden que lanza un binario del proyecto (`vitest`, `astro`) con un gestor de paquetes.
 * @param packageManager `npm`, `pnpm`, `yarn` o `bun`.
 * @returns `npx`, `pnpm exec`, `yarn run` (en yarn 1, `yarn exec` no lanza nada y termina bien) o `bunx`.
 */
export function getExecCommand (packageManager) {
  return EXEC_COMMANDS[packageManager]
}

/**
 * Da la orden que lanza un programa sin instalarlo en el proyecto (la CLI de una plataforma) con un gestor de paquetes.
 * @param packageManager `npm`, `pnpm`, `yarn` o `bun`.
 * @returns `npx`, `pnpm dlx`, `npx` con yarn (yarn 1 no tiene `dlx`, y npx viene con Node) o `bunx`.
 */
export function getDlxCommand (packageManager) {
  return DLX_COMMANDS[packageManager]
}

/**
 * Averigua el gestor de paquetes de un proyecto: el del campo `packageManager` de su `package.json` o, si no, el de su lockfile.
 * @param names Los ficheros de la carpeta del proyecto.
 * @param packageJson El contenido de su `package.json`, o `null`.
 * @returns `npm`, `pnpm`, `yarn` o `bun`, o `null` si nada lo dice.
 */
export function detectPackageManager (names, packageJson) {
  const declared = DECLARED.exec(packageJson ?? '')?.[1]
  return declared ?? Object.entries(LOCKFILES).find(([lockfile]) => names.includes(lockfile))?.[1] ?? null
}

/**
 * Parte una orden escrita (`pnpm exec tsc -b`) en la orden y sus argumentos, para `runCommand`.
 * @param text La orden entera.
 * @returns `text`, `command` y `args`.
 */
function toCommand (text) {
  const [command, ...args] = text.split(' ')
  return { text, command, args }
}

/**
 * Da las órdenes con las que el instalador termina un proyecto: instalar las dependencias y pasar las comprobaciones.
 * @param packageManager El gestor de paquetes del proyecto.
 * @returns `install`, y `checks`: los tipos, el lint y los tests, en ese orden, cada uno con su `label`. Todos son scripts del proyecto, que cada stack define; los tests van con `run test`: `bun test` es el runner de bun, no Vitest.
 */
export function buildProjectCommands (packageManager) {
  return {
    install: toCommand(`${packageManager} install`),
    checks: [
      { label: 'Tipos', ...toCommand(`${packageManager} run typecheck`) },
      { label: 'Lint', ...toCommand(`${packageManager} run lint`) },
      { label: 'Tests', ...toCommand(`${packageManager} run test`) },
    ],
  }
}
