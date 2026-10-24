import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { apiErrorUtils } from './apiErrorUtils'
// kit:if mocks
import { apiMockUtils } from './apiMockUtils'
// kit:end
// kit:if privateArea
import { apiSessionUtils } from './apiSessionUtils'
// kit:end
import { apiUtils } from './apiUtils'

const env = vi.hoisted(() => ({ API_URL: 'http://api.test', USE_MOCKS: false }))

vi.mock('astro:env/server', () => env)

const bookingSchema = z.object({ id: z.number() })
// kit:if privateArea

/**
 * Corre una llamada a la API dentro de una petición con sesión.
 * @param task La llamada.
 * @param onEnd Lo que recibe el aviso de que la API ha cerrado la sesión.
 * @returns Lo que devuelve la llamada.
 */
function withSession<T> (task: () => Promise<T>, onEnd = vi.fn()): Promise<T> {
  return apiSessionUtils.run({ getToken: () => 'abc', onEnd }, task)
}
// kit:end

afterEach(() => {
  env.USE_MOCKS = false
  vi.unstubAllGlobals()
})

// kit:if mocks
describe('con los mocks', () => {
  it('request responde lo que da el mock, validado por su schema', async () => {
    env.USE_MOCKS = true
    const respond = vi.spyOn(apiMockUtils, 'respond').mockResolvedValue({ id: 12 })

    expect(await apiUtils.request('GET', '/booking/detail/12', bookingSchema)).toEqual({ id: 12 })
    expect(respond).toHaveBeenCalledWith('GET', '/booking/detail/12')
  })

  it('request falla si la respuesta no cumple el schema', async () => {
    env.USE_MOCKS = true
    vi.spyOn(apiMockUtils, 'respond').mockResolvedValue({ id: '12' })

    await expect(apiUtils.request('GET', '/booking/detail/12', bookingSchema)).rejects.toBeInstanceOf(z.ZodError)
  })

  it('upload y download responden lo que dan sus mocks', async () => {
    env.USE_MOCKS = true
    vi.spyOn(apiMockUtils, 'upload').mockResolvedValue({ id: 7 })
    vi.spyOn(apiMockUtils, 'download').mockResolvedValue(new Blob(['Núm.;Estado']))

    expect(await apiUtils.upload('/invoice/upload', bookingSchema, new FormData())).toEqual({ id: 7 })
    expect(await (await apiUtils.download('POST', '/booking/exportCsv', {})).text()).toBe('Núm.;Estado')
  })
})

// kit:end
describe('request contra la API', () => {
  // kit:if privateArea
  it('llama a API_URL con el token de la petición y el cuerpo en JSON', async () => {
    const fetch = vi.fn(async () => Response.json({ id: 12 }))
    vi.stubGlobal('fetch', fetch)

    expect(await withSession(() => apiUtils.request('POST', '/booking/detail', bookingSchema, { id: 12 }))).toEqual({ id: 12 })
    expect(fetch).toHaveBeenCalledWith('http://api.test/booking/detail', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer abc' },
      body: '{"id":12}',
      signal: undefined,
    })
  })

  it('sin sesión ni cuerpo, solo pide JSON', async () => {
    const fetch = vi.fn(async () => Response.json({ id: 12 }))
    vi.stubGlobal('fetch', fetch)

    await apiUtils.request('GET', '/booking/detail/12', bookingSchema)

    expect(fetch).toHaveBeenCalledWith('http://api.test/booking/detail/12', { method: 'GET', headers: { Accept: 'application/json' }, body: undefined, signal: undefined })
  })

  it('da el fallo con el code del cuerpo de error y avisa a la sesión de un 401', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ code: 'SESSION_EXPIRED' }, { status: 401 })))
    const onEnd = vi.fn()

    await expect(withSession(() => apiUtils.request('PUT', '/booking/update', z.undefined(), {}), onEnd)).rejects.toMatchObject({ status: 401, code: 'SESSION_EXPIRED' })
    expect(onEnd).toHaveBeenCalledExactlyOnceWith('expired')
  })

  it('no avisa a la sesión de otro fallo', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ code: 'ORDER_ALREADY_CLOSED' }, { status: 409 })))
    const onEnd = vi.fn()

    await expect(withSession(() => apiUtils.request('PUT', '/booking/update', z.undefined(), {}), onEnd)).rejects.toMatchObject({ status: 409 })
    expect(onEnd).not.toHaveBeenCalled()
  })
  // kit:else
  it('llama a API_URL con el cuerpo en JSON', async () => {
    const fetch = vi.fn(async () => Response.json({ id: 12 }))
    vi.stubGlobal('fetch', fetch)

    expect(await apiUtils.request('POST', '/booking/detail', bookingSchema, { id: 12 })).toEqual({ id: 12 })
    expect(fetch).toHaveBeenCalledWith('http://api.test/booking/detail', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: '{"id":12}',
      signal: undefined,
    })
  })

  it('sin cuerpo, solo pide JSON', async () => {
    const fetch = vi.fn(async () => Response.json({ id: 12 }))
    vi.stubGlobal('fetch', fetch)

    await apiUtils.request('GET', '/booking/detail/12', bookingSchema)

    expect(fetch).toHaveBeenCalledWith('http://api.test/booking/detail/12', { method: 'GET', headers: { Accept: 'application/json' }, body: undefined, signal: undefined })
  })

  it('da el fallo con su estado y el code del cuerpo de error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ code: 'ORDER_ALREADY_CLOSED' }, { status: 409 })))

    await expect(apiUtils.request('PUT', '/booking/update', z.undefined(), {})).rejects.toMatchObject({ status: 409, code: 'ORDER_ALREADY_CLOSED' })
  })
  // kit:end

  it('da un 404 como un fallo de la API que reconoce isNotFound', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ code: 'ORDER_NOT_FOUND' }, { status: 404 })))

    const error = await apiUtils.request('GET', '/booking/detail/9', bookingSchema).catch((caught: unknown) => caught)

    expect(apiErrorUtils.isNotFound(error)).toBe(true)
  })
})

