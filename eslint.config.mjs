/* eslint-disable no-redeclare */
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
    },

    languageOptions: {
      globals: {
        ...Object.fromEntries(
          Object.entries(globals.browser).map(([key]) => [key, 'off'])
        ),
        ...globals.node,
        __filename: 'readonly', // Allow __filename in ES module context
        __dirname: 'readonly',
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'commonjs',

      parserOptions: {
        project: './tsconfig.json',
      },
    },

    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'no-shadow': 'off',
      'no-use-before-define': 'off',
      'prefer-object-spread': 'off',
      'node/no-unpublished-import': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
