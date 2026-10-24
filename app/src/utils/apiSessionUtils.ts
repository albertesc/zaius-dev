import type { ApiSession } from '@/types/api'
import { apiErrorUtils } from './apiErrorUtils'

const DISCONNECTED: ApiSession = { getToken: () => null, onEnd: () => {} }

let session = DISCONNECTED

/**
 * Conecta el transporte con la sesión: de dónde sale el token y a quién avisa cuando la API la cierra.
 * @param connected `getToken` da el token actual, o `null`; `onEnd` recibe por qué la API ha cerrado la sesión.
 * @returns La función que la desconecta.
 */
function connect (connected: ApiSession): () => void {
  session = connected
  return () => {
    if (session === connected) session = DISCONNECTED
  }
}

/**
 * Da el token de la sesión conectada, para la cabecera `Authorization`.
 * @returns El token, o `null` si no hay sesión.
 */
function getToken (): string | null {
  return session.getToken()
}

/**
 * Avisa a la sesión si un fallo la cierra: un `401`, la sesión caducada.
 * @param error El error de la petición.
 */
function endOnError (error: unknown): void {
  if (apiErrorUtils.isApiError(error) && error.status === 401) session.onEnd('expired')
}

export const apiSessionUtils = {
  connect,
  getToken,
  endOnError,
}
