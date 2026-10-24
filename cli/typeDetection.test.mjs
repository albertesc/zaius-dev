import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { detectType, detectWebAnswers } from './typeDetection.mjs'

const astroPackage = (dependencies) => JSON.stringify({ dependencies: { astro: '^7.4.2', ...dependencies } })

describe('detectType', () => {
  it('es una web con astro en las dependencias o con un astro.config', () => {
    assert.equal(detectType([], astroPackage({})), 'web')
    assert.equal(detectType([], JSON.stringify({ devDependencies: { astro: '^7.4.2' } })), 'web')
    assert.equal(detectType(['astro.config.ts'], '{}'), 'web')
    assert.equal(detectType(['astro.config.mjs'], null), 'web')
  })

  it('es una app con react en las dependencias y sin Astro', () => {
    assert.equal(detectType(['vite.config.ts'], JSON.stringify({ dependencies: { react: '^19.2.8' } })), 'app')
    assert.equal(detectType([], JSON.stringify({ devDependencies: { react: '^19.2.8' } })), 'app')
    assert.equal(detectType([], astroPackage({ react: '^19.2.8' })), 'web')
  })

  it('no dice nada de un proyecto sin Astro ni React, ni de un package.json roto', () => {
    assert.equal(detectType(['vite.config.ts'], JSON.stringify({ dependencies: { vue: '^3.5.44' } })), null)
    assert.equal(detectType(['astro.config.json'], '{}'), null)
    assert.equal(detectType([], '{ roto'), null)
    assert.equal(detectType([], null), null)
  })
})

describe('detectWebAnswers', () => {
  it('sin adaptador ni contenido, no tiene servidor ni blog y no fija nada', () => {
    assert.deepEqual(detectWebAnswers({ packageJson: astroPackage({}), configText: null, srcNames: [] }), {
      answers: { server: false, content: false },
      known: {},
    })
  })

  it('tiene servidor con un adaptador', () => {
    for (const adapter of ['@astrojs/node', '@astrojs/vercel', '@astrojs/netlify', '@astrojs/cloudflare']) {
      const detected = detectWebAnswers({ packageJson: astroPackage({ [adapter]: '^1.0.0' }), configText: 'export default {}', srcNames: [] })

      assert.deepEqual(detected.answers, { server: true, content: false })
      assert.deepEqual(detected.known, { server: true })
    }
  })

  it('tiene servidor si su configuración lo dice, aunque no tenga adaptador', () => {
    assert.equal(detectWebAnswers({ packageJson: astroPackage({}), configText: "export default { output: 'server' }", srcNames: [] }).answers.server, true)
    assert.equal(detectWebAnswers({ packageJson: astroPackage({}), configText: 'output: "server"', srcNames: [] }).answers.server, true)
    assert.equal(detectWebAnswers({ packageJson: astroPackage({}), configText: "export default { output: 'static' }", srcNames: [] }).answers.server, false)
  })

  it('tiene contenido con MDX o con content.config', () => {
    assert.equal(detectWebAnswers({ packageJson: astroPackage({ '@astrojs/mdx': '^8.1.1' }), configText: null, srcNames: [] }).answers.content, true)
    assert.equal(detectWebAnswers({ packageJson: astroPackage({}), configText: null, srcNames: ['content.config.ts'] }).answers.content, true)
    assert.equal(detectWebAnswers({ packageJson: astroPackage({}), configText: null, srcNames: ['content.ts'] }).answers.content, false)
  })

  it('fija lo que el proyecto ya tiene: el servidor y el contenido', () => {
    const detected = detectWebAnswers({ packageJson: astroPackage({ '@astrojs/netlify': '^8.2.10', '@astrojs/mdx': '^8.1.1' }), configText: null, srcNames: [] })

    assert.deepEqual(detected.known, { server: true, content: true })
  })

  it('no falla con un package.json roto', () => {
    assert.deepEqual(detectWebAnswers({ packageJson: '{ roto', configText: null, srcNames: [] }).answers, { server: false, content: false })
  })
})
