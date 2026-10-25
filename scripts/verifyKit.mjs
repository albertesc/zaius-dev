import { mkdir, mkdtemp, readdir, readFile, realpath, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runCommand } from '../cli/commandRunner.mjs'
import { buildConditions, slugifyName } from '../cli/installAnswers.mjs'
import { readManifest } from '../cli/projectManifest.mjs'
import { renderTemplate } from '../cli/templateRender.mjs'

const kitDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const keep = process.argv.includes('--keep')
const docsOnly = process.argv.includes('--docs')
const only = process.argv.find((argument) => argument.startsWith('--only='))?.slice('--only='.length).split(',')

const APP_ALL_YES = { type: 'app', name: 'Pedidos del Sur', i18n: true, languages: ['es', 'ca'], backend: true, mocks: true }

const WEB_ALL_YES = { type: 'web', name: 'Casa del Roble', i18n: true, languages: ['es', 'en'], server: true, content: true, backend: true, privateArea: true }

const LEGACY_README = '# Legacy\n'

const COMBINATIONS = [
  { id: 'app-por-defecto', answers: { type: 'app', name: 'Gestión de pedidos' } },
  { id: 'app-todo-si', answers: APP_ALL_YES },
  { id: 'app-sin-mocks', answers: { type: 'app', name: 'Pedidos', mocks: false } },
  { id: 'app-todo-no', answers: { type: 'app', name: 'Pedidos', backend: false, git: false } },
  { id: 'app-existente', answers: { name: 'Pedidos', existing: true }, existingFiles: { 'package.json': '{ "name": "legacy", "type": "module", "dependencies": { "react": "^19.2.8", "react-dom": "^19.2.8" } }\n', 'README.md': LEGACY_README } },
  { id: 'app-pnpm', answers: { ...APP_ALL_YES, packageManager: 'pnpm' } },
  { id: 'app-yarn', answers: { ...APP_ALL_YES, packageManager: 'yarn' } },
  { id: 'app-bun', answers: { ...APP_ALL_YES, packageManager: 'bun' } },
  { id: 'web-por-defecto', answers: { type: 'web', name: 'Casa del Roble' } },
  { id: 'web-servidor', answers: { type: 'web', name: 'Casa del Roble', server: true } },
  { id: 'web-blog', answers: { type: 'web', name: 'Casa del Roble', content: true, i18n: true, languages: ['es', 'en'] } },
  { id: 'web-api', answers: { type: 'web', name: 'Casa del Roble', backend: true } },
  { id: 'web-todo-si', answers: WEB_ALL_YES },
  { id: 'web-crece', answers: { type: 'web', name: 'Casa del Roble', server: true }, then: { privateArea: true, platform: 'vercel' } },
  { id: 'web-netlify', answers: { type: 'web', name: 'Casa del Roble', server: true, platform: 'netlify', git: false } },
  { id: 'web-cloudflare', answers: { ...WEB_ALL_YES, platform: 'cloudflare' } },
  { id: 'web-existente', answers: { name: 'Casa del Roble', existing: true }, existingFiles: { 'package.json': '{ "name": "legacy", "type": "module", "dependencies": { "astro": "^7.4.2", "@astrojs/node": "^11.1.9" } }\n', 'README.md': LEGACY_README } },
  { id: 'web-pnpm', answers: { ...WEB_ALL_YES, packageManager: 'pnpm' } },
  { id: 'web-yarn', answers: { ...WEB_ALL_YES, packageManager: 'yarn' } },
  { id: 'web-bun', answers: { ...WEB_ALL_YES, packageManager: 'bun' } },
]

const GENERATED = /^(\.git|node_modules|dist|\.yarn|\.astro|\.wrangler|\.vercel|\.netlify)\/|^\.pnp\.|^(package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?)$|\.tsbuildinfo$/

const AI_SIGNS = /[·→←⇒—–≈≥≤×─│├└✓✔✅❌✖⚠]|\u20E3|(?![©®™])\p{Extended_Pictographic}/u

const QUOTED = /«[^»]*»/g

const FORBIDDEN = [/%%[A-Z_]+%%/, /kit:(if|else|end)\b/, /`zaius-dev (init|change|update|status|help)\b/]

const TEMPLATE_TESTS_DIR = 'templateTests'

/**
 * Lista los ficheros de texto de un proyecto instalado, sin dependencias, compilados ni lo que deja el gestor de paquetes.
 * @param dir La carpeta del proyecto.
 * @returns Las rutas relativas, con `/`.
 */
async function listProjectFiles (dir) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => relative(dir, join(entry.parentPath, entry.name)).replaceAll('\\', '/'))
    .filter((path) => !GENERATED.test(path))
}

/**
 * Pasa un título de markdown a su ancla, como GitHub.
 * @param heading El texto del título.
 * @returns El ancla, sin `#`.
 */
function slugify (heading) {
  return heading.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '').replaceAll(' ', '-')
}

