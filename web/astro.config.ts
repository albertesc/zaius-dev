// kit:if adapterCloudflare
import cloudflare from '@astrojs/cloudflare'
// kit:end
// kit:if content
import mdx from '@astrojs/mdx'
// kit:end
// kit:if adapterNetlify
import netlify from '@astrojs/netlify'
// kit:end
// kit:if adapterNode
import node from '@astrojs/node'
// kit:end
import sitemap from '@astrojs/sitemap'
// kit:if adapterVercel
import vercel from '@astrojs/vercel'
// kit:end
// kit:if backend
import { defineConfig, envField } from 'astro/config'
// kit:else
import { defineConfig } from 'astro/config'
// kit:end
import { APP_DEFAULT_LANGUAGE, APP_LANGUAGES } from './src/constants/appLanguages'

export default defineConfig({
  // kit:if adapterNode
  adapter: node({ mode: 'standalone' }),
  // kit:end
  // kit:if adapterVercel
  adapter: vercel(),
  // kit:end
  // kit:if adapterNetlify
  adapter: netlify(),
  // kit:end
  // kit:if adapterCloudflare
  adapter: process.env.VITEST ? undefined : cloudflare(),
  // kit:end
  integrations: [
    // kit:if content
    mdx(),
    // kit:end
    sitemap(),
  ],
  i18n: {
    locales: [...APP_LANGUAGES],
    defaultLocale: APP_DEFAULT_LANGUAGE,
    routing: { prefixDefaultLocale: false, fallbackType: 'rewrite' },
    fallback: Object.fromEntries(APP_LANGUAGES.filter((language) => language !== APP_DEFAULT_LANGUAGE).map((language) => [language, APP_DEFAULT_LANGUAGE])),
  },
  // kit:if backend
  env: {
    schema: {
      API_URL: envField.string({ context: 'server', access: 'public' }),
      // kit:if mocks
      USE_MOCKS: envField.boolean({ context: 'server', access: 'public', default: false }),
      // kit:end
    },
  },
  // kit:end
})
