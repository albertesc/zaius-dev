import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { buildPackageAdditions, createBasePackage, mergePackage } from './packageMerge.mjs'

const fragment = {
  scripts: { dev: 'vite', test: 'vitest run' },
  dependencies: { react: '^19.2.8' },
  devDependencies: { vitest: '^5.0.1' },
  when: {
    i18n: { dependencies: { i18next: '^26.5.2' } },
    '!existing': { scripts: { build: 'tsc -b && vite build' } },
  },
}

describe('buildPackageAdditions', () => {
  it('suma lo de cada condición que se cumple', () => {
    const additions = buildPackageAdditions([fragment], { existing: false, i18n: true })

    assert.deepEqual(additions.dependencies, { react: '^19.2.8', i18next: '^26.5.2' })
    assert.deepEqual(additions.scripts, { dev: 'vite', test: 'vitest run', build: 'tsc -b && vite build' })
  })

  it('no suma lo de las condiciones que no se cumplen', () => {
    const additions = buildPackageAdditions([fragment], { existing: true, i18n: false })

    assert.deepEqual(additions.dependencies, { react: '^19.2.8' })
    assert.equal(additions.scripts.build, undefined)
  })

  it('suma los fragmentos en orden: uno posterior pisa un valor de uno anterior', () => {
    const overlay = { scripts: { dev: 'astro dev' }, dependencies: { astro: '^7.4.2' } }

    const additions = buildPackageAdditions([fragment, overlay], { existing: false, i18n: false })

    assert.deepEqual(additions.scripts, { dev: 'astro dev', test: 'vitest run', build: 'tsc -b && vite build' })
    assert.deepEqual(additions.dependencies, { react: '^19.2.8', astro: '^7.4.2' })
  })

  it('suma un when dentro de otro solo si se cumplen los dos', () => {
    const nested = { when: { web: { dependencies: { astro: '^7.4.2' }, when: { server: { dependencies: { '@astrojs/node': '^10.0.0' } } } } } }

    const withServer = buildPackageAdditions([nested], { web: true, server: true })
    const withoutServer = buildPackageAdditions([nested], { web: true, server: false })
    const app = buildPackageAdditions([nested], { web: false, server: true })

    assert.deepEqual(withServer.dependencies, { astro: '^7.4.2', '@astrojs/node': '^10.0.0' })
    assert.deepEqual(withoutServer.dependencies, { astro: '^7.4.2' })
    assert.deepEqual(app.dependencies, {})
  })
})

describe('createBasePackage', () => {
  it('da un paquete privado en módulos ES', () => {
    assert.deepEqual(createBasePackage('pedidos'), { name: 'pedidos', private: true, version: '0.1.0', type: 'module' })
  })
})

describe('mergePackage', () => {
  const additions = buildPackageAdditions([fragment], { existing: false, i18n: true })

  it('añade lo del kit a un proyecto nuevo y lo ordena', () => {
    const { pkg, added, conflicts } = mergePackage(createBasePackage('pedidos'), additions)

    assert.deepEqual(Object.keys(pkg.dependencies), ['i18next', 'react'])
    assert.deepEqual(added.dependencies, ['i18next', 'react'])
    assert.deepEqual(conflicts, [])
  })

  it('no pisa lo que el proyecto ya tenía con otro valor y lo avisa', () => {
    const current = { name: 'app', scripts: { test: 'jest' }, dependencies: { react: '^18.0.0' } }

    const { pkg, added, conflicts } = mergePackage(current, additions)

    assert.equal(pkg.scripts.test, 'jest')
    assert.equal(pkg.dependencies.react, '^18.0.0')
    assert.equal(added.dependencies.includes('react'), false)
    assert.deepEqual(conflicts.map(({ field, name }) => `${field}.${name}`), ['scripts.test', 'dependencies.react'])
  })

  it('actualiza lo que añadió el kit y quita lo que ya no toca', () => {
    const current = { dependencies: { react: '^19.0.0', i18next: '^25.0.0', zod: '^4.0.0' } }
    const withoutI18n = buildPackageAdditions([fragment], { existing: false, i18n: false })

    const { pkg } = mergePackage(current, withoutI18n, { dependencies: ['react', 'i18next'] })

    assert.deepEqual(pkg.dependencies, { react: '^19.2.8', zod: '^4.0.0' })
  })
})
