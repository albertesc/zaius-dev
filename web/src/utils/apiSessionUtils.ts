import { AsyncLocalStorage } from 'node:async_hooks'
import type { ApiSession } from '@/types/api'
import { apiErrorUtils } from './apiErrorUtils'

const sessions = new AsyncLocalStorage<ApiSession>()

/**
 * Corre una petición con su sesión: lo que llame a la API dentro de `run` usa su token y le avisa si se cierra.
 * @param session `getToken` da el token de la petición, o `null`; `onEnd` recibe por qué la API ha cerrado la sesión.
 * @param task Lo que se hace con esa sesión (en el middleware, `next`).
 * @returns Lo que devuelve `task`.
 */
function run<T> (session: ApiSession, task: () => T): T {
  return sessions.run(session, task)
}

/**
 * Da el token de la sesión de la petición en curso, para la cabecera `Authorization`.
 * @returns El token, o `null` si no hay sesión.
 */
function getToken (): string | null {
  return sessions.getStore()?.getToken() ?? null
}

/**
 * Avisa a la sesión de la petición si un fallo la cierra: un `401`, la sesión caducada.
 * @param error El error de la petición.
 */
function endOnError (error: unknown): void {
  if (apiErrorUtils.isApiError(error) && error.status === 401) sessions.getStore()?.onEnd('expired')
}

export const apiSessionUtils = {
  run,
  getToken,
  endOnError,
}