/**
 * Da las anclas de un documento, con los sufijos de los títulos repetidos.
 * @param content El markdown.
 * @returns Las anclas.
 */
function getAnchors (content) {
  const seen = new Map()
  const anchors = new Set()
  for (const [, heading] of content.replace(/```[\s\S]*?```/g, '').matchAll(/^#{1,6} +(.+?) *$/gm)) {
    const slug = slugify(heading)
    const count = seen.get(slug) ?? 0
    seen.set(slug, count + 1)
    anchors.add(count === 0 ? slug : `${slug}-${count}`)
  }
  return anchors
}

/**
 * Busca los enlaces rotos de los documentos de un proyecto: ficheros que no existen y anclas que no están.
 * @param dir La carpeta del proyecto.
 * @param files Sus ficheros.
 * @returns Los enlaces rotos, con el fichero que los tiene.
 */
async function findBrokenLinks (dir, files) {
  const broken = []
  for (const file of files.filter((path) => path.endsWith('.md'))) {
    const content = (await readFile(join(dir, file), 'utf8')).replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')
    for (const [, target] of content.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^[a-z]+:/.test(target)) continue
      const [path, anchor] = target.split('#')
      const targetFile = path === '' ? file : relative(dir, resolve(dir, dirname(file), decodeURIComponent(path))).replaceAll('\\', '/')
      if (!files.includes(targetFile) && !files.some((other) => other.startsWith(`${targetFile}/`))) {
        broken.push(`${file}: ${target} (no existe)`)
        continue
      }
      if (anchor !== undefined && targetFile.endsWith('.md') && !getAnchors(await readFile(join(dir, targetFile), 'utf8')).has(decodeURIComponent(anchor))) {
        broken.push(`${file}: ${target} (no tiene el ancla)`)
      }
    }
  }
  return broken
}

/**
 * Comprueba lo que no debe aparecer según el tipo: lo del otro camino y, en una web, lo que no se ha pedido de ella.
 * @param answers Las respuestas del proyecto, ya normalizadas.
 * @param path La ruta del fichero.
 * @param content Su contenido.
 * @returns Los problemas encontrados.
 */
function findTypeLeaks (answers, path, content) {
  if (answers.type === 'app') {
    return [
      /\.astro\b|\bastro:[a-z]|\bAstro\.[a-z]|docs\/pages\b|zaius-page\b/.test(content) ? `${path}: habla de una web en una app` : null,
      !answers.backend && /apiSessionUtils|zaius-permissions\b|apply-permissions\.md|useQuery|useMutation|queryClient|QueryClient|@tanstack/.test(content) ? `${path}: habla de la sesión o de las consultas a la API sin API` : null,
    ].filter((leak) => leak !== null)
  }
  return [
    /\bsrc\/(features|domains|router)\/|`(features|domains|router)\/`|useQuery|useMutation|zustand|react-hook-form|react-router|VITE_|tsc -b|\b5173\b|main\.tsx|docs\/specs\b|docs\/features\b|zaius-spec\b/.test(content) ? `${path}: habla de una app en una web` : null,
    !answers.server && /defineAction|astro:actions|server:defer|src\/middleware\.ts|callAction|zaius-form\b|create-a-form\.md/.test(content) ? `${path}: habla del servidor sin servidor` : null,
    !answers.content && /getCollection|content\.config|add-content\.md/.test(content) ? `${path}: habla del contenido sin contenido` : null,
    !answers.privateArea && /apiSessionUtils|zaius-permissions\b|apply-permissions\.md/.test(content) ? `${path}: habla de la zona privada sin zona privada` : null,
    answers.platform !== 'cloudflare' && /wrangler/.test(content) ? `${path}: habla de wrangler sin Cloudflare` : null,
  ].filter((leak) => leak !== null)
}

/**
 * Comprueba lo que no debe aparecer en un proyecto según sus respuestas.
 * @param answers Las respuestas del proyecto, ya normalizadas.
 * @param path La ruta del fichero.
 * @param content Su contenido.
 * @returns Los problemas encontrados.
 */
