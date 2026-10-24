// kit:if mocks
import { API_URL, USE_MOCKS } from 'astro:env/server'
// kit:else
import { API_URL } from 'astro:env/server'
// kit:end
import type { ZodType } from 'zod'
import type { ApiMethod, UploadOptions } from '@/types/api'
import { apiErrorUtils } from './apiErrorUtils'
// kit:if privateArea
import { apiSessionUtils } from './apiSessionUtils'
// kit:end

// kit:if privateArea
/**
 * Arma las cabeceras de una petición: lo que acepta, el token y, con cuerpo, su tipo.
 * @param body El cuerpo de la petición: un `FormData` deja que `fetch` ponga su `Content-Type`.
 * @param accept Lo que acepta como respuesta: JSON o, en una descarga, cualquier fichero.
 * @returns Las cabeceras, con `Authorization` solo si hay sesión.
 */
function getHeaders (body: unknown, accept = 'application/json'): Record<string, string> {
  const token = apiSessionUtils.getToken()
  return {
    Accept: accept,
    ...(body === undefined || body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token === null ? {} : { Authorization: `Bearer ${token}` }),
  }
}
// kit:else
/**
 * Arma las cabeceras de una petición: lo que acepta y, con cuerpo, su tipo.
 * @param body El cuerpo de la petición: un `FormData` deja que `fetch` ponga su `Content-Type`.
 * @param accept Lo que acepta como respuesta: JSON o, en una descarga, cualquier fichero.
 * @returns Las cabeceras.
 */
function getHeaders (body: unknown, accept = 'application/json'): Record<string, string> {
  return {
    Accept: accept,
    ...(body === undefined || body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
  }
}
// kit:end

/**
 * Lee el cuerpo de una respuesta de la API, si es JSON.
 * @param response La respuesta.
 * @returns El cuerpo, o `undefined` si no trae JSON.
 */
async function readJson (response: Response): Promise<unknown> {
  return response.headers.get('Content-Type')?.includes('json') ? await response.json() : undefined
}

// kit:if privateArea
/**
 * Hace la petición a la API real: un objeto va como JSON y un `FormData`, como multipart.
 * @param method El verbo HTTP.
 * @param path La ruta de la API, sin el prefijo de `API_URL`.
 * @param body El cuerpo, o `undefined`.
 * @param options `accept`, lo que acepta como respuesta; `signal` corta la petición.
 * @returns La respuesta, si es 2xx.
 * @throws {ApiError} si no es 2xx, con el `code` de su cuerpo; un `401` avisa antes a la sesión.
 */
async function callServer (method: ApiMethod, path: string, body: unknown, { accept, signal }: { accept?: string, signal?: AbortSignal } = {}): Promise<Response> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: getHeaders(body, accept),
    body: body === undefined || body instanceof FormData ? body : JSON.stringify(body),
    signal,
  })
  if (!response.ok) {
    const error = apiErrorUtils.buildError(response.status, apiErrorUtils.readErrorCode(await readJson(response)))
    apiSessionUtils.endOnError(error)
    throw error
  }
  return response
}
// kit:else
/**
 * Hace la petición a la API real: un objeto va como JSON y un `FormData`, como multipart.
 * @param method El verbo HTTP.
 * @param path La ruta de la API, sin el prefijo de `API_URL`.
 * @param body El cuerpo, o `undefined`.
 * @param options `accept`, lo que acepta como respuesta; `signal` corta la petición.
 * @returns La respuesta, si es 2xx.
 * @throws {ApiError} si no es 2xx, con el `code` de su cuerpo.
 */
async function callServer (method: ApiMethod, path: string, body: unknown, { accept, signal }: { accept?: string, signal?: AbortSignal } = {}): Promise<Response> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: getHeaders(body, accept),
    body: body === undefined || body instanceof FormData ? body : JSON.stringify(body),
    signal,
  })
  if (!response.ok) throw apiErrorUtils.buildError(response.status, apiErrorUtils.readErrorCode(await readJson(response)))
  return response
}
// kit:end

// kit:if mocks
/**
 * Carga los mocks; se llama solo con `USE_MOCKS=true`, que se fija al compilar, así que el código de producción no los usa.
 * @returns `apiMockUtils`, que responde con los `*Mocks.json`.
 */
async function loadMocks () {
  return (await import('./apiMockUtils')).apiMockUtils
}

// kit:end
/**
 * Llama a la API y valida la respuesta con el schema del service.
 * @param method El verbo HTTP.
 * @param path La ruta de la API (`/booking/detail/12`), sin el prefijo de `API_URL`.
 * @param schema El schema que valida y tipa la respuesta: `z.undefined()` si no devuelve nada.
 * @param body El cuerpo: un objeto va como JSON y un `FormData`, como multipart.
 * @returns La respuesta validada.
 * @throws {ApiError} si la respuesta no es 2xx, como en `callServer`.
 */
async function request<T> (method: ApiMethod, path: string, schema: ZodType<T>, body?: unknown): Promise<T> {
  // kit:if mocks
  const data = USE_MOCKS
    ? await (await loadMocks()).respond(method, path)
    : await readJson(await callServer(method, path, body))
  // kit:else
  const data = await readJson(await callServer(method, path, body))
  // kit:end
  return schema.parse(data)
}

/**
 * Sube ficheros a la API con `POST` y valida la respuesta. Desde el servidor no hay progreso: `onProgress` recibe el 100 % al terminar.
 * @param path La ruta de la API (`/invoice/upload`).
 * @param schema El schema que valida y tipa la respuesta.
 * @param formData Los campos y los ficheros.
 * @param options `onProgress` recibe el 100 % al terminar; `signal` corta la subida.
 * @returns La respuesta validada.
 * @throws {ApiError} si no es 2xx, como en `callServer`; `AbortError` si se cancela.
 */
async function upload<T> (path: string, schema: ZodType<T>, formData: FormData, options: UploadOptions = {}): Promise<T> {
  options.signal?.throwIfAborted()
  // kit:if mocks
  const data = USE_MOCKS
    ? await (await loadMocks()).upload(path, options)
    : await readJson(await callServer('POST', path, formData, { signal: options.signal }))
  // kit:else
  const data = await readJson(await callServer('POST', path, formData, { signal: options.signal }))
  // kit:end
  options.onProgress?.(100)
  return schema.parse(data)
}

/**
 * Descarga un fichero (un CSV) de la API, sin validarlo.
 * @param method El verbo HTTP.
 * @param path La ruta de la API (`/booking/exportCsv`).
 * @param body El cuerpo, que va como JSON.
 * @returns El fichero como `Blob`.
 * @throws {ApiError} si no es 2xx, como en `callServer`.
 */
async function download (method: ApiMethod, path: string, body?: unknown): Promise<Blob> {
  // kit:if mocks
  return USE_MOCKS
    ? (await loadMocks()).download(method, path)
    : (await callServer(method, path, body, { accept: '*/*' })).blob()
  // kit:else
  return (await callServer(method, path, body, { accept: '*/*' })).blob()
  // kit:end
}

export const apiUtils = {
  request,
  upload,
  download,
}
