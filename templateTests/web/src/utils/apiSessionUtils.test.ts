import { describe, expect, it, vi } from 'vitest'
import { apiErrorUtils } from './apiErrorUtils'
import { apiSessionUtils } from './apiSessionUtils'

describe('run', () => {
  it('da el token de cada petición, sin mezclar dos que van a la vez', async () => {
    const tokens = await Promise.all(['a', 'b'].map((token) => apiSessionUtils.run({ getToken: () => token, onEnd: () => {} }, async () => {
      await new Promise((resolve) => setTimeout(resolve, token === 'a' ? 10 : 0))
      return apiSessionUtils.getToken()
    })))

    expect(tokens).toEqual(['a', 'b'])
  })

  it('fuera de una petición no hay token', () => {
    expect(apiSessionUtils.getToken()).toBeNull()
  })
})

describe('endOnError', () => {
  it('avisa a la sesión de la petición con un 401', () => {
    const onEnd = vi.fn()

    apiSessionUtils.run({ getToken: () => 'abc', onEnd }, () => apiSessionUtils.endOnError(apiErrorUtils.buildError(401, null)))

    expect(onEnd).toHaveBeenCalledExactlyOnceWith('expired')
  })

  it('no avisa con otro fallo', () => {
    const onEnd = vi.fn()

    apiSessionUtils.run({ getToken: () => 'abc', onEnd }, () => apiSessionUtils.endOnError(apiErrorUtils.buildError(500, null)))

    expect(onEnd).not.toHaveBeenCalled()
  })
})
