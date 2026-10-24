import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, describe, it } from 'node:test'
import {
  globToRegExp,
  isConditionMet,
  isTemplatePathIncluded,
  listTemplateFiles,
  renderTemplate,
  renderTemplateText,
  replaceTemplateValues,
  resolveOverlays,
  resolveTemplateRoots,
  toProjectPath,
} from './templateRender.mjs'

const conditions = { existing: false, i18n: true, mocks: false, api: true }

describe('isConditionMet', () => {
  it('lee una condición y su negación', () => {
    assert.equal(isConditionMet('i18n', conditions), true)
    assert.equal(isConditionMet('!i18n', conditions), false)
    assert.equal(isConditionMet('!mocks', conditions), true)
  })

  it('falla con una condición que no existe', () => {
    assert.throws(() => isConditionMet('docs', conditions), /Condición desconocida: docs/)
  })
})

describe('replaceTemplateValues', () => {
  it('pone los valores y deja la interpolación de i18next', () => {
    assert.equal(replaceTemplateValues('%%APP_NAME%%: {{count}} pedidos', { APP_NAME: 'Pedidos' }), 'Pedidos: {{count}} pedidos')
  })

  it('falla con un placeholder sin valor', () => {
    assert.throws(() => replaceTemplateValues('%%APP_SLUG%%', {}), /Placeholder desconocido: %%APP_SLUG%%/)
  })
})

describe('renderTemplateText', () => {
  it('deja los bloques que se cumplen y quita las líneas marcadoras', () => {
    const text = ['a', '<!-- kit:if i18n -->', 'con i18n', '<!-- kit:else -->', 'sin i18n', '<!-- kit:end -->', 'b'].join('\n')

    assert.equal(renderTemplateText(text, conditions, {}), 'a\ncon i18n\nb')
  })

  it('acepta los comentarios de código y de .env, con sangría, y la negación', () => {
    const text = ['  // kit:if !mocks', '  const data = await fetchServer()', '  // kit:end', '# kit:if mocks', 'VITE_USE_MOCKS=true', '# kit:end'].join('\n')

    assert.equal(renderTemplateText(text, conditions, {}), '  const data = await fetchServer()')
  })

  it('resuelve los bloques anidados', () => {
    const text = ['<!-- kit:if api -->', 'api', '<!-- kit:if mocks -->', 'api y mocks', '<!-- kit:else -->', 'api sin mocks', '<!-- kit:end -->', '<!-- kit:end -->'].join('\n')

    assert.equal(renderTemplateText(text, conditions, {}), 'api\napi sin mocks')
  })

  it('no pinta nada dentro de un bloque que no se cumple, tampoco su else anidado', () => {
    const text = ['<!-- kit:if mocks -->', '<!-- kit:if i18n -->', 'x', '<!-- kit:else -->', 'y', '<!-- kit:end -->', '<!-- kit:end -->', 'fin'].join('\n')

    assert.equal(renderTemplateText(text, conditions, {}), 'fin')
  })

  it('conserva los finales de línea CRLF', () => {
    assert.equal(renderTemplateText('a\r\n// kit:if i18n\r\nb\r\n// kit:end\r\nc', conditions, {}), 'a\r\nb\r\nc')
  })

  it('falla con un bloque mal cerrado y dice su línea', () => {
    assert.throws(() => renderTemplateText('a\n<!-- kit:if i18n -->\nb', conditions, {}), /sin cerrar desde la línea 2/)
    assert.throws(() => renderTemplateText('<!-- kit:end -->', conditions, {}), /kit:end sin kit:if en la línea 1/)
  })
})

describe('globToRegExp', () => {
  it('distingue ** de *', () => {
    assert.equal(globToRegExp('src/utils/apiMock*').test('src/utils/apiMockUtils.ts'), true)
    assert.equal(globToRegExp('docs/*.md').test('docs/guides/create-a-feature.md'), false)
    assert.equal(globToRegExp('docs/*.md').test('docs/api-requests.md'), true)
  })
})

describe('isTemplatePathIncluded', () => {
  const rules = { 'src/**': '!existing', 'src/utils/apiMock*': 'mocks', 'src/tests/languageParity.test.ts': ['i18n', '!existing'] }

  it('pide todas las condiciones de los patrones que le tocan', () => {
    assert.equal(isTemplatePathIncluded('src/utils/apiUtils.ts', rules, conditions), true)
    assert.equal(isTemplatePathIncluded('src/utils/apiMockUtils.ts', rules, conditions), false)
    assert.equal(isTemplatePathIncluded('src/tests/languageParity.test.ts', rules, conditions), true)
    assert.equal(isTemplatePathIncluded('src/utils/apiUtils.ts', rules, { ...conditions, existing: true }), false)
  })

  it('incluye lo que no tiene reglas', () => {
    assert.equal(isTemplatePathIncluded('AGENTS.md', rules, conditions), true)
  })
})

