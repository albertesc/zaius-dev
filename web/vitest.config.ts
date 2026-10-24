/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config'

export default getViteConfig({
  test: {
    setupFiles: ['./src/tests/setup.ts'],
    fsModuleCache: false,
    env: {
      TZ: '%%TEST_TIMEZONE%%',
    },
  },
})
