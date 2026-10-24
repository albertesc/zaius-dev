import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'
import { testUtils } from '@/tests/testUtils'
import BaseLayout from './BaseLayout.astro'

/**
 * Pinta el layout y da la cabecera del documento, donde van los datos para compartir.
 * @param props Las props del layout.
 * @returns El `head` del documento pintado.
 */
async function renderHead (props: Record<string, string | boolean>): Promise<HTMLHeadElement> {
  const container = await AstroContainer.create()
  return new JSDOM(await container.renderToString(BaseLayout, { props })).window.document.head
}

describe('BaseLayout', () => {
  it('pinta lo que lleva dentro', async () => {
    const view = await testUtils.renderAstro(BaseLayout, { props: { title: 'Habitaciones' }, slots: { default: '<h1>Habitaciones</h1>' } })

    expect(view.getByRole('heading', { name: 'Habitaciones' })).toBeInTheDocument()
  })

  it('da a los buscadores y a las redes la descripción y la imagen de la página', async () => {
    const head = await renderHead({ title: 'Envíos', description: 'Tarifas y plazos de envío', image: '/share/shipping.png' })

    expect(head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Tarifas y plazos de envío')
    expect(head.querySelector('meta[property="og:image"]')?.getAttribute('content')).toMatch(/^https?:\/\/.+\/share\/shipping\.png$/)
    expect(head.querySelector('meta[name="twitter:card"]')?.getAttribute('content')).toBe('summary_large_image')
    expect(head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toMatch(/^https?:\/\//)
  })

  it('saca de los buscadores la página que lo pide', async () => {
    const head = await renderHead({ title: 'Mi cuenta', noindex: true })

    expect(head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex')
    expect(head.querySelector('link[rel="canonical"]')).toBeNull()
  })

  it('sin descripción ni imagen, no las inventa', async () => {
    const head = await renderHead({ title: 'Envíos' })

    expect(head.querySelector('meta[name="description"]')).toBeNull()
    expect(head.querySelector('meta[property="og:image"]')).toBeNull()
  })
})
