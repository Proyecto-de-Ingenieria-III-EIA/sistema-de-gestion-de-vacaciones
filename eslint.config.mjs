import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

const eslintConfig = [
  {
    ignores: ['components/ui/**/*'],
  },
  ...compat.extends(
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: eslintPluginReact,
      '@typescript-eslint': eslintPluginTypescript,
      prettier: eslintPluginPrettier,
      'react-hooks': eslintPluginReactHooks,
    },
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      'no-restricted-imports': ['error', { patterns: ['...*'] }],
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-destructuring': 'warn',
      'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'error',
      'no-nested-ternary': 'warn',
      'react/no-unused-prop-types': 'error',
      'react/hook-use-state': 'error',
      'react/function-component-definition': [
        1,
        { namedComponents: 'arrow-function' },
      ],
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'error',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'no-console': ['error', { allow: ['error'] }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      complexity: ['warn', 10],
      eqeqeq: 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': 'off',
      'func-style': ['error', 'expression'],
    },
  },
  {
    files: ['pages/**/*.{ts,tsx}'],
    rules: {
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'off',
      'arrow-body-style': 'off',
      complexity: ['warn', 20],
    },
  },
];

export default eslintConfig;
