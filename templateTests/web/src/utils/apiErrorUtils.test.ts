import { describe, expect, it } from 'vitest'
import { apiErrorUtils } from './apiErrorUtils'

describe('buildError', () => {
  it('guarda el estado y el código de la respuesta', () => {
    const error = apiErrorUtils.buildError(404, 'ORDER_NOT_FOUND')

    expect(error).toBeInstanceOf(Error)
    expect(error).toMatchObject({ name: 'ApiError', status: 404, code: 'ORDER_NOT_FOUND', message: 'ApiError 404 ORDER_NOT_FOUND' })
  })

  it('deja el código en null si la respuesta no lo trae', () => {
    expect(apiErrorUtils.buildError(401).code).toBeNull()
  })
})

describe('isApiError', () => {
  it('reconoce un fallo de la API y nada más', () => {
    expect(apiErrorUtils.isApiError(apiErrorUtils.buildError(500))).toBe(true)
    expect(apiErrorUtils.isApiError(new Error('ApiError 500'))).toBe(false)
    expect(apiErrorUtils.isApiError({ name: 'ApiError', status: 500 })).toBe(false)
    expect(apiErrorUtils.isApiError(null)).toBe(false)
  })
})

describe('readErrorCode', () => {
  it('lee el code del cuerpo de error de la API', () => {
    expect(apiErrorUtils.readErrorCode({ code: 'ORDER_ALREADY_CLOSED', message: 'No' })).toBe('ORDER_ALREADY_CLOSED')
  })

  it('da null con un code nulo, sin cuerpo o con un texto', () => {
    expect(apiErrorUtils.readErrorCode({ code: null })).toBeNull()
    expect(apiErrorUtils.readErrorCode(undefined)).toBeNull()
    expect(apiErrorUtils.readErrorCode('Acceso denegado')).toBeNull()
  })
})

describe('isNotFound', () => {
  it('reconoce un 404 y nada más', () => {
    expect(apiErrorUtils.isNotFound(apiErrorUtils.buildError(404, 'ORDER_NOT_FOUND'))).toBe(true)
    expect(apiErrorUtils.isNotFound(apiErrorUtils.buildError(400, 'ORDER_NOT_FOUND'))).toBe(false)
    expect(apiErrorUtils.isNotFound(new Error('404'))).toBe(false)
  })
})

describe('getRequestFailure', () => {
  it('da network si no se ha llegado al servidor y generic en cualquier otro caso', () => {
    expect(apiErrorUtils.getRequestFailure(new TypeError('Failed to fetch'))).toBe('network')
    expect(apiErrorUtils.getRequestFailure(apiErrorUtils.buildError(500))).toBe('generic')
    expect(apiErrorUtils.getRequestFailure(null)).toBe('generic')
  })
})
