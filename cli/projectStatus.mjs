import { join } from 'node:path'
import { hashContent, KIT_NEW_SUFFIX, readOptionalFile } from './projectManifest.mjs'

/**
 * Mira cómo está el kit en un proyecto: qué ficheros ha cambiado el proyecto, cuáles faltan y qué versiones nuevas esperan.
 * @param projectDir La carpeta del proyecto.
 * @param manifest Su manifiesto (`zaius-dev.json`); sus semillas, que el proyecto rellena, no cuentan como cambiadas.
 * @returns `changed`, `missing` y `kitNew`, cada uno con sus rutas.
 */
export async function getProjectStatus (projectDir, manifest) {
  const status = { changed: [], missing: [], kitNew: [] }
  const seeds = manifest.seeds ?? []
  for (const [path, recordedHash] of Object.entries(manifest.files)) {
    const current = await readOptionalFile(join(projectDir, path))
    if (current === null) status.missing.push(path)
    else if (hashContent(current) !== recordedHash && !seeds.includes(path)) status.changed.push(path)
    if (await readOptionalFile(join(projectDir, `${path}${KIT_NEW_SUFFIX}`)) !== null) status.kitNew.push(path)
  }
  return status
}

/**
 * Dice si una versión del kit es más antigua que otra.
 * @param version La versión que se mira (`0.1.0`).
 * @param other La versión con la que se compara.
 * @returns `true` si `version` es anterior a `other`.
 */
export function isOlderVersion (version, other) {
  const [a, b] = [version, other].map((value) => value.split('.').map(Number))
  const index = a.findIndex((part, position) => part !== b[position])
  return index !== -1 && a[index] < b[index]
}

/**
 * Arma el informe de `zaius-dev status`.
 * @param manifest El manifiesto del proyecto.
 * @param status Lo que da `getProjectStatus`.
 * @param kit El kit que se está ejecutando: su `version`, su carpeta (`dir`), la que buscan las skills, y la orden que lo lanza (`run`).
 * @returns Las líneas del informe.
 */
export function buildStatusReport (manifest, status, kit) {
  const { answers } = manifest
  const yesNo = (value) => (value ? 'sí' : 'no')
  const list = (paths) => paths.length === 0 ? ['  ninguno'] : paths.map((path) => `  ${path}`)
  const versionNote = manifest.kitVersion === kit.version
    ? ' (al día)'
    : isOlderVersion(kit.version, manifest.kitVersion)
      ? ` (esta orden es la ${kit.version}, más antigua)`
      : ` (hay una versión nueva: ${kit.version}; «${kit.run} update»)`
  return [
    `Kit en el proyecto: ${manifest.kitVersion}${versionNote}`,
    `Carpeta del kit: ${kit.dir}`,
    `Proyecto: ${answers.name} · ${answers.existing ? 'existente, en migración' : 'nuevo'} · gestor de paquetes: ${answers.packageManager}`,
    answers.type === 'web'
      ? `Tipo: web (Astro) · servidor: ${yesNo(answers.server)} · blog: ${yesNo(answers.content)} · zona privada: ${yesNo(answers.privateArea)}`
      : `Tipo: app (React) · API: ${yesNo(answers.api)} · mocks: ${yesNo(answers.mocks)}`,
    `Idiomas: ${answers.languages.join(', ')} · multiidioma: ${yesNo(answers.i18n)}`,
    '',
    'Ficheros del kit que el proyecto ha cambiado:',
    ...list(status.changed),
    'Ficheros del kit que faltan:',
    ...list(status.missing),
    'Versiones nuevas por fusionar (.kit-new):',
    ...list(status.kitNew),
  ]
}
