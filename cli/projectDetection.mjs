import { readdir } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { detectPackageManager } from './packageManagers.mjs'
import { readManifest, readOptionalFile } from './projectManifest.mjs'
import { detectType, detectWebAnswers } from './typeDetection.mjs'

const ASTRO_CONFIG = /^astro\.config\.(mjs|ts|js|mts|cjs)$/

/**
 * Lee lo que hace falta para las respuestas de una web de un proyecto Astro: su configuración y los ficheros de su `src/`.
 * @param projectDir La carpeta del proyecto.
 * @param names Los ficheros de la carpeta.
 * @param packageJson El contenido de su `package.json`.
 * @returns Lo que da `detectWebAnswers`.
 */
async function readWebProject (projectDir, names, packageJson) {
  const configName = names.find((name) => ASTRO_CONFIG.test(name))
  const configText = configName === undefined ? null : await readOptionalFile(join(projectDir, configName))
  const srcNames = names.includes('src') ? await readdir(join(projectDir, 'src')).catch(() => []) : []
  return detectWebAnswers({ packageJson, configText, srcNames })
}

/**
 * Mira qué hay en la carpeta donde se lanza el instalador.
 * @param projectDir La carpeta.
 * @returns `isEmpty` (sin nada más que ficheros ocultos), `hasPackageJson`, `packageManager` y `type` (los que usa, o `null`), `web` (las respuestas de una web de un proyecto Astro, o `null`), `known` (las respuestas que su código ya fija, si es un proyecto existente), `manifest` (el del kit, o `null`) y `folderName`.
 */
export async function detectProject (projectDir) {
  const names = await readdir(projectDir)
  const packageJson = names.includes('package.json') ? await readOptionalFile(join(projectDir, 'package.json')) : null
  const type = detectType(names, packageJson)
  const web = type === 'web' ? await readWebProject(projectDir, names, packageJson) : null
  const packageManager = detectPackageManager(names, packageJson)
  return {
    folderName: basename(projectDir),
    isEmpty: names.every((name) => name.startsWith('.')),
    hasPackageJson: packageJson !== null,
    packageManager,
    type,
    web: web?.answers ?? null,
    known: {
      ...(type === null ? {} : { type }),
      ...(packageManager === null ? {} : { packageManager }),
      ...web?.known,
    },
    manifest: await readManifest(projectDir),
  }
}
