import { within } from '@testing-library/dom'
// kit:if server
import type { ActionAPIContext } from 'astro:actions'
// kit:end
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import type { ContainerRenderOptions } from 'astro/container'
import { JSDOM } from 'jsdom'

type AstroComponent = Parameters<AstroContainer['renderToString']>[0]
// kit:if server

type ActionCall<TInput, TResult> = (this: ActionAPIContext, input: TInput) => Promise<TResult>
// kit:end

/**
 * Pinta un componente o una página de Astro en el servidor y lo abre en un documento de jsdom, para consultarlo con Testing Library.
 * @param component El componente o la página (`.astro`).
 * @param options `props`, `slots`, `params`, `locals` y `request` (para la URL), como en la Container API.
 * @returns Las consultas de Testing Library sobre el `body` pintado (`getByRole`…).
 */
async function renderAstro (component: AstroComponent, options: ContainerRenderOptions = {}) {
  const container = await AstroContainer.create()
  const html = await container.renderToString(component, options)
  return within(new JSDOM(html).window.document.body)
}
// kit:if server

/**
 * Llama a una action como lo hace Astro en una petición, con sus `locals`.
 * @param action La action (`ordersActions.updateOrder`).
 * @param input Lo que recibe: un `FormData` si acepta formularios.
// kit:if privateArea
 * @param locals Los `locals` de la petición: la sesión, como la deja el middleware.
// kit:else
 * @param locals Los `locals` de la petición.
// kit:end
 * @returns Su resultado: `{ data }` o `{ error }`, con los errores de cada campo si el input no es válido.
 */
function callAction<TInput, TResult> (action: ActionCall<TInput, TResult>, input: TInput, locals: Partial<App.Locals> = {}): Promise<TResult> {
  const context = { [Symbol.for('astro.actionAPIContext')]: true, locals, params: {} }
  return action.call(context as unknown as ActionAPIContext, input)
}
// kit:end

export const testUtils = {
  renderAstro,
  // kit:if server
  callAction,
  // kit:end
}
