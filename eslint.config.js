import pluginReact from 'eslint-plugin-react'

import js from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  {
    extends: ['js/recommended'],
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ignores: ['dist/**', 'node_modules/**'],
    plugins: { js },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ignores: ['dist/**', 'node_modules/**'],
    plugins: {
      perfectionist,
    },
    rules: {
      'perfectionist/sort-classes': ['error', { type: 'alphabetical' }],
      'perfectionist/sort-imports': [
        'error',
        {
          customGroups: {
            type: {
              react: 'react',
            },
            value: {
              react: ['react', 'react-*'],
            },
          },
          groups: [
            'type',
            'react',
            'internal-type',
            'internal',
            'external-type',
            'external',
            'parent-type',
            'parent',
            'sibling-type',
            'sibling',
            'index-type',
            'index',
          ],
          newlinesBetween: 'never',
          type: 'alphabetical',
        },
      ],
      'perfectionist/sort-interfaces': ['error', { type: 'alphabetical' }],
      'perfectionist/sort-jsx-props': ['error', { type: 'alphabetical' }],
      'perfectionist/sort-named-imports': ['error', { type: 'alphabetical' }],
      'perfectionist/sort-object-types': ['error', { type: 'alphabetical' }],
      'perfectionist/sort-objects': ['error', { type: 'alphabetical' }],
      'react/react-in-jsx-scope': 'off',
    },
  },
])
