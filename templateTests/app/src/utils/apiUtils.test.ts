import { useQuery } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { testUtils } from '@/tests/testUtils'
import { apiErrorUtils } from './apiErrorUtils'
// kit:if mocks
import { apiMockUtils } from './apiMockUtils'
// kit:end
import { apiSessionUtils } from './apiSessionUtils'
import { apiUtils } from './apiUtils'

const orderSchema = z.object({ id: z.number() })
const onEnd = vi.fn()
let disconnect = () => {}

class FakeXhr {
  static last: FakeXhr
  method = ''
  url = ''
  status = 0
  response: unknown = null
  responseType = ''
  headers: Record<string, string> = {}
  upload: { onprogress: ((event: { lengthComputable: boolean, loaded: number, total: number }) => void) | null } = { onprogress: null }
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  onabort: (() => void) | null = null
  onloadend: (() => void) | null = null

  constructor () {
    FakeXhr.last = this
  }

  open (method: string, url: string) {
    this.method = method
    this.url = url
  }

  setRequestHeader (name: string, value: string) {
    this.headers[name] = value
  }

  send () {}

  abort () {
    this.onabort?.()
    this.onloadend?.()
  }

  respond (status: number, response: unknown) {
    this.status = status
    this.response = response
    this.onload?.()
    this.onloadend?.()
  }
}

afterEach(() => {
  disconnect()
  disconnect = () => {}
  onEnd.mockReset()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

// kit:if mocks
describe('request con los mocks', () => {
  it('responde lo que da el mock, validado por su schema', async () => {
    const respond = vi.spyOn(apiMockUtils, 'respond').mockResolvedValue({ id: 12 })

    expect(await apiUtils.request('GET', '/order/detail/12', orderSchema)).toEqual({ id: 12 })
    expect(respond).toHaveBeenCalledWith('GET', '/order/detail/12')
  })

  it('falla si la respuesta no cumple el schema', async () => {
    vi.spyOn(apiMockUtils, 'respond').mockResolvedValue({ id: '12' })

    await expect(apiUtils.request('GET', '/order/detail/12', orderSchema)).rejects.toBeInstanceOf(z.ZodError)
  })
})

// kit:end
describe('request contra la API', () => {
  it('llama a la API con el token y el cuerpo en JSON', async () => {
    // kit:if mocks
    vi.stubEnv('VITE_USE_MOCKS', 'false')
    // kit:end
    const fetch = vi.fn(async () => Response.json({ id: 12 }))
    vi.stubGlobal('fetch', fetch)
    disconnect = apiSessionUtils.connect({ getToken: () => 'abc', onEnd })

    expect(await apiUtils.request('POST', '/order/detail', orderSchema, { id: 12 })).toEqual({ id: 12 })
    expect(fetch).toHaveBeenCalledWith('/api/order/detail', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer abc' },
      body: '{"id":12}',
    })
  })

  it('sin sesión ni cuerpo, solo pide JSON', async () => {
    // kit:if mocks
    vi.stubEnv('VITE_USE_MOCKS', 'false')
    // kit:end
    const fetch = vi.fn(async () => Response.json({ id: 12 }))
    vi.stubGlobal('fetch', fetch)

    await apiUtils.request('GET', '/order/detail/12', orderSchema)

    expect(fetch).toHaveBeenCalledWith('/api/order/detail/12', { method: 'GET', headers: { Accept: 'application/json' }, body: undefined })
  })

  it('llega a una consulta de TanStack Query', async () => {
    // kit:if mocks
    vi.stubEnv('VITE_USE_MOCKS', 'false')
    // kit:end
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ id: 12 })))
    const { wrapper } = testUtils.createProvidersWrapper()

    const { result } = renderHook(() => useQuery({ queryKey: ['order', 12], queryFn: () => apiUtils.request('GET', '/order/detail/12', orderSchema) }), { wrapper })

    await waitFor(() => expect(result.current.data).toEqual({ id: 12 }))
  })

  it('manda un FormData tal cual, como multipart', async () => {
    // kit:if mocks
    vi.stubEnv('VITE_USE_MOCKS', 'false')
    // kit:end
    const fetch = vi.fn(async () => new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', fetch)
    const formData = new FormData()

    expect(await apiUtils.request('POST', '/order/create', z.undefined(), formData)).toBeUndefined()
    expect(fetch).toHaveBeenCalledWith('/api/order/create', { method: 'POST', headers: { Accept: 'application/json' }, body: formData })
  })

  it('da el fallo con el code del cuerpo de error y avisa a la sesión de un 401', async () => {
    // kit:if mocks
    vi.stubEnv('VITE_USE_MOCKS', 'false')
    // kit:end
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ code: 'SESSION_EXPIRED' }, { status: 401 })))
    disconnect = apiSessionUtils.connect({ getToken: () => 'abc', onEnd })

    await expect(apiUtils.request('PUT', '/order/update', z.undefined(), {})).rejects.toMatchObject({ status: 401, code: 'SESSION_EXPIRED' })
    expect(onEnd).toHaveBeenCalledExactlyOnceWith('expired')
  })

  it('da un 404 como un fallo de la API que reconoce isNotFound', async () => {
    // kit:if mocks
    vi.stubEnv('VITE_USE_MOCKS', 'false')
    // kit:end
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ code: 'ORDER_NOT_FOUND' }, { status: 404 })))

    const error = await apiUtils.request('GET', '/order/detail/9', orderSchema).catch((caught: unknown) => caught)

    expect(apiErrorUtils.isApiError(error)).toBe(true)
    expect(apiErrorUtils.isNotFound(error)).toBe(true)
  })

  it('deja el TypeError de la red, que se explica como sin conexión', async () => {
    // kit:if mocks
    vi.stubEnv('VITE_USE_MOCKS', 'false')
    // kit:end
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    }))

    const error = await apiUtils.request('GET', '/notification', z.unknown()).catch((caught: unknown) => caught)

    expect(apiErrorUtils.getRequestFailure(error)).toBe('network')
  })
})

