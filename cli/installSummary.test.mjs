import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { buildChangeWarnings, buildInstallQuestion, buildInstallWarnings, findFixedAnswerChange, isInstallEmpty } from './installSummary.mjs'

/**
 * Arma un resultado de `installProject` para un caso.
 * @param groups Las rutas de cada acción que tiene el caso.
 * @param packageChange El cambio de `package.json`, o `null`.
 * @returns El resultado, con las acciones que faltan vacías.
 */
function buildResult (groups, packageChange = null) {
  return { groups: { create: [], same: [], keep: [], replace: [], kitNew: [], remove: [], orphan: [], ...groups }, packageChange }
}

describe('buildInstallQuestion', () => {
  it('cuenta los ficheros, las dependencias y las skills', () => {
    const result = buildResult({ create: ['AGENTS.md', '.claude/skills/zaius-create-feature/SKILL.md', '.claude/skills/zaius-create-feature/x.md'] }, {
      changed: true,
      added: { scripts: ['dev'], dependencies: ['react', 'zod'], devDependencies: ['vitest'] },
      conflicts: [],
    })

    assert.equal(buildInstallQuestion(result), 'Voy a crear 3 ficheros, poner 3 dependencias en package.json y añadir 1 skills. ¿Sigo?')
  })

  it('cuenta las versiones nuevas al lado y lo que se quita', () => {
    assert.equal(buildInstallQuestion(buildResult({ create: ['a'], kitNew: ['b', 'c'], remove: ['d'] })), 'Voy a crear 1 ficheros, dejar 2 versiones nuevas al lado (.kit-new) y quitar 1. ¿Sigo?')
  })

  it('dice que inicia el repositorio git, si lo va a iniciar', () => {
    assert.equal(buildInstallQuestion(buildResult({ create: ['a'] }), { initGit: true }), 'Voy a crear 1 ficheros e iniciar el repositorio git. ¿Sigo?')
  })

  it('si solo cambian las respuestas, dice que las apunta', () => {
    assert.equal(buildInstallQuestion({ ...buildResult({ same: ['a'] }), answersChanged: true }), 'No cambia ningún fichero: voy a apuntar las respuestas nuevas en zaius-dev.json. ¿Sigo?')
  })
})

describe('isInstallEmpty', () => {
  it('reconoce una instalación que no cambia nada', () => {
    assert.equal(isInstallEmpty(buildResult({ same: ['a'], keep: ['b'] })), true)
    assert.equal(isInstallEmpty(buildResult({ replace: ['a'] })), false)
    assert.equal(isInstallEmpty(buildResult({}, { changed: true })), false)
    assert.equal(isInstallEmpty({ ...buildResult({ same: ['a'] }), answersChanged: true }), false)
  })
})

describe('buildInstallWarnings', () => {
  it('avisa de lo que el kit ya no da y de los conflictos de package.json', () => {
    const warnings = buildInstallWarnings(buildResult({ orphan: ['src/old.ts'] }, {
      changed: false,
      added: {},
      conflicts: [{ field: 'dependencies', name: 'react', project: '^18.0.0', kit: '^19.2.8' }],
    }))

    assert.equal(warnings.length, 2)
    assert.match(warnings[0], /src\/old\.ts/)
    assert.match(warnings[1], /dependencies\.react: se queda «\^18\.0\.0»/)
  })
})

describe('findFixedAnswerChange', () => {
  const web = { type: 'web', server: true, content: false, privateArea: true, backend: true, mocks: null }
  const app = { type: 'app', server: null, content: null, privateArea: null, backend: true, mocks: true }

  it('no deja cambiar el tipo', () => {
    assert.match(findFixedAnswerChange(web, app), /el código del kit de una web: el tipo no se cambia/)
    assert.match(findFixedAnswerChange(app, web), /el código del kit de una app: el tipo no se cambia/)
  })

  it('deja cambiar lo demás', () => {
    assert.equal(findFixedAnswerChange(web, { ...web, server: false, content: true, privateArea: false }), null)
    assert.equal(findFixedAnswerChange(app, { ...app, backend: false, mocks: false }), null)
  })
})

describe('buildChangeWarnings', () => {
  const web = { type: 'web', server: true, content: false, privateArea: true, backend: true, mocks: null }
  const app = { type: 'app', server: null, content: null, privateArea: null, backend: true, mocks: true }

  it('avisa al quitar la zona privada de una web', () => {
    const warnings = buildChangeWarnings(web, { ...web, privateArea: false })

    assert.equal(warnings.length, 1)
    assert.match(warnings[0], /Sin zona privada se quitan la sesión y los permisos/)
  })

  it('avisa al quitar el servidor de una web', () => {
    const warnings = buildChangeWarnings({ ...web, privateArea: false }, { ...web, server: false, privateArea: false })

    assert.equal(warnings.length, 1)
    assert.match(warnings[0], /Sin servidor, los formularios/)
  })

  it('avisa de las dos cosas al quitar la zona privada y el servidor', () => {
    assert.equal(buildChangeWarnings(web, { ...web, server: false, privateArea: false }).length, 2)
  })

  it('no avisa sin cambios que rompan, al añadir, ni en una app', () => {
    assert.deepEqual(buildChangeWarnings(web, { ...web, content: true }), [])
    assert.deepEqual(buildChangeWarnings({ ...web, server: false, privateArea: false }, web), [])
    assert.deepEqual(buildChangeWarnings(app, { ...app, mocks: false }), [])
    assert.match(buildChangeWarnings(app, { ...app, backend: false, mocks: false }).join(), /Sin API, se quitan el transporte, los services, la sesión y los permisos/)
  })
})
