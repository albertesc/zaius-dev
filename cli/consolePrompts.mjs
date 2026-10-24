import { realpathSync } from 'node:fs'

/**
 * Adapta el módulo de preguntas a la salida: en una terminal, tal cual; fuera de ella (un log, la verificación), el progreso va en líneas sueltas, sin animación.
 * @param prompts El módulo de preguntas (`@clack/prompts`).
 * @param isTTY Si la salida es una terminal.
 * @returns El módulo que usan las órdenes.
 */
export function createConsolePrompts (prompts, isTTY) {
  if (isTTY) return prompts
  const spinner = () => ({
    start: (message) => prompts.log.step(message),
    stop: (message) => prompts.log.success(message),
    error: (message) => prompts.log.error(message),
  })
  return { ...prompts, spinner }
}

/**
 * Da la ruta real de la carpeta del proyecto, sin nombres cortos de Windows (`USUARI~1`) con los que Vitest no arranca.
 * @param projectDir La carpeta, tal como llega.
 * @returns La ruta larga, o la misma si no existe.
 */
export function resolveProjectDir (projectDir) {
  try {
    return realpathSync.native(projectDir)
  } catch {
    return projectDir
  }
}
