import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { buildMergeSteps, buildNextSteps } from './nextSteps.mjs'

describe('buildNextSteps', () => {
  const app = { existing: false, type: 'app', packageManager: 'npm', mocks: true }
  const web = { existing: false, type: 'web', packageManager: 'npm', mocks: null }

  it('en una app nueva lleva a zaius-init, al backlog y a cada historia con ORD001', () => {
    const text = buildNextSteps(app, 'npx github:albertesc/zaius-dev#v0.1.0').join('\n')

    assert.match(text, /2\. Escribe \/zaius-init y, detrás, de qué va la app, con\n/)
    assert.match(text, /la plantilla está en el README, «Contar de qué va»/)
    assert.match(text, /3\. \/zaius-backlog: las épicas y las historias de usuario\./)
    assert.match(text, /4\. Para cada historia, tres pasos/)
    assert.match(text, /\/zaius-spec ORD001 {4}sus criterios, su boceto y sus tests\n/)
    assert.match(text, /\/zaius-build ORD001 {3}la construye contigo/)
    assert.match(text, /\/zaius-review ORD001 {2}la revisa/)
    assert.match(text, /npm run dev {4}arranca la app con los datos de prueba \(mocks\)/)
    assert.doesNotMatch(text, /zaius-page|HOME/)
  })

  it('en una web nueva lleva a las páginas y a cada página con HOME', () => {
    const text = buildNextSteps(web, 'zaius-dev').join('\n')

    assert.match(text, /de qué va la web/)
    assert.match(text, /3\. \/zaius-backlog: las páginas y el mapa del sitio\./)
    assert.match(text, /4\. Para cada página, tres pasos/)
    assert.match(text, /\/zaius-page HOME {4}su documento, su boceto y sus tests\n/)
    assert.match(text, /\/zaius-build HOME {3}la construye contigo/)
    assert.match(text, /\/zaius-review HOME {2}la revisa/)
    assert.match(text, /npm run dev {4}arranca la web\n/)
    assert.doesNotMatch(text, /zaius-spec|ORD001|mocks/)
  })

  it('da las órdenes del gestor de paquetes del proyecto, en columna', () => {
    const text = buildNextSteps({ ...app, packageManager: 'pnpm' }, 'zaius-dev').join('\n')

    assert.match(text, /pnpm run dev {4}arranca la app/)
    assert.match(text, /pnpm run test {3}los tests/)
  })


  it('da la orden del kit con la versión del proyecto', () => {
    const text = buildNextSteps(app, 'npx github:albertesc/zaius-dev#v0.1.0').join('\n')

    assert.match(text, /El kit, con la versión de este proyecto/)
    assert.match(text, /npx github:albertesc\/zaius-dev#v0\.1\.0 status/)
  })

  it('en una carpeta nueva, empieza por entrar en ella', () => {
    const lines = buildNextSteps(app, 'zaius-dev', 'gestion-de-pedidos')

    assert.equal(lines[2], 'Primero, entra en la carpeta del proyecto: cd gestion-de-pedidos')
    assert.doesNotMatch(buildNextSteps(app, 'zaius-dev').join('\n'), /cd /)
  })

  it('sin mocks no los anuncia', () => {
    assert.doesNotMatch(buildNextSteps({ ...app, mocks: false }, 'zaius-dev').join('\n'), /mocks/)
  })

  it('en un proyecto existente habla de la migración y de los .kit-new', () => {
    const text = buildNextSteps({ ...app, existing: true }, 'npx github:albertesc/zaius-dev#v0.1.0').join('\n')

    assert.match(text, /\/zaius-init y, detrás, de qué va la app/)
    assert.match(text, /propondrá cómo traerlo, por bloques/)
    assert.match(text, /\.kit-new/)
    assert.match(text, /llegan con «change»/)
    assert.match(text, /npx github:albertesc\/zaius-dev#v0\.1\.0 status/)
    assert.doesNotMatch(text, /npm run dev|zaius-backlog/)
    assert.match(buildNextSteps({ ...web, existing: true }, 'zaius-dev').join('\n'), /de qué va la web/)
  })
})

describe('buildMergeSteps', () => {
  it('no dice nada sin versiones nuevas', () => {
    assert.deepEqual(buildMergeSteps([]), [])
  })

  it('lista los .kit-new y lleva a zaius-merge', () => {
    const text = buildMergeSteps(['AGENTS.md']).join('\n')

    assert.match(text, /AGENTS\.md\.kit-new/)
    assert.match(text, /zaius-merge/)
  })
})