function findAnswerLeaks (answers, path, content) {
  const conditions = buildConditions(answers)
  const leaks = []
  if (!conditions.mocks && /apiMockUtils|Mocks\.json/.test(content)) leaks.push(`${path}: habla de los mocks sin mocks`)
  if (!conditions.api && /docs\/api\/|api-requests/.test(content)) leaks.push(`${path}: habla de docs/api sin documentar la API`)
  if (!conditions.backend && /apiUtils|apiErrorUtils|\bAPI_URL\b|zaius-service\b|add-a-service|load-and-save-data|\bservices?\b/.test(content)) leaks.push(`${path}: habla de la API sin API`)
  if (!conditions.git && path.endsWith('.md') && /\bgit (mv|diff|status|push|commit)\b|zaius-git|\bcommits?\b|\bpush\b|pull request|AGENTS\.md#git\b/i.test(content)) leaks.push(`${path}: habla de git sin git`)
  leaks.push(...findTypeLeaks(answers, path, content))
  const packageManager = answers.packageManager ?? 'npm'
  const dlx = packageManager === 'yarn' ? '|vercel|wrangler|--package=netlify-cli' : ''
  if (packageManager !== 'npm' && (new RegExp(`\\bnpx (?![^\\s\`]*zaius-dev${dlx})`).test(content) || /\bnpm (install|run|test|ci)\b/.test(content))) leaks.push(`${path}: habla de npm con ${packageManager}`)
  return leaks
}

/**
 * Pasa los tests del código que trae el kit (`templateTests/`) sobre un proyecto instalado, que no los lleva: los copia con las mismas reglas que la plantilla, lanza los tests y los quita.
 * @param dir La carpeta del proyecto, con sus dependencias instaladas.
 * @param packageManager El gestor de paquetes del proyecto.
 * @returns Los problemas encontrados.
 */
async function runTemplateTests (dir, packageManager) {
  const { answers } = await readManifest(dir)
  const rules = JSON.parse(await readFile(join(kitDir, 'templateFiles.json'), 'utf8'))
  const files = await renderTemplate({ kitDir: join(kitDir, TEMPLATE_TESTS_DIR), rules, conditions: buildConditions(answers), values: {}, languages: answers.languages })
  for (const [path, { content }] of files) {
    await mkdir(dirname(join(dir, path)), { recursive: true })
    await writeFile(join(dir, path), content)
  }
  const run = await runCommand(packageManager, ['run', 'test'], dir)
  for (const path of files.keys()) await rm(join(dir, path))
  return run.ok ? [] : [`los tests del código del kit fallan:\n${run.output.split('\n').slice(-40).join('\n')}`]
}

/**
 * Empaqueta el kit como lo baja quien lo lanza desde git: `npm pack`, con el `files` de su `package.json`.
 * @param baseDir La carpeta temporal donde se deja el paquete.
 * @returns La ruta del paquete.
 * @throws {Error} si no se puede empaquetar, con la salida de npm.
 */
async function packKit (baseDir) {
  const { name, version } = JSON.parse(await readFile(join(kitDir, 'package.json'), 'utf8'))
  const pack = await runCommand('npm', ['pack', '--pack-destination', `"${baseDir}"`], kitDir)
  if (!pack.ok) throw new Error(`npm pack falla:\n${pack.output}`)
  return join(baseDir, `${name}-${version}.tgz`)
}

/**
 * Lanza el kit empaquetado con una orden y unas respuestas.
 * @param command La orden (`init`, `change`).
 * @param dir La carpeta en la que se lanza.
 * @param answers Las respuestas, que se escriben en un JSON de `answers/`.
 * @param context `baseDir`, `kitArgs` y `name`, el nombre del fichero de respuestas.
 * @returns El resultado de `runCommand`.
 */
async function runKit (command, dir, answers, { baseDir, kitArgs, name }) {
  const configPath = join(baseDir, 'answers', `${name}.json`)
  await writeFile(configPath, JSON.stringify(answers))
  const skipInstall = docsOnly ? ['--skip-install'] : []
  return runCommand('npx', [...kitArgs, command, '--cwd', `"${dir}"`, '--config', `"${configPath}"`, '--yes', ...skipInstall], baseDir)
}

/**
 * Instala una combinación de respuestas y la comprueba entera; con `--docs`, sin dependencias, solo sus ficheros.
 * @param combination Su nombre, sus respuestas, `then` (las respuestas de un `change` posterior) y, en un proyecto existente, los ficheros que ya tiene. Uno nuevo queda en una carpeta con su nombre.
 * @param baseDir La carpeta temporal donde se instala; las respuestas van en su carpeta `answers/`, para que ningún gestor las tome por el manifiesto de un proyecto.
 * @param kitArgs Los argumentos de `npx` que lanzan el kit empaquetado.
 * @returns Los problemas encontrados.
 */
async function verifyCombination ({ id, answers, then = null, existingFiles = {} }, baseDir, kitArgs) {
  const launchDir = join(baseDir, id)
  await mkdir(launchDir)
  for (const [path, content] of Object.entries(existingFiles)) await writeFile(join(launchDir, path), content)
  const problems = []
  const install = await runKit('init', launchDir, answers, { baseDir, kitArgs, name: id })
  if (!install.ok) problems.push(`la instalación o sus comprobaciones fallan:\n${install.output.split('\n').slice(-40).join('\n')}`)
  const dir = answers.existing ? launchDir : join(launchDir, slugifyName(answers.name))
  if (!answers.existing && (await readdir(launchDir)).join() !== slugifyName(answers.name)) problems.push('un proyecto nuevo no ha quedado solo en su carpeta, con su nombre')
  if (answers.existing) {
    const installed = await listProjectFiles(dir)
    if (installed.some((file) => file.startsWith('src/'))) problems.push('un proyecto existente ha recibido código antes de terminar de traerlo')
    if (!installed.includes('README.md.kit-new')) problems.push('el README del proyecto no ha recibido su .kit-new')
    if (!installed.includes('.claude/skills/zaius-adopt/SKILL.md')) problems.push('falta la skill zaius-adopt')
  }
  const change = answers.existing ? { existing: false } : then
  if (change !== null) {
    const changed = await runKit('change', dir, change, { baseDir, kitArgs, name: `${id}-change` })
    if (!changed.ok) problems.push(`el change posterior falla:\n${changed.output.split('\n').slice(-40).join('\n')}`)
  }
  const manifest = await readManifest(dir)
  if (manifest === null) return [...problems, 'no hay zaius-dev.json']
  const files = await listProjectFiles(dir)
  if (files.some((file) => file.endsWith('.kit-new') && !Object.hasOwn(existingFiles, file.slice(0, -'.kit-new'.length)))) problems.push(`hay .kit-new de ficheros que el proyecto no tenía: ${files.filter((file) => file.endsWith('.kit-new')).join(', ')}`)
  const hasRepo = await stat(join(dir, '.git')).then(() => true, () => false)
  if (manifest.answers.git !== hasRepo) problems.push(manifest.answers.git ? 'git: sí, pero no se ha iniciado el repositorio' : 'git: no, pero hay un repositorio')
  const packageManager = manifest.answers.packageManager
  if (!docsOnly) {
    const build = await runCommand(packageManager, ['run', 'build'], dir)
    if (!build.ok) problems.push(`${packageManager} run build falla:\n${build.output.split('\n').slice(-20).join('\n')}`)
  }
  for (const path of files.filter((file) => !file.endsWith('.kit-new') && !Object.hasOwn(existingFiles, file))) {
    const content = await readFile(join(dir, path), 'utf8')
    for (const pattern of FORBIDDEN) if (pattern.test(content)) problems.push(`${path}: contiene ${pattern}`)
    const sign = /\.(md|html|json)$/.test(path) ? AI_SIGNS.exec(content.replace(QUOTED, '')) : null
    if (sign !== null) problems.push(`${path}: lleva «${sign[0]}», uno de los signos de la IA, fuera de una cita`)
    problems.push(...findAnswerLeaks(manifest.answers, path, content))
  }
  problems.push(...await findBrokenLinks(dir, files))
  if (!docsOnly) problems.push(...await runTemplateTests(dir, packageManager))
  return problems
}

const baseDir = await realpath(await mkdtemp(join(tmpdir(), 'zaius-dev-verify-')))
await mkdir(join(baseDir, 'answers'))
const kitArgs = ['--yes', `--package="${await packKit(baseDir)}"`, 'zaius-dev']
let failed = false
for (const combination of COMBINATIONS.filter(({ id }) => only === undefined || only.some((name) => name.endsWith('-') ? id.startsWith(name) : id === name))) {
  const packageManager = combination.answers.packageManager ?? 'npm'
  if (!docsOnly && !(await runCommand(packageManager, ['--version'], baseDir)).ok) {
    console.log(`${combination.id}: no se prueba, ${packageManager} no está instalado en este equipo`)
    continue
  }
  const problems = await verifyCombination(combination, baseDir, kitArgs)
  failed ||= problems.length > 0
  console.log(problems.length === 0 ? `${combination.id}: bien` : `${combination.id}: falla\n${problems.map((problem) => `  - ${problem}`).join('\n')}`)
}
if (keep) console.log(`Proyectos en ${baseDir}`)
else await rm(baseDir, { recursive: true, force: true })
process.exitCode = failed ? 1 : 0
