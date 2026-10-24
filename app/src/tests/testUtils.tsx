import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router'
import type { InitialEntry, RouteObject } from 'react-router'
import { queryClientConfig } from '@/queryClient.config'

type MediaQueryEntry = {
  query: string
  matches: boolean
  listener: (event: MediaQueryListEvent) => void
}

const entries = new Set<MediaQueryEntry>()

/**
 * Crea los proveedores de la app para un test: un `QueryClient` nuevo, que no hereda la caché de otro test, y un router en memoria para los enlaces.
 * @returns El `wrapper` para `render` o `renderHook`, y su `queryClient`.
 */
function createProvidersWrapper () {
  const queryClient = new QueryClient(queryClientConfig)
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  )
  return { wrapper, queryClient }
}

/**
 * Monta un componente con los proveedores de la app.
 * @param ui El componente, con las props del caso.
 * @returns Lo que devuelve `render` de Testing Library, y el `queryClient` del test.
 */
function renderWithProviders (ui: ReactElement) {
  const { wrapper, queryClient } = createProvidersWrapper()
  return { ...render(ui, { wrapper }), queryClient }
}

/**
 * Monta una página con las rutas de su feature, en un router en memoria y con los proveedores de la app.
 * @param routes Las rutas de la feature (`ordersRoutes`); lo que queda fuera de ellas no pinta nada.
 * @param entry La URL con la que se abre (`/orders`), o un objeto con su `pathname` y su `state` de navegación.
 * @returns Lo que devuelve `render`, el `router` del test, para ver adónde ha llevado, y su `queryClient`.
 */
function renderPage (routes: RouteObject[], entry: InitialEntry) {
  const queryClient = new QueryClient(queryClientConfig)
  const router = createMemoryRouter([...routes, { path: '*', element: null }], { initialEntries: [entry] })
  const view = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return { ...view, router, queryClient }
}

/**
 * Dice si una media query de anchos (`min-width`, `max-width`) se cumple con el ancho actual de la ventana.
 * @param query La media query.
 * @returns `true` si la cumple.
 */
function matchesWidth (query: string): boolean {
  const min = /min-width:\s*(\d+)px/.exec(query)
  const max = /max-width:\s*(\d+)px/.exec(query)
  return (min === null || window.innerWidth >= Number(min[1])) && (max === null || window.innerWidth <= Number(max[1]))
}

/**
 * Pone en jsdom un `matchMedia` que responde a las media queries de anchos con el ancho de la ventana, y avisa al cambiarlo con `setViewportWidth`.
 */
function installMatchMedia (): void {
  window.matchMedia = (query: string) => ({
    media: query,
    matches: matchesWidth(query),
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      entries.add({ query, matches: matchesWidth(query), listener })
    },
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      entries.forEach((entry) => {
        if (entry.listener === listener && entry.query === query) entries.delete(entry)
      })
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => true,
  }) as unknown as MediaQueryList
}

/**
 * Cambia el ancho de la ventana del test y avisa a las media queries que pasan a cumplirse o dejan de hacerlo.
 * @param width El ancho nuevo, en píxeles.
 */
function setViewportWidth (width: number): void {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true })
  entries.forEach((entry) => {
    const matches = matchesWidth(entry.query)
    if (matches === entry.matches) return
    entry.matches = matches
    entry.listener({ matches, media: entry.query } as MediaQueryListEvent)
  })
}

export const testUtils = {
  createProvidersWrapper,
  renderWithProviders,
  renderPage,
  installMatchMedia,
  setViewportWidth,
}