// kit:if mocks
describe('upload con los mocks', () => {
  it('responde lo que da el mock, validado', async () => {
    const upload = vi.spyOn(apiMockUtils, 'upload').mockResolvedValue({ id: 7 })
    const onProgress = vi.fn()

    expect(await apiUtils.upload('/invoice/upload', orderSchema, new FormData(), { onProgress })).toEqual({ id: 7 })
    expect(upload).toHaveBeenCalledWith('/invoice/upload', { onProgress })
  })
})

// kit:end
describe('upload contra la API', () => {
  it('no sube nada si ya está cancelada', async () => {
    const controller = new AbortController()
    controller.abort()

    await expect(apiUtils.upload('/invoice/upload', orderSchema, new FormData(), { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('sube con POST, con el token, y da el progreso', async () => {
    // kit:if mocks
    vi.stubEnv('VITE_USE_MOCKS', 'false')
    // kit:end
    vi.stubGlobal('XMLHttpRequest', FakeXhr)
    disconnect = apiSessionUtils.connect({ getToken: () => 'abc', onEnd })
    const onProgress = vi.fn()

    const upload = apiUtils.upload('/invoice/upload', orderSchema, new FormData(), { onProgress })
    FakeXhr.last.upload.onprogress?.({ lengthComputable: true, loaded: 50, total: 100 })
    FakeXhr.last.respond(200, { id: 7 })

    expect(await upload).toEqual({ id: 7 })
    expect(FakeXhr.last).toMatchObject({ method: 'POST', url: '/api/invoice/upload', headers: { Accept: 'application/json', Authorization: 'Bearer abc' } })
    expect(onProgress).toHaveBeenCalledWith(50)
  })

  it('da el fallo con el code del cuerpo de error', async () => {
    // kit:if mocks
    vi.stubEnv('VITE_USE_MOCKS', 'false')
    // kit:end
    vi.stubGlobal('XMLHttpRequest', FakeXhr)

    const upload = apiUtils.upload('/invoice/upload', orderSchema, new FormData())
    FakeXhr.last.respond(400, { code: 'INVOICE_FILE_INVALID' })

    await expect(upload).rejects.toMatchObject({ status: 400, code: 'INVOICE_FILE_INVALID' })
  })
})

// kit:if mocks
describe('download con los mocks', () => {
  it('da el fichero del mock', async () => {
    vi.spyOn(apiMockUtils, 'download').mockResolvedValue(new Blob(['Núm.;Estado']))

    const file = await apiUtils.download('POST', '/order/exportCsv', {})

    expect(await file.text()).toBe('Núm.;Estado')
  })
})

// kit:end
describe('download contra la API', () => {
  it('descarga con el token y el cuerpo en JSON, y da el fichero tal cual', async () => {
    // kit:if mocks
    vi.stubEnv('VITE_USE_MOCKS', 'false')
    // kit:end
    const fetch = vi.fn(async () => new Response('Núm.;Estado', { status: 200, headers: { 'Content-Type': 'text/csv' } }))
    vi.stubGlobal('fetch', fetch)
    disconnect = apiSessionUtils.connect({ getToken: () => 'abc', onEnd })

    const file = await apiUtils.download('POST', '/order/exportCsv', { page: 1 })

    expect(await file.text()).toBe('Núm.;Estado')
    expect(fetch).toHaveBeenCalledWith('/api/order/exportCsv', {
      method: 'POST',
      headers: { Accept: '*/*', 'Content-Type': 'application/json', Authorization: 'Bearer abc' },
      body: '{"page":1}',
    })
  })

  it('da el fallo y avisa a la sesión de un 401', async () => {
    // kit:if mocks
    vi.stubEnv('VITE_USE_MOCKS', 'false')
    // kit:end
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 401 })))
    disconnect = apiSessionUtils.connect({ getToken: () => 'abc', onEnd })

    await expect(apiUtils.download('POST', '/order/exportCsv', {})).rejects.toMatchObject({ status: 401, code: null })
    expect(onEnd).toHaveBeenCalledExactlyOnceWith('expired')
  })
})
