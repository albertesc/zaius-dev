import type { ZodType } from 'zod'
import type { ApiMethod, UploadOptions } from '@/types/api'
import { apiErrorUtils } from './apiErrorUtils'
import { apiSessionUtils } from './apiSessionUtils'

/**
 * Arma las cabeceras de una petición: lo que acepta, el token y, con cuerpo, su tipo.
 * @param body El cuerpo de la petición: un `FormData` deja que el navegador ponga su `Content-Type`.
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

/**
 * Lee el cuerpo de una respuesta de la API, si es JSON.
 * @param response La respuesta.
 * @returns El cuerpo, o `undefined` si no trae JSON.
 */
async function readJson (response: Response): Promise<unknown> {
  return response.headers.get('Content-Type')?.includes('json') ? await response.json() : undefined
}

/**
 * Hace la petición a la API real: un objeto va como JSON y un `FormData`, como multipart.
 * @param method El verbo HTTP.
 * @param path La ruta de la API, sin el prefijo de `VITE_API_URL`.
 * @param body El cuerpo, o `undefined`.
 * @param accept Lo que acepta como respuesta.
 * @returns La respuesta, si es 2xx.
 * @throws {ApiError} si no es 2xx, con el `code` de su cuerpo.
 */
async function callServer (method: ApiMethod, path: string, body: unknown, accept?: string): Promise<Response> {
  const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    method,
    headers: getHeaders(body, accept),
    body: body === undefined || body instanceof FormData ? body : JSON.stringify(body),
  })
  if (!response.ok) throw apiErrorUtils.buildError(response.status, apiErrorUtils.readErrorCode(await readJson(response)))
  return response
}

/**
 * Sube un `FormData` a la API real con `XMLHttpRequest`, que, al contrario que `fetch`, da el progreso del envío.
 * @param path La ruta de la API.
 * @param formData Los campos y los ficheros.
 * @param options `onProgress` recibe el porcentaje enviado; `signal` corta la subida.
 * @returns La respuesta como JSON, o `undefined` si no trae.
 * @throws {ApiError} si no es 2xx; {TypeError} si falla la red; el motivo de `signal` si se cancela.
 */
function uploadServer (path: string, formData: FormData, { onProgress, signal }: UploadOptions): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const abort = () => xhr.abort()
    xhr.open('POST', `${import.meta.env.VITE_API_URL}${path}`)
    xhr.responseType = 'json'
    for (const [name, value] of Object.entries(getHeaders(formData))) xhr.setRequestHeader(name, value)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.floor((event.loaded / event.total) * 100))
    }
    xhr.onload = () => {
      const data: unknown = xhr.response ?? undefined
      if (xhr.status >= 200 && xhr.status < 300) resolve(data)
      else reject(apiErrorUtils.buildError(xhr.status, apiErrorUtils.readErrorCode(data)))
    }
    xhr.onerror = () => reject(new TypeError('Network request failed'))
    xhr.onabort = () => reject(signal?.reason)
    xhr.onloadend = () => signal?.removeEventListener('abort', abort)
    signal?.addEventListener('abort', abort)
    xhr.send(formData)
  })
}

// kit:if mocks
/**
 * Carga los mocks; se llama solo con `VITE_USE_MOCKS=true`, así que el build de producción no los lleva.
 * @returns `apiMockUtils`, que responde con los `*Mocks.json`.
 */
async function loadMocks () {
  return (await import('./apiMockUtils')).apiMockUtils
}

// kit:end
/**
 * Llama a la API y valida la respuesta con el schema del service.
 * @param method El verbo HTTP.
 * @param path La ruta de la API (`/order/detail/12`), sin el prefijo de `VITE_API_URL`.
 * @param schema El schema que valida y tipa la respuesta: `z.undefined()` si no devuelve nada.
 * @param body El cuerpo: un objeto va como JSON y un `FormData`, como multipart.
 * @returns La respuesta validada.
 * @throws {ApiError} si la respuesta no es 2xx; un `401` avisa antes a la sesión.
 */
async function request<T> (method: ApiMethod, path: string, schema: ZodType<T>, body?: unknown): Promise<T> {
  try {
    // kit:if mocks
    const data = import.meta.env.VITE_USE_MOCKS === 'true'
      ? await (await loadMocks()).respond(method, path)
      : await readJson(await callServer(method, path, body))
    // kit:else
    const data = await readJson(await callServer(method, path, body))
    // kit:end
    return schema.parse(data)
  } catch (error) {
    apiSessionUtils.endOnError(error)
    throw error
  }
}

/**
 * Sube ficheros a la API con `POST` y valida la respuesta.
 * @param path La ruta de la API (`/invoice/upload`).
 * @param schema El schema que valida y tipa la respuesta.
 * @param formData Los campos y los ficheros; el navegador pone su `Content-Type`.
 * @param options `onProgress` recibe el porcentaje enviado (0-100); `signal` corta la subida.
 * @returns La respuesta validada.
 * @throws {ApiError} si no es 2xx, con el aviso a la sesión de `request`; `AbortError` si se cancela.
 */
async function upload<T> (path: string, schema: ZodType<T>, formData: FormData, options: UploadOptions = {}): Promise<T> {
  try {
    options.signal?.throwIfAborted()
    // kit:if mocks
    const data = import.meta.env.VITE_USE_MOCKS === 'true'
      ? await (await loadMocks()).upload(path, options)
      : await uploadServer(path, formData, options)
    // kit:else
    const data = await uploadServer(path, formData, options)
    // kit:end
    return schema.parse(data)
  } catch (error) {
    apiSessionUtils.endOnError(error)
    throw error
  }
}

/**
 * Descarga un fichero (un CSV) de la API, sin validarlo.
 * @param method El verbo HTTP.
 * @param path La ruta de la API (`/order/exportCsv`).
 * @param body El cuerpo, que va como JSON.
 * @returns El fichero como `Blob`.
 * @throws {ApiError} si no es 2xx; un `401` avisa antes a la sesión.
 */
async function download (method: ApiMethod, path: string, body?: unknown): Promise<Blob> {
  try {
    // kit:if mocks
    return import.meta.env.VITE_USE_MOCKS === 'true'
      ? await (await loadMocks()).download(method, path)
      : await (await callServer(method, path, body, '*/*')).blob()
    // kit:else
    return await (await callServer(method, path, body, '*/*')).blob()
    // kit:end
  } catch (error) {
    apiSessionUtils.endOnError(error)
    throw error
  }
}

export const apiUtils = {
  request,
  upload,
  download,
}
