const ASTRO_CONFIG = /^astro\.config\.(mjs|ts|js|mts|cjs)$/

const CONTENT_CONFIG = /^content\.config\.(ts|js|mjs|mts)$/

const SERVER_OUTPUT = /output\s*:\s*['"]server['"]/

const ADAPTERS = ['@astrojs/node', '@astrojs/vercel', '@astrojs/netlify', '@astrojs/cloudflare']

/**
 * Lee las dependencias de un `package.json`, también las de desarrollo.
 * @param packageJson El contenido del `package.json`, o `null`.
 * @returns Las dependencias por nombre; ninguna si no hay fichero o no es un JSON válido.
 */
function readDependencies (packageJson) {
  try {
    const { dependencies, devDependencies } = JSON.parse(packageJson ?? '{}')
    return { ...dependencies, ...devDependencies }
  } catch {
    return {}
  }
}

/**
 * Averigua el tipo de un proyecto: una web si usa Astro (lo tiene en sus dependencias o tiene un `astro.config.*`); si no, una app si usa React.
 * @param names Los ficheros de la carpeta del proyecto.
 * @param packageJson El contenido de su `package.json`, o `null`.
 * @returns `web` o `app`, o `null` si nada lo dice.
 */
export function detectType (names, packageJson) {
  const dependencies = readDependencies(packageJson)
  if (Object.hasOwn(dependencies, 'astro') || names.some((name) => ASTRO_CONFIG.test(name))) return 'web'
  return Object.hasOwn(dependencies, 'react') ? 'app' : null
}

/**
 * Lee las respuestas de una web de un proyecto Astro: si tiene servidor, por su adaptador o su configuración, y si tiene contenido, por sus colecciones o MDX.
 * @param options `packageJson`, el contenido de su `package.json`; `configText`, el de su `astro.config.*` (o `null`); `srcNames`, los ficheros de su `src/`.
 * @returns `answers` (`server` y `content`) y `known`, las que su código ya fija: el servidor y el contenido, si los tiene.
 */
export function detectWebAnswers ({ packageJson, configText, srcNames }) {
  const dependencies = readDependencies(packageJson)
  const server = ADAPTERS.some((name) => Object.hasOwn(dependencies, name)) || SERVER_OUTPUT.test(configText ?? '')
  const content = Object.hasOwn(dependencies, '@astrojs/mdx') || srcNames.some((name) => CONTENT_CONFIG.test(name))
  return {
    answers: { server, content },
    known: { ...(server ? { server } : {}), ...(content ? { content } : {}) },
  }
}