describe('upload contra la API', () => {
  it('no sube nada si ya está cancelada', async () => {
    const controller = new AbortController()
    controller.abort()

    await expect(apiUtils.upload('/invoice/upload', bookingSchema, new FormData(), { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' })
  })

  // kit:if privateArea
  it('sube el FormData con POST y el token, y da el 100 % al terminar', async () => {
    const fetch = vi.fn(async () => Response.json({ id: 7 }))
    vi.stubGlobal('fetch', fetch)
    const formData = new FormData()
    const onProgress = vi.fn()

    expect(await withSession(() => apiUtils.upload('/invoice/upload', bookingSchema, formData, { onProgress }))).toEqual({ id: 7 })
    expect(fetch).toHaveBeenCalledWith('http://api.test/invoice/upload', { method: 'POST', headers: { Accept: 'application/json', Authorization: 'Bearer abc' }, body: formData, signal: undefined })
    expect(onProgress).toHaveBeenCalledExactlyOnceWith(100)
  })
  // kit:else
  it('sube el FormData con POST y da el 100 % al terminar', async () => {
    const fetch = vi.fn(async () => Response.json({ id: 7 }))
    vi.stubGlobal('fetch', fetch)
    const formData = new FormData()
    const onProgress = vi.fn()

    expect(await apiUtils.upload('/invoice/upload', bookingSchema, formData, { onProgress })).toEqual({ id: 7 })
    expect(fetch).toHaveBeenCalledWith('http://api.test/invoice/upload', { method: 'POST', headers: { Accept: 'application/json' }, body: formData, signal: undefined })
    expect(onProgress).toHaveBeenCalledExactlyOnceWith(100)
  })
  // kit:end
})

describe('download contra la API', () => {
  it('descarga el fichero tal cual', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('Núm.;Estado', { status: 200, headers: { 'Content-Type': 'text/csv' } })))

    expect(await (await apiUtils.download('POST', '/booking/exportCsv', { page: 1 })).text()).toBe('Núm.;Estado')
  })

  // kit:if privateArea
  it('da el fallo y avisa a la sesión de un 401', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 401 })))
    const onEnd = vi.fn()

    await expect(withSession(() => apiUtils.download('POST', '/booking/exportCsv', {}), onEnd)).rejects.toMatchObject({ status: 401, code: null })
    expect(onEnd).toHaveBeenCalledExactlyOnceWith('expired')
  })
  // kit:else
  it('da el fallo con su estado, sin code si el cuerpo no es JSON', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 500 })))

    await expect(apiUtils.download('POST', '/booking/exportCsv', {})).rejects.toMatchObject({ status: 500, code: null })
  })
  // kit:end
})
