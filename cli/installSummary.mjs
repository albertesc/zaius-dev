const SKILL_FILE = /^\.claude\/skills\/[^/]+\/SKILL\.md$/

/**
 * Arma la pregunta de confirmación con lo que va a hacer la instalación.
 * @param result Lo que devuelve `installProject` con `dryRun`.
 * @returns «Voy a crear N ficheros, …. ¿Sigo?»; si solo cambian las respuestas, que se apuntan.
 */
export function buildInstallQuestion ({ groups, packageChange }) {
  const skills = [...groups.create, ...groups.replace].filter((path) => SKILL_FILE.test(path)).length
  const dependencies = (packageChange?.added.dependencies.length ?? 0) + (packageChange?.added.devDependencies.length ?? 0)
  const parts = [
    groups.create.length > 0 ? `crear ${groups.create.length} ficheros` : null,
    groups.replace.length > 0 ? `actualizar ${groups.replace.length} ficheros` : null,
    groups.kitNew.length > 0 ? `dejar ${groups.kitNew.length} versiones nuevas al lado (.kit-new)` : null,
    groups.remove.length > 0 ? `quitar ${groups.remove.length}` : null,
    packageChange?.changed ? (dependencies > 0 ? `poner ${dependencies} dependencias en package.json` : 'actualizar package.json') : null,
    skills > 0 ? `añadir ${skills} skills` : null,
  ].filter((part) => part !== null)
  if (parts.length === 0) return 'No cambia ningún fichero: voy a apuntar las respuestas nuevas en zaius-dev.json. ¿Sigo?'
  const last = parts.pop()
  const list = parts.length > 0 ? `${parts.join(', ')} y ${last}` : last
  return `Voy a ${list}. ¿Sigo?`
}

/**
 * Dice si una instalación no cambia nada en el proyecto: ni los ficheros, ni `package.json`, ni las respuestas.
 * @param result Lo que devuelve `installProject`.
 * @returns `true` si todo está igual.
 */
export function isInstallEmpty ({ groups, packageChange, answersChanged = false }) {
  return groups.create.length + groups.replace.length + groups.kitNew.length + groups.remove.length === 0 && !packageChange?.changed && !answersChanged
}

/**
 * Arma el detalle de lo que conviene revisar después de instalar: ficheros que ya no da el kit y conflictos de `package.json`.
 * @param result Lo que devuelve `installProject`.
 * @returns Las líneas de aviso, o ninguna.
 */
export function buildInstallWarnings ({ groups, packageChange }) {
  return [
    ...groups.orphan.map((path) => `${path}: el kit ya no lo da, pero el proyecto lo ha cambiado; se queda como está.`),
    ...(packageChange?.conflicts ?? []).map(({ field, name, project, kit }) => `package.json, ${field}.${name}: se queda «${project}» del proyecto; el kit pone «${kit}».`),
  ]
}

/**
 * Busca un cambio de una respuesta que no se cambia en un proyecto que ya tiene el código del kit: el tipo.
 * @param previous Las respuestas de ahora.
 * @param next Las respuestas nuevas, ya normalizadas.
 * @returns El motivo por el que no se cambia, o `null` si el tipo es el mismo.
 */
export function findFixedAnswerChange (previous, next) {
  if (previous.type !== next.type) return `Este proyecto ya tiene el código del kit de una ${previous.type}: el tipo no se cambia con change.`
  return null
}

/**
 * Arma los avisos de un cambio de respuestas de una web que deja de funcionar código que el proyecto ya tiene.
 * @param previous Las respuestas de ahora.
 * @param next Las respuestas nuevas, ya normalizadas.
 * @returns Las líneas de aviso, o ninguna.
 */
export function buildChangeWarnings (previous, next) {
  if (previous.type !== 'web' || next.type !== 'web') return []
  return [
    previous.privateArea && !next.privateArea ? 'Sin zona privada se quitan la sesión y los permisos: las páginas privadas dejan de funcionar.' : null,
    previous.server && !next.server ? 'Sin servidor, los formularios y lo que se pinta en cada petición dejan de funcionar.' : null,
  ].filter((warning) => warning !== null)
}
