import i18next from 'i18next'
import type { Resource, TFunction } from 'i18next'
import { APP_DEFAULT_LANGUAGE, APP_LANGUAGES } from '@/constants/appLanguages'
import { languageUtils } from '@/utils/languageUtils'

export type I18nCatalog = { [key: string]: string | I18nCatalog }

const catalogs = import.meta.glob<I18nCatalog>('/src/i18n/*.json', { eager: true, import: 'default' })

/**
 * Copia cada forma `_other` en `_many`, la que usan para los números grandes idiomas como el castellano, para escribir solo `_one` y `_other`.
 * @param catalog El catálogo, o uno de sus grupos.
 * @returns El catálogo con las formas `_many` que le faltan.
 */
function addManyPlurals (catalog: I18nCatalog): I18nCatalog {
  return Object.fromEntries(Object.entries(catalog).flatMap(([key, value]): Array<[string, string | I18nCatalog]> => {
    if (typeof value !== 'string') return [[key, addManyPlurals(value)]]
    const many = key.replace(/_other$/, '_many')
    return many !== key && !(many in catalog) ? [[key, value], [many, value]] : [[key, value]]
  }))
}

/**
 * Junta los catálogos de la app por idioma, para i18next.
 * @param files Los `<idioma>.json` de `src/i18n/`, por su ruta; los de un idioma que no es de la app no cuentan.
 * @returns Los recursos de i18next, con las formas `_many` añadidas.
 */
export function buildI18nResources (files: Record<string, I18nCatalog>): Resource {
  const resources: Resource = {}
  for (const [path, catalog] of Object.entries(files)) {
    const language = languageUtils.resolveAppLanguage(path.slice(path.lastIndexOf('/') + 1, -'.json'.length))
    if (language !== null) resources[language] = { translation: addManyPlurals(catalog) }
  }
  return resources
}

export const i18n = i18next.createInstance()

i18n.init({
  resources: buildI18nResources(catalogs),
  fallbackLng: APP_DEFAULT_LANGUAGE,
  supportedLngs: [...APP_LANGUAGES],
  interpolation: { escapeValue: false },
  initAsync: false,
})

/**
 * Da la función de traducir de un idioma, para una petición: en una página, con `Astro.currentLocale`.
 * @param locale El idioma de la petición; uno que no es de la app usa el idioma por defecto.
 * @returns `t`, fija a ese idioma.
 */
export function getI18nT (locale: string | undefined): TFunction {
  return i18n.getFixedT(languageUtils.resolveAppLanguage(locale ?? '') ?? APP_DEFAULT_LANGUAGE)
}
