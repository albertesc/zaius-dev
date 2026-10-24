import { APP_LANGUAGES } from '@/constants/appLanguages'
import type { AppLanguage } from '@/constants/appLanguages'

/**
 * Pasa un idioma (del navegador, de la persona o de un enlace) a uno de la app, sin la región.
 * @param language El idioma tal como llega (`es-ES`, `en`), o nada.
 * @returns El idioma de la app, o `null` si no es ninguno de `APP_LANGUAGES`.
 */
function resolveAppLanguage (language: string | null | undefined): AppLanguage | null {
  const base = language?.toLowerCase().split('-')[0]
  return APP_LANGUAGES.find((appLanguage) => appLanguage === base) ?? null
}

export const languageUtils = {
  resolveAppLanguage,
}
