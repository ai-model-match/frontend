// eslint.config.js
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/*.d.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      prettier: eslintPluginPrettier,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: true,
          trailingComma: 'es5',
          printWidth: 90,
          tabWidth: 2,
          endOfLine: 'auto',
          bracketSpacing: true,
          arrowParens: 'always',
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['external', 'builtin', 'internal', 'sibling', 'parent', 'index'],
          pathGroups: [
            {
              pattern: 'context',
              group: 'internal',
            },
            {
              pattern: 'locales',
              group: 'internal',
            },
            {
              pattern: 'types',
              group: 'internal',
            },
            {
              pattern: 'styles',
              group: 'internal',
            },
            {
              pattern: 'dtos',
              group: 'internal',
            },
            {
              pattern: 'utils',
              group: 'internal',
            },
            {
              pattern: 'entities',
              group: 'internal',
            },
            {
              pattern: 'guards',
              group: 'internal',
            },
            {
              pattern: 'services',
              group: 'internal',
            },
            {
              pattern: 'components',
              group: 'internal',
            },
            {
              pattern: 'pages',
              group: 'internal',
            },
            {
              pattern: 'assets/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['internal'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
