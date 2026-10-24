import { describe, expect, it, vi } from 'vitest'
import { apiMockUtils } from './apiMockUtils'

const ROUTES = {
  'GET /order/filters': { statuses: ['open', 'closed'] },
  'GET /order/detail/12': { id: 12 },
  'GET /order/detail/:id': { id: 1 },
  'PUT /order/cancel/:id': null,
  'POST /order/exportCsv': 'Núm.;Estado\n1287;Abierto',
  'POST /invoice/upload': { id: 7 },
}

describe('respond', () => {
  it('responde una copia de la respuesta de su ruta, sin contar la query string', async () => {
    const response = await apiMockUtils.respond('GET', '/order/filters?view=short', ROUTES)

    expect(response).toEqual(ROUTES['GET /order/filters'])
    expect(response).not.toBe(ROUTES['GET /order/filters'])
  })

  it('prefiere la ruta exacta a la de un :param', async () => {
    expect(await apiMockUtils.respond('GET', '/order/detail/12', ROUTES)).toEqual({ id: 12 })
    expect(await apiMockUtils.respond('GET', '/order/detail/9', ROUTES)).toEqual({ id: 1 })
  })

  it('da un null del JSON como una respuesta sin cuerpo', async () => {
    expect(await apiMockUtils.respond('PUT', '/order/cancel/9', ROUTES)).toBeUndefined()
  })

  it('falla y lo dice en la consola si no hay mock para la ruta', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    await expect(apiMockUtils.respond('POST', '/order/missing?view=short', ROUTES)).rejects.toThrow('Sin mock para POST /order/missing')
    expect(consoleError).toHaveBeenCalledWith('Sin mock para POST /order/missing')
  })
})

describe('upload', () => {
  it('da el progreso y responde lo que da el mock de POST', async () => {
    const onProgress = vi.fn()

    expect(await apiMockUtils.upload('/invoice/upload', { onProgress }, ROUTES)).toEqual({ id: 7 })
    expect(onProgress).toHaveBeenCalledExactlyOnceWith(100)
  })

  it('falla si se cancela', async () => {
    const controller = new AbortController()
    controller.abort()

    await expect(apiMockUtils.upload('/invoice/upload', { signal: controller.signal }, ROUTES)).rejects.toMatchObject({ name: 'AbortError' })
  })
})

describe('download', () => {
  it('da el texto del mock como fichero', async () => {
    const file = await apiMockUtils.download('POST', '/order/exportCsv', ROUTES)

    expect(await file.text()).toBe('Núm.;Estado\n1287;Abierto')
  })

  it('falla si el mock no da un texto', async () => {
    await expect(apiMockUtils.download('GET', '/order/filters', ROUTES)).rejects.toThrow('El mock de GET /order/filters no da el texto de un fichero')
  })
})
