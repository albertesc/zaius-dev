import { afterEach, describe, expect, it, vi } from 'vitest'
import { APP_DEFAULT_LANGUAGE, APP_LANGUAGES } from '@/constants/appLanguages'
import { testUtils } from '@/tests/testUtils'
import { buildI18nResources, getInitialAppLanguage, i18n } from './i18n'

const [firstLanguage = APP_DEFAULT_LANGUAGE, secondLanguage = APP_DEFAULT_LANGUAGE] = APP_LANGUAGES

describe('buildI18nResources', () => {
  it('da a cada catálogo el namespace de su carpeta', () => {
    const resources = buildI18nResources({
      [`/src/i18n/${firstLanguage}.json`]: { notFound: 'No existe' },
      [`/src/features/orders/ordersEdit/i18n/${firstLanguage}.json`]: { title: 'Gestiona el pedido' },
      [`/src/features/orders/common/i18n/${firstLanguage}.json`]: { filters: { more: 'Más filtros' } },
      [`/src/features/admin/adminUsers/i18n/${firstLanguage}.json`]: { title: 'Usuarios' },
      [`/src/domains/products/i18n/${firstLanguage}.json`]: { title: 'Productos' },
    })

    expect(resources[firstLanguage]).toEqual({
      common: { notFound: 'No existe' },
      ordersEdit: { title: 'Gestiona el pedido' },
      orders: { filters: { more: 'Más filtros' } },
      adminUsers: { title: 'Usuarios' },
      products: { title: 'Productos' },
    })
  })

  it('suma los catálogos que comparten namespace: el índice de una familia, su common y el dominio que se llama como ella', () => {
    const resources = buildI18nResources({
      [`/src/features/orders/orders/i18n/${firstLanguage}.json`]: { title: 'Gestión de pedidos', filters: { search: 'Busca' } },
      [`/src/features/orders/common/i18n/${firstLanguage}.json`]: { filters: { more: 'Más filtros' } },
      [`/src/features/customers/customers/i18n/${firstLanguage}.json`]: { title: 'Clientes' },
      [`/src/domains/customers/i18n/${firstLanguage}.json`]: { status: { active: 'Activo' } },
    })

    expect(resources[firstLanguage]).toEqual({
      orders: { title: 'Gestión de pedidos', filters: { search: 'Busca', more: 'Más filtros' } },
      customers: { title: 'Clientes', status: { active: 'Activo' } },
    })
  })

  it('no cuenta los catálogos de un idioma que no es de la app', () => {
    expect(buildI18nResources({ '/src/i18n/zz.json': { title: 'x' } })).toEqual({})
  })

  it('copia la forma _other en _many, también dentro de un grupo, sin pisar la que ya está', () => {
    const resources = buildI18nResources({
      [`/src/i18n/${firstLanguage}.json`]: {
        orders: { subtitle_one: '{{count}} pedido', subtitle_other: '{{count}} pedidos' },
        total_other: '{{count}} pedidos',
        total_many: '{{count}} de pedidos',
      },
    })

    expect(resources[firstLanguage]?.common).toEqual({
      orders: { subtitle_one: '{{count}} pedido', subtitle_other: '{{count}} pedidos', subtitle_many: '{{count}} pedidos' },
      total_other: '{{count}} pedidos',
      total_many: '{{count}} de pedidos',
    })
  })
})

describe('getInitialAppLanguage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('arranca en el idioma del navegador si es de la app', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue(`${secondLanguage}-XX`)

    expect(getInitialAppLanguage()).toBe(secondLanguage)
  })

  it('arranca en el idioma por defecto si el navegador está en otro', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('zz-ZZ')

    expect(getInitialAppLanguage()).toBe(APP_DEFAULT_LANGUAGE)
  })
})

describe('i18n', () => {
  afterEach(async () => {
    i18n.removeResourceBundle(firstLanguage, 'test')
    i18n.removeResourceBundle(secondLanguage, 'test')
    await i18n.changeLanguage(APP_DEFAULT_LANGUAGE)
  })

  it('cambia los textos y <html lang> al cambiar de idioma', async () => {
    const secondTitle = secondLanguage === firstLanguage ? 'primero' : 'segundo'
    i18n.addResourceBundle(firstLanguage, 'test', { title: 'primero' })
    i18n.addResourceBundle(secondLanguage, 'test', { title: secondTitle })

    await i18n.changeLanguage(secondLanguage)

    expect(document.documentElement.lang).toBe(secondLanguage)
    expect(i18n.t('test:title')).toBe(secondTitle)
  })

  it('elige el singular o el plural con count', async () => {
    await i18n.changeLanguage(APP_DEFAULT_LANGUAGE)
    i18n.addResourceBundle(APP_DEFAULT_LANGUAGE, 'test', { orders_one: '{{count}} pedido', orders_other: '{{count}} pedidos' })

    expect(i18n.t('test:orders', { count: 1 })).toBe('1 pedido')
    expect(i18n.t('test:orders', { count: 2 })).toBe('2 pedidos')
  })
})

describe('testUtils.translate', () => {
  afterEach(() => {
    i18n.removeResourceBundle(APP_DEFAULT_LANGUAGE, 'test')
  })

  it('da el texto del idioma por defecto, con sus valores y su plural', () => {
    i18n.addResourceBundle(APP_DEFAULT_LANGUAGE, 'test', { title: 'Hola, {{name}}', orders_one: '{{count}} pedido', orders_other: '{{count}} pedidos' })

    expect(testUtils.translate('test:title', { name: 'Marta' })).toBe('Hola, Marta')
    expect(testUtils.translate('test:orders', { count: 1 })).toBe('1 pedido')
    expect(testUtils.translate('test:orders', { count: 3 })).toBe('3 pedidos')
  })

  it('falla si falta la clave o su forma para ese número', () => {
    i18n.addResourceBundle(APP_DEFAULT_LANGUAGE, 'test', { lines_other: '{{count}} líneas' })

    expect(() => testUtils.translate('test:missing')).toThrow('Falta el texto «test:missing»')
    expect(() => testUtils.translate('test:lines', { count: 1 })).toThrow('Falta el texto «test:lines»')
  })
})
