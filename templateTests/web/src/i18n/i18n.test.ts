import { afterEach, describe, expect, it } from 'vitest'
import { APP_DEFAULT_LANGUAGE, APP_LANGUAGES } from '@/constants/appLanguages'
import { testUtils } from '@/tests/testUtils'
import { buildI18nResources, getI18nT, i18n } from './i18n'

const [firstLanguage = APP_DEFAULT_LANGUAGE, secondLanguage = APP_DEFAULT_LANGUAGE] = APP_LANGUAGES

describe('buildI18nResources', () => {
  it('da un catálogo por idioma de la app y no cuenta los demás', () => {
    const resources = buildI18nResources({
      [`/src/i18n/${firstLanguage}.json`]: { rooms: { list: { title: 'Habitaciones' } } },
      '/src/i18n/zz.json': { title: 'x' },
    })

    expect(resources).toEqual({ [firstLanguage]: { translation: { rooms: { list: { title: 'Habitaciones' } } } } })
  })

  it('copia la forma _other en _many, también dentro de un grupo, sin pisar la que ya está', () => {
    const resources = buildI18nResources({
      [`/src/i18n/${firstLanguage}.json`]: {
        rooms: { subtitle_one: '{{count}} habitación', subtitle_other: '{{count}} habitaciones' },
        total_other: '{{count}} habitaciones',
        total_many: '{{count}} de habitaciones',
      },
    })

    expect(resources[firstLanguage]?.translation).toEqual({
      rooms: { subtitle_one: '{{count}} habitación', subtitle_other: '{{count}} habitaciones', subtitle_many: '{{count}} habitaciones' },
      total_other: '{{count}} habitaciones',
      total_many: '{{count}} de habitaciones',
    })
  })
})

describe('getI18nT', () => {
  afterEach(() => {
    for (const language of APP_LANGUAGES) i18n.removeResourceBundle(language, 'test')
  })

  it('traduce en el idioma de la petición y, si no es de la app o no lo hay, en el de por defecto', () => {
    const secondTitle = secondLanguage === firstLanguage ? 'primero' : 'segundo'
    i18n.addResourceBundle(firstLanguage, 'test', { title: 'primero' })
    i18n.addResourceBundle(secondLanguage, 'test', { title: secondTitle })

    expect(getI18nT(secondLanguage)('test:title')).toBe(secondTitle)
    expect(getI18nT('zz')('test:title')).toBe('primero')
    expect(getI18nT(undefined)('test:title')).toBe('primero')
  })

  it('elige el singular o el plural con count', () => {
    i18n.addResourceBundle(APP_DEFAULT_LANGUAGE, 'test', { rooms_one: '{{count}} habitación', rooms_other: '{{count}} habitaciones' })
    const t = getI18nT(APP_DEFAULT_LANGUAGE)

    expect(t('test:rooms', { count: 1 })).toBe('1 habitación')
    expect(t('test:rooms', { count: 2 })).toBe('2 habitaciones')
  })
})

describe('testUtils.translate', () => {
  afterEach(() => {
    i18n.removeResourceBundle(APP_DEFAULT_LANGUAGE, 'test')
  })

  it('da el texto del idioma por defecto, con sus valores y su plural', () => {
    i18n.addResourceBundle(APP_DEFAULT_LANGUAGE, 'test', { title: 'Hola, {{name}}', rooms_one: '{{count}} habitación', rooms_other: '{{count}} habitaciones' })

    expect(testUtils.translate('test:title', { name: 'Marta' })).toBe('Hola, Marta')
    expect(testUtils.translate('test:rooms', { count: 1 })).toBe('1 habitación')
    expect(testUtils.translate('test:rooms', { count: 3 })).toBe('3 habitaciones')
  })

  it('falla si falta la clave o su forma para ese número', () => {
    i18n.addResourceBundle(APP_DEFAULT_LANGUAGE, 'test', { nights_other: '{{count}} noches' })

    expect(() => testUtils.translate('test:missing')).toThrow('Falta el texto «test:missing»')
    expect(() => testUtils.translate('test:nights', { count: 1 })).toThrow('Falta el texto «test:nights»')
  })
})
