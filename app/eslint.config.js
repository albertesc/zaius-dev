import neostandard from 'neostandard'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  { ignores: ['dist', 'coverage'] },
  ...neostandard({ ts: true }),
  reactHooks.configs.flat.recommended,
  {
    rules: {
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      '@stylistic/jsx-closing-bracket-location': ['error', 'tag-aligned'],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]
