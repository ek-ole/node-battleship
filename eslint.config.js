import js from '@eslint/js';
import typescript from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['server/**/*.ts'],
    languageOptions: {
      parser: typescript,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        Buffer: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'off',
    },
  },
];
