import { isConditionMet } from './templateRender.mjs'

const PACKAGE_FIELDS = ['scripts', 'dependencies', 'devDependencies']

/**
 * Suma un fragmento a lo que pone el kit: sus campos y, después, los de cada `when` que se cumple, que puede llevar otro `when` dentro.
 * @param additions Lo que pone el kit hasta ahora, por campo; se cambia aquí.
 * @param fragment El fragmento, o uno de sus `when`.
 * @param conditions Lo que vale cada condición.
 */
function addFragment (additions, fragment, conditions) {
  for (const field of PACKAGE_FIELDS) Object.assign(additions[field], fragment[field])
  for (const [condition, extra] of Object.entries(fragment.when ?? {})) {
    if (isConditionMet(condition, conditions)) addFragment(additions, extra, conditions)
  }
}

/**
 * Arma lo que el kit pone en `package.json` con estas respuestas: lo de cada fragmento, en orden, y lo de cada condición (`when`).
 * @param fragments Los `package.fragment.json`: el de la plantilla y el de cada capa que se instala; uno posterior pisa un valor de otro anterior.
 * @param conditions Lo que vale cada condición.
 * @returns Los `scripts`, `dependencies` y `devDependencies` del kit.
 */
export function buildPackageAdditions (fragments, conditions) {
  const additions = Object.fromEntries(PACKAGE_FIELDS.map((field) => [field, {}]))
  for (const fragment of fragments) addFragment(additions, fragment, conditions)
  return additions
}

/**
 * Crea el `package.json` de un proyecto nuevo, antes de sumarle lo del kit.
 * @param slug El nombre del paquete.
 * @returns El `package.json` mínimo de una app.
 */
export function createBasePackage (slug) {
  return { name: slug, private: true, version: '0.1.0', type: 'module' }
}

/**
 * Ordena las claves de un objeto por orden alfabético, como hace npm con las dependencias.
 * @param record El objeto.
 * @returns Una copia ordenada.
 */
function sortRecord (record) {
  return Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)))
}

/**
 * Suma lo del kit al `package.json` del proyecto, sin pisar lo que el proyecto ya tenía con otro valor.
 * @param current El `package.json` del proyecto.
 * @param additions Lo que pone el kit (`buildPackageAdditions`).
 * @param previous Lo que el kit añadió la vez anterior, por campo: lo que ya no toca se quita.
 * @returns El `package.json` nuevo, lo que el kit ha añadido (para el manifiesto) y los conflictos con lo del proyecto.
 */
export function mergePackage (current, additions, previous = {}) {
  const pkg = structuredClone(current)
  const added = {}
  const conflicts = []
  for (const field of PACKAGE_FIELDS) {
    const owned = previous[field] ?? []
    const target = { ...pkg[field] }
    for (const name of owned) if (!Object.hasOwn(additions[field], name)) delete target[name]
    for (const [name, value] of Object.entries(additions[field])) {
      if (Object.hasOwn(target, name) && target[name] !== value && !owned.includes(name)) {
        conflicts.push({ field, name, project: target[name], kit: value })
        continue
      }
      target[name] = value
    }
    added[field] = Object.keys(additions[field]).filter((name) => target[name] === additions[field][name]).sort()
    if (Object.keys(target).length > 0) pkg[field] = field === 'scripts' ? target : sortRecord(target)
    else delete pkg[field]
  }
  return { pkg, added, conflicts }
}