describe('toProjectPath', () => {
  it('cambia el prefijo dot- por el punto en cada segmento', () => {
    assert.equal(toProjectPath('dot-claude/skills/zaius-create-feature/SKILL.md'), '.claude/skills/zaius-create-feature/SKILL.md')
    assert.equal(toProjectPath('dot-env.test'), '.env.test')
    assert.equal(toProjectPath('docs/dot-notes/x.md'), 'docs/.notes/x.md')
  })
})

describe('renderTemplate', () => {
  const kitDirs = []

  /**
   * Crea un kit vacío en una carpeta temporal, que se borra al terminar.
   * @returns La carpeta.
   */
  async function createKitDir () {
    const dir = await mkdtemp(join(tmpdir(), 'kit-template-'))
    kitDirs.push(dir)
    return dir
  }

  /**
   * Escribe un fichero en el kit, con sus carpetas.
   * @param kitDir La carpeta del kit.
   * @param path La ruta del fichero, dentro del kit.
   * @param content Su contenido.
   */
  async function writeKitFile (kitDir, path, content) {
    await mkdir(join(kitDir, path, '..'), { recursive: true })
    await writeFile(join(kitDir, path), content)
  }

  const rules = { base: 'shared', overlays: { web: 'web', app: 'app' } }

  after(async () => {
    await Promise.all(kitDirs.map((dir) => rm(dir, { recursive: true, force: true })))
  })

  it('genera los ficheros del proyecto, con sus semillas y uno por idioma', async () => {
    const kitDir = await createKitDir()
    await writeKitFile(kitDir, 'shared/AGENTS.md', '# %%APP_NAME%%\n<!-- kit:if mocks -->\nmocks\n<!-- kit:end -->\n')
    await writeKitFile(kitDir, 'shared/src/i18n/%%LANGUAGE%%.json', '{ "language": "%%LANGUAGE%%" }\n')
    await writeKitFile(kitDir, 'shared/src/utils/apiMockUtils.ts', 'export {}\n')
    await writeKitFile(kitDir, 'shared/dot-claude/x.md', 'x\n')
    await writeKitFile(kitDir, 'shared/package.fragment.json', '{}')

    const files = await renderTemplate({
      kitDir,
      rules: { base: 'shared', conditions: { 'src/utils/apiMock*': 'mocks' }, seeds: ['src/i18n/**'] },
      conditions,
      values: { APP_NAME: 'Pedidos' },
      languages: ['es', 'en'],
    })

    assert.deepEqual([...files.keys()].sort(), ['.claude/x.md', 'AGENTS.md', 'src/i18n/en.json', 'src/i18n/es.json'])
    assert.deepEqual(files.get('AGENTS.md'), { content: '# Pedidos\n', seed: false })
    assert.deepEqual(files.get('src/i18n/en.json'), { content: '{ "language": "en" }\n', seed: true })
  })

  it('suma a la base la capa de su tipo, sin su carpeta y con sus reglas, y no la otra', async () => {
    const kitDir = await createKitDir()
    await writeKitFile(kitDir, 'shared/AGENTS.md', '# %%APP_NAME%%\n')
    await writeKitFile(kitDir, 'web/src/layouts/BaseLayout.astro', '<slot />\n')
    await writeKitFile(kitDir, 'web/dot-vscode/settings.json', '{}\n')
    await writeKitFile(kitDir, 'web/package.fragment.json', '{}')
    await writeKitFile(kitDir, 'app/src/main.tsx', 'export {}\n')
    const webRules = { ...rules, conditions: { 'src/**': '!existing' }, seeds: ['src/layouts/**'] }

    const web = await renderTemplate({ kitDir, rules: webRules, conditions: { ...conditions, web: true, app: false }, values: { APP_NAME: 'Pedidos' }, languages: ['es'] })
    const existing = await renderTemplate({ kitDir, rules: webRules, conditions: { ...conditions, existing: true, web: true, app: false }, values: { APP_NAME: 'Pedidos' }, languages: ['es'] })
    const app = await renderTemplate({ kitDir, rules, conditions: { ...conditions, web: false, app: true }, values: { APP_NAME: 'Pedidos' }, languages: ['es'] })

    assert.deepEqual([...web.keys()].sort(), ['.vscode/settings.json', 'AGENTS.md', 'src/layouts/BaseLayout.astro'])
    assert.equal(web.get('src/layouts/BaseLayout.astro').seed, true)
    assert.deepEqual([...existing.keys()].sort(), ['.vscode/settings.json', 'AGENTS.md'])
    assert.deepEqual([...app.keys()].sort(), ['AGENTS.md', 'src/main.tsx'])
  })

  it('no deja que dos ficheros de la plantilla den el mismo del proyecto', async () => {
    const kitDir = await createKitDir()
    await writeKitFile(kitDir, 'shared/AGENTS.md', 'base\n')
    await writeKitFile(kitDir, 'web/AGENTS.md', 'web\n')

    await assert.rejects(
      renderTemplate({ kitDir, rules, conditions: { ...conditions, web: true, app: false }, values: {}, languages: ['es'] }),
      /Dos ficheros de la plantilla dan AGENTS\.md: shared\/AGENTS\.md y web\/AGENTS\.md/,
    )
  })

  it('tampoco que lo den dos ficheros de la misma carpeta, con dot- y con el punto', async () => {
    const kitDir = await createKitDir()
    await writeKitFile(kitDir, 'shared/dot-env', 'a\n')
    await writeKitFile(kitDir, 'shared/.env', 'b\n')

    await assert.rejects(
      renderTemplate({ kitDir, rules: { base: 'shared' }, conditions, values: {}, languages: ['es'] }),
      /Dos ficheros de la plantilla dan \.env: shared\/\.env y shared\/dot-env/,
    )
  })
})

