import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { buildConditions, buildKitCommand, buildTemplateValues, slugifyName } from './installAnswers.mjs'
import { buildPackageAdditions, createBasePackage, mergePackage } from './packageMerge.mjs'
import {
  applyProjectFiles,
  groupProjectActions,
  planProjectFiles,
  readManifest,
  readOptionalFile,
  writeManifest,
} from './projectManifest.mjs'
import { PACKAGE_FRAGMENT, renderTemplate, resolveTemplateRoots } from './templateRender.mjs'

export const TEMPLATE_FILES_RULES = 'templateFiles.json'

/**
 * Lee del kit su versión, su repositorio, su plantilla y las reglas de `templateFiles.json`.
 * @param kitDir La carpeta del kit.
 * @returns `version`; `source`, el repositorio de `package.json` (o `null`); `run`, la orden que lanza esta versión; `dir`, la carpeta del kit, y `rules`.
 */
export async function readKitInfo (kitDir) {
  const { version, repository = null } = JSON.parse(await readFile(join(kitDir, 'package.json'), 'utf8'))
  const rules = JSON.parse(await readFile(join(kitDir, TEMPLATE_FILES_RULES), 'utf8'))
  const source = typeof repository === 'string' ? repository : repository?.url ?? null
  return { version, source, run: buildKitCommand(source, version), dir: kitDir, rules }
}

/**
 * Lee los fragmentos de `package.json` de la plantilla: el de cada carpeta que se instala, si lo tiene.
 * @param kitDir La carpeta del kit.
 * @param roots Las carpetas de la plantilla que se instalan (`resolveTemplateRoots`).
 * @returns Los fragmentos, en el orden en que se suman.
 */
async function readPackageFragments (kitDir, roots) {
  const texts = await Promise.all(roots.map((root) => readOptionalFile(join(kitDir, root, PACKAGE_FRAGMENT))))
  return texts.filter((text) => text !== null).map((text) => JSON.parse(text))
}

/**
 * Prepara el `package.json` del proyecto con lo que pone el kit; un proyecto existente no se toca hasta terminar la migración.
 * @param options `projectDir`, `kitDir`, `roots`, `answers`, `conditions` y `previous`, lo que el kit añadió la vez anterior.
 * @returns El `package.json` nuevo en texto, lo añadido, los conflictos y si cambia; o `null` en un proyecto existente.
 */
async function planProjectPackage ({ projectDir, kitDir, roots, answers, conditions, previous }) {
  if (answers.existing) return null
  const fragments = await readPackageFragments(kitDir, roots)
  const currentText = await readOptionalFile(join(projectDir, 'package.json'))
  const current = currentText === null ? createBasePackage(slugifyName(answers.name)) : JSON.parse(currentText)
  const merged = mergePackage(current, buildPackageAdditions(fragments, conditions), previous)
  const text = `${JSON.stringify(merged.pkg, null, 2)}\n`
  return { ...merged, text, changed: text.replaceAll('\r\n', '\n') !== currentText?.replaceAll('\r\n', '\n') }
}

/**
 * Dice si dos juegos de respuestas son iguales, sin mirar el orden de sus claves.
 * @param a Unas respuestas, o `null`.
 * @param b Las otras.
 * @returns `true` si dicen lo mismo.
 */
function isSameAnswers (a, b) {
  const stable = (answers) => answers === null ? null : JSON.stringify(Object.entries(answers).sort(([x], [y]) => x.localeCompare(y)))
  return stable(a) === stable(b)
}

/**
 * Instala o pone al día el kit en un proyecto: genera la plantilla, decide qué hacer con cada fichero y lo aplica.
 * @param options `projectDir`; `kitDir`; `answers`, ya normalizadas; `date` (`aaaa-mm-dd`); `timezone`; `dryRun`, para calcular el resumen sin escribir nada.
 * @returns La versión del kit, las rutas por acción (`create`, `replace`, `kitNew`…), el cambio de `package.json` y `answersChanged`, si las respuestas no son las del manifiesto.
 */
export async function installProject ({ projectDir, kitDir, answers, date, timezone, dryRun = false }) {
  const kit = await readKitInfo(kitDir)
  const manifest = await readManifest(projectDir)
  const conditions = buildConditions(answers)
  const values = buildTemplateValues(answers, { kitVersion: kit.version, kitSource: kit.source, date, timezone })
  const rendered = await renderTemplate({ kitDir: kit.dir, rules: kit.rules, conditions, values, languages: answers.languages })
  const actions = await planProjectFiles(projectDir, rendered, manifest?.files ?? {})
  const packageChange = await planProjectPackage({ projectDir, kitDir: kit.dir, roots: resolveTemplateRoots(kit.rules, conditions), answers, conditions, previous: manifest?.package ?? {} })
  if (!dryRun) {
    const files = await applyProjectFiles(projectDir, actions, rendered)
    if (packageChange?.changed) await writeFile(join(projectDir, 'package.json'), packageChange.text)
    await writeManifest(projectDir, {
      kitVersion: kit.version,
      installedAt: manifest?.installedAt ?? date,
      updatedAt: date,
      answers,
      package: packageChange?.added ?? manifest?.package ?? {},
      seeds: [...rendered].filter(([, file]) => file.seed).map(([path]) => path).sort(),
      files,
    })
  }
  return { kitVersion: kit.version, groups: groupProjectActions(actions), packageChange, answersChanged: !isSameAnswers(manifest?.answers ?? null, answers) }
}
