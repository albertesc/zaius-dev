import { z } from 'zod'
import type { ApiError, RequestFailure } from '@/types/api'

const errorBodySchema = z.object({ code: z.string().nullish() })

/**
 * Crea el fallo de una llamada a la API, como lo da el transporte: su estado HTTP y el `code` de su cuerpo.
 * @param status El estado HTTP de la respuesta.
 * @param code El `code` del cuerpo de error, o `null` si no lo trae.
 * @returns El error, que reconoce `isApiError`.
 */
function buildError (status: number, code: string | null = null): ApiError {
  const message = code === null ? `ApiError ${status}` : `ApiError ${status} ${code}`
  return Object.assign(new Error(message), { name: 'ApiError' as const, status, code })
}

/**
 * Dice si un error es un fallo de la API.
 * @param error El error capturado.
 * @returns `true` si lo creó `buildError`, con su `status` y su `code`.
 */
function isApiError (error: unknown): error is ApiError {
  return error instanceof Error && error.name === 'ApiError' && 'status' in error && typeof error.status === 'number'
}

/**
 * Lee el `code` del cuerpo de una respuesta de error de la API.
 * @param body El cuerpo leído como JSON, o `undefined` si no era JSON.
 * @returns El `code`, o `null` si no lo trae.
 */
function readErrorCode (body: unknown): string | null {
  return errorBodySchema.safeParse(body).data?.code ?? null
}

/**
 * Dice si un fallo es un `404`: lo que se pedía no existe.
 * @param error El error capturado.
 * @returns `true` si es un fallo de la API con estado 404.
 */
function isNotFound (error: unknown): boolean {
  return isApiError(error) && error.status === 404
}

/**
 * Clasifica un fallo para elegir el texto que lo explica: sin conexión o cualquier otro.
 * @param error El error capturado.
 * @returns `network` si no se ha llegado al servidor (`fetch` y `XMLHttpRequest` dan un `TypeError`); si no, `generic`.
 */
function getRequestFailure (error: unknown): RequestFailure {
  return error instanceof TypeError ? 'network' : 'generic'
}

export const apiErrorUtils = {
  buildError,
  isApiError,
  readErrorCode,
  isNotFound,
  getRequestFailure,
}
