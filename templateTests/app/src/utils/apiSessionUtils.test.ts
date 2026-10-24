import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiErrorUtils } from './apiErrorUtils'
import { apiSessionUtils } from './apiSessionUtils'

const onEnd = vi.fn()
let disconnect = () => {}

afterEach(() => {
  disconnect()
  onEnd.mockReset()
})

describe('connect', () => {
  it('da el token de la sesión conectada y deja de darlo al desconectarla', () => {
    disconnect = apiSessionUtils.connect({ getToken: () => 'abc', onEnd })
    expect(apiSessionUtils.getToken()).toBe('abc')

    disconnect()
    expect(apiSessionUtils.getToken()).toBeNull()
  })
})

describe('getToken', () => {
  it('no da token sin una sesión conectada', () => {
    expect(apiSessionUtils.getToken()).toBeNull()
  })
})

describe('endOnError', () => {
  it('avisa de la sesión caducada con un 401', () => {
    disconnect = apiSessionUtils.connect({ getToken: () => 'abc', onEnd })

    apiSessionUtils.endOnError(apiErrorUtils.buildError(401))

    expect(onEnd).toHaveBeenCalledExactlyOnceWith('expired')
  })

  it('no avisa de los demás fallos', () => {
    disconnect = apiSessionUtils.connect({ getToken: () => 'abc', onEnd })

    apiSessionUtils.endOnError(apiErrorUtils.buildError(404, 'ORDER_NOT_FOUND'))
    apiSessionUtils.endOnError(new TypeError('Failed to fetch'))

    expect(onEnd).not.toHaveBeenCalled()
  })
})
