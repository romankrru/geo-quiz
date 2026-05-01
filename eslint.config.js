// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
//#region Imports
import storybook from 'eslint-plugin-storybook'

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import { defineConfig, globalIgnores } from 'eslint/config'
//#endregion

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    //#region simple-import-sort
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side-effect imports: `import 'foo'`.
            ['^\\u0000'],
            // Node builtins: `import fs from 'node:fs'`.
            ['^node:'],
            // External npm: `react`, `clsx`, `@tanstack/...`.
            ['^@?\\w'],
            // Project aliases: `@shared/...`, `@entities/...`.
            ['^@(shared|entities)(/.*|$)'],
            // Parent: `../foo`, `..`.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Sibling: `./foo/bar`, `./foo`, `.`.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Styles last: `*.css`, `*.css.ts`.
            ['^.+\\.css(\\.ts)?$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
    //#endregion
  },
  ...storybook.configs['flat/recommended'],
])
