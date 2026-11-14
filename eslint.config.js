import js from '@eslint/js';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import eslintParserTypescript from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist/', 'node_modules/'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
      },
      parser: eslintParserTypescript,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...eslintPluginTypescript.configs.recommended.rules,
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      'no-console': 'warn',
      semi: ['error', 'always'],
    },
  },
];
