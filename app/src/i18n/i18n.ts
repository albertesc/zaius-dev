import i18next from 'i18next'
import type { Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { APP_DEFAULT_LANGUAGE, APP_LANGUAGES } from '@/constants/appLanguages'
import type { AppLanguage } from '@/constants/appLanguages'
import { languageUtils } from '@/utils/languageUtils'

export type I18nCatalog = { [key: string]: string | I18nCatalog }

const catalogs = import.meta.glob<I18nCatalog>('/src/**/i18n/*.json', { eager: true, import: 'default' })

/**
 * Da el namespace de un catálogo por su carpeta: la feature, la familia de un `common`, el dominio o `common` en la raíz.
 * @param path La ruta del JSON (`/src/features/orders/common/i18n/es.json`).
 * @returns El namespace (`orders`).
 */
function getI18nNamespace (path: string): string {
  const segments = path.split('/')
  const owner = segments.at(-3) ?? ''
  if (owner === 'src') return 'common'
  return owner === 'common' ? segments.at(-4) ?? owner : owner
}

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
 * Suma dos catálogos del mismo namespace, grupo a grupo: el índice de una familia, su `common` y el dominio que se llama como ella comparten el suyo.
 * @param target El catálogo que ya hay.
 * @param source El que se suma; en una clave repetida, gana el suyo (la comprobación de la estructura no deja repetir).
 * @returns Los dos juntos.
 */
function mergeCatalogs (target: I18nCatalog, source: I18nCatalog): I18nCatalog {
  return Object.fromEntries([...new Set([...Object.keys(target), ...Object.keys(source)])].map((key) => {
    const current = target[key]
    const added = source[key]
    return [key, typeof current === 'object' && typeof added === 'object' ? mergeCatalogs(current, added) : added ?? current ?? '']
  }))
}

/**
 * Junta los catálogos de la app por idioma y namespace, para i18next; los de varias carpetas con el mismo namespace se suman.
 * @param files Los `<idioma>.json` de cada carpeta `i18n/`, por su ruta; los de un idioma que no es de la app no cuentan.
 * @returns Los recursos de i18next, con las formas `_many` añadidas.
 */
export function buildI18nResources (files: Record<string, I18nCatalog>): Resource {
  const catalogs: Record<string, Record<string, I18nCatalog>> = {}
  for (const [path, catalog] of Object.entries(files)) {
    const language = languageUtils.resolveAppLanguage(path.slice(path.lastIndexOf('/') + 1, -'.json'.length))
    if (language === null) continue
    const namespace = getI18nNamespace(path)
    const byNamespace = catalogs[language] ?? {}
    byNamespace[namespace] = mergeCatalogs(byNamespace[namespace] ?? {}, addManyPlurals(catalog))
    catalogs[language] = byNamespace
  }
  return catalogs
}

/**
 * Elige el idioma con el que arranca la app: el del navegador si es uno de la app.
 * @returns El idioma del navegador, o el idioma por defecto si no es de la app.
 */
export function getInitialAppLanguage (): AppLanguage {
  return languageUtils.resolveAppLanguage(navigator.language) ?? APP_DEFAULT_LANGUAGE
}

export const i18n = i18next.use(initReactI18next)

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
})

i18n.init({
  resources: buildI18nResources(catalogs),
  lng: getInitialAppLanguage(),
  fallbackLng: APP_DEFAULT_LANGUAGE,
  supportedLngs: [...APP_LANGUAGES],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  initAsync: false,
})
