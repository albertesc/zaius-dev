import { describe, expect, it } from 'vitest'
import { APP_LANGUAGES } from '@/constants/appLanguages'
import { languageUtils } from './languageUtils'

describe('resolveAppLanguage', () => {
  it('reconoce cada idioma de la app, con región o sin ella y en mayúsculas', () => {
    for (const language of APP_LANGUAGES) {
      expect(languageUtils.resolveAppLanguage(language)).toBe(language)
      expect(languageUtils.resolveAppLanguage(`${language}-XX`)).toBe(language)
      expect(languageUtils.resolveAppLanguage(language.toUpperCase())).toBe(language)
    }
  })

  it('da null con un idioma que no es de la app o sin idioma', () => {
    expect(languageUtils.resolveAppLanguage('zz-ZZ')).toBeNull()
    expect(languageUtils.resolveAppLanguage('')).toBeNull()
    expect(languageUtils.resolveAppLanguage(null)).toBeNull()
    expect(languageUtils.resolveAppLanguage(undefined)).toBeNull()
  })
})
