export const APP_LANGUAGES = [%%LANGUAGES_TS%%] as const

export type AppLanguage = (typeof APP_LANGUAGES)[number]

export const APP_DEFAULT_LANGUAGE: AppLanguage = APP_LANGUAGES[0]