describe('listTemplateFiles', () => {
  let kitDir

  after(async () => {
    await rm(kitDir, { recursive: true, force: true })
  })

  it('da los ficheros de cada carpeta, por carpeta y en orden, sin el fragmento de package.json de cada una', async () => {
    kitDir = await mkdtemp(join(tmpdir(), 'kit-list-'))
    for (const path of ['shared/README.md', 'shared/AGENTS.md', 'shared/package.fragment.json', 'shared/docs/package.fragment.json', 'web/src/pages/index.astro', 'web/package.fragment.json', 'app/src/main.tsx']) {
      await mkdir(join(kitDir, path, '..'), { recursive: true })
      await writeFile(join(kitDir, path), '')
    }

    assert.deepEqual(await listTemplateFiles(kitDir, ['shared', 'web']), [
      { source: 'shared/AGENTS.md', path: 'AGENTS.md' },
      { source: 'shared/README.md', path: 'README.md' },
      { source: 'shared/docs/package.fragment.json', path: 'docs/package.fragment.json' },
      { source: 'web/src/pages/index.astro', path: 'src/pages/index.astro' },
    ])
  })

  it('no falla si una carpeta de la plantilla no existe', async () => {
    assert.deepEqual(await listTemplateFiles(kitDir, ['shared', 'nada']), (await listTemplateFiles(kitDir, ['shared'])))
    assert.deepEqual(await listTemplateFiles(kitDir, ['nada']), [])
  })
})

describe('resolveOverlays', () => {
  it('da cada capa con si se instala, y avisa de una condición que no existe', () => {
    assert.deepEqual(resolveOverlays({ overlays: { web: 'web', app: ['app', '!existing'] } }, { web: false, app: true, existing: false }), { web: false, app: true })
    assert.deepEqual(resolveOverlays({}, {}), {})
    assert.throws(() => resolveOverlays({ overlays: { vue: 'vue' } }, {}), /Condición desconocida: vue/)
  })
})

describe('resolveTemplateRoots', () => {
  const rules = { base: 'shared', overlays: { web: 'web', app: 'app' } }

  it('da la base y, detrás, las capas que tocan', () => {
    assert.deepEqual(resolveTemplateRoots(rules, { web: true, app: false }), ['shared', 'web'])
    assert.deepEqual(resolveTemplateRoots(rules, { web: false, app: true }), ['shared', 'app'])
    assert.deepEqual(resolveTemplateRoots({ base: 'shared' }, {}), ['shared'])
  })

  it('falla con una capa de una condición que no existe', () => {
    assert.throws(() => resolveTemplateRoots(rules, { web: true }), /Condición desconocida: app/)
  })
})
