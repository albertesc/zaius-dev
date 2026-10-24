import type { ApiMethod, UploadOptions } from '@/types/api'

type MockRoutes = Record<string, unknown>

const MOCK_LATENCY_MS = 300

const files = import.meta.glob<MockRoutes>('/src/services/**/*Mocks.json', { eager: true, import: 'default' })

const MOCK_ROUTES: MockRoutes = Object.fromEntries(Object.values(files).flatMap(Object.entries))

/**
 * Espera como la red; en los tests, nada.
 * @returns Una promesa que se resuelve pasado ese tiempo.
 */
function waitLatency (): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, import.meta.env.MODE === 'test' ? 0 : MOCK_LATENCY_MS))
}

/**
 * Busca la respuesta de una petición: la de su ruta exacta o, si no la hay, la de una ruta con `:param`.
 * @param routes Las respuestas, por `'<MÉTODO> /ruta'`.
 * @param method El verbo HTTP.
 * @param path La ruta de la API, sin su query string.
 * @returns La respuesta, en `response`, o `null` si ninguna ruta encaja.
 */
function findRoute (routes: MockRoutes, method: ApiMethod, path: string): { response: unknown } | null {
  const key = `${method} ${path}`
  if (Object.hasOwn(routes, key)) return { response: routes[key] }
  for (const [candidate, response] of Object.entries(routes)) {
    const [candidateMethod, candidatePath = ''] = candidate.split(' ')
    const pattern = candidatePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/:\w+/g, '[^/]+')
    if (candidateMethod === method && new RegExp(`^${pattern}$`).test(path)) return { response }
  }
  return null
}

/**
 * Responde una petición como la API, con los `*Mocks.json` de `services/`, después de la espera de la red.
 * @param method El verbo HTTP.
 * @param path La ruta de la API, con su query string si la lleva, que no cuenta (`/booking/detail/12`).
 * @param routes Las respuestas por ruta; por defecto, las de todos los `*Mocks.json`.
 * @returns Una copia de la respuesta, sin validar; un `null` del JSON es una respuesta sin cuerpo.
 * @throws {Error} «Sin mock para …», también en la consola, si ninguna ruta encaja.
 */
async function respond (method: ApiMethod, path: string, routes: MockRoutes = MOCK_ROUTES): Promise<unknown> {
  await waitLatency()
  const route = path.split('?')[0] ?? ''
  const found = findRoute(routes, method, route)
  if (found === null) {
    const message = `Sin mock para ${method} ${route}`
    console.error(message)
    throw new Error(message)
  }
  return found.response === null ? undefined : structuredClone(found.response)
}

/**
 * Imita una subida: responde como `respond` con `POST` y da el progreso al terminar.
 * @param path La ruta de la API.
 * @param options `onProgress` recibe el 100 %; `signal` la corta.
 * @param routes Las respuestas por ruta, como en `respond`.
 * @returns Lo que da el mock de `POST path`, sin validar.
 * @throws {DOMException} `AbortError` si se cancela, como la API.
 */
async function upload (path: string, { onProgress, signal }: UploadOptions = {}, routes: MockRoutes = MOCK_ROUTES): Promise<unknown> {
  const response = await respond('POST', path, routes)
  signal?.throwIfAborted()
  onProgress?.(100)
  return response
}

/**
 * Imita una descarga: la respuesta del JSON es el texto del fichero, que llega como un `Blob`.
 * @param method El verbo HTTP.
 * @param path La ruta de la API.
 * @param routes Las respuestas por ruta, como en `respond`.
 * @returns El fichero, un CSV en UTF-8.
 * @throws {Error} si el mock no da un texto, o «Sin mock para …» si no hay ruta.
 */
async function download (method: ApiMethod, path: string, routes: MockRoutes = MOCK_ROUTES): Promise<Blob> {
  const content = await respond(method, path, routes)
  if (typeof content !== 'string') throw new Error(`El mock de ${method} ${path.split('?')[0]} no da el texto de un fichero`)
  return new Blob([content], { type: 'text/csv;charset=utf-8' })
}

export const apiMockUtils = {
  respond,
  upload,
  download,
}
