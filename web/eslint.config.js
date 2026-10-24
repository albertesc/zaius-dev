import neostandard from 'neostandard'
import astro from 'eslint-plugin-astro'

export default [
  {
    ignores: [
      'dist',
      'coverage',
      '.astro',
    ],
  },
  ...neostandard({
    ts: true,
    filesTs: [
      '**/*.astro',
    ],
  }),
  ...astro.configs.recommended,
  {
    rules: {
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
    },
  },
  {
    files: ['**/*.{ts,tsx,astro}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]
