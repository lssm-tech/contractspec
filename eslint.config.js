import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import json from '@eslint/json';
// import css from '@eslint/css';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
// import * as reactHooks from 'eslint-plugin-react-hooks';
import i18next from 'eslint-plugin-i18next';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig([
  {
    languageOptions: { globals: globals.browser },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
  },
  i18next.configs['flat/recommended'],
  {
    // Global default: off (too noisy). Opt-in per app below.
    // rules: { 'i18next/no-literal-string': ['error', { mode: 'all' }] },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  // tseslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  // pluginReact.configs.flat.recommended,
  // reactHooks.configs['recommended-latest'],
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // ... any rules you want
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      // Accessibility defaults
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/label-has-associated-control': ['error', { depth: 3 }],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      // Prevent cross-target imports: web apps must not import RN kit; native must not import web kit
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@lssm/lib.ui-kit',
              message:
                'Do not import native ui-kit in web code. Use @lssm/lib.ui-kit-web or @lssm/lib.design-system.',
            },
            {
              name: '@lssm/lib.ui-kit-web',
              message:
                'Do not import web ui-kit in native code directly. DS and Metro aliasing will map web → native.',
            },
          ],
        },
      ],
      // Atomic design enforcement
      // 'max-lines-per-function': [
      //   'error',
      //   { max: 100, skipBlankLines: true, skipComments: true },
      // ],
      // 'max-lines': [
      //   'error',
      //   { max: 300, skipBlankLines: true, skipComments: true },
      // ],
    },
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
    rules: {
      'i18next/no-literal-string': 'off',
    },
  },
  {
    files: ['**/*.jsonc'],
    plugins: { json },
    language: 'json/jsonc',
    extends: ['json/recommended'],
    rules: {
      'i18next/no-literal-string': 'off',
    },
  },
  {
    files: ['**/*.json5'],
    plugins: { json },
    language: 'json/json5',
    extends: ['json/recommended'],
    rules: {
      'i18next/no-literal-string': 'off',
    },
  },
  // {
  //   files: ['**/*.css'],
  //   plugins: { css },
  //   language: 'css/css',
  //   extends: ['css/recommended'],
  //   rules: {
  //     'i18next/no-literal-string': 'off',
  //     'react/display-name': 'off',
  //   },
  // },
  eslintPluginPrettierRecommended,
  {
    files: ['packages/artisanos/apps/web-artisan/src/components/**/*.{ts,tsx}'],
    rules: {
      // Only allow thin consumers/imports, discourage heavy logic
      // 'no-restricted-imports': [
      //   'error',
      //   {
      //     patterns: [
      //       {
      //         group: ['**/lib/**', '**/hooks/**', '**/services/**'],
      //         message:
      //           'Keep heavy logic out of web-artisan/components. Use @lssm/bundle.artisan or DS.',
      //       },
      //     ],
      //   },
      // ],
    },
  },
  {
    files: ['packages/hcircle/apps/web-coliving/src/**/*.{ts,tsx,js,jsx}'],
    rules: {
      // Enforce i18n for user-visible strings in JSX for web-coliving
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-text-only',
          markupOnly: true,
          ignoreAttribute: [
            'className',
            'data-*',
            'aria-*',
            'id',
            'href',
            'src',
            'role',
            'alt',
            'title',
          ],
          ignore: [
            // Allow small UI tokens and formatting strings
            '^[-–—…•→←↑↓→]$',
            '^[#@]$',
          ],
        },
      ],
      // Prevent tiny text in main content (heuristic): flag text-xs usage
      // 'no-restricted-syntax': [
      //   'warn',
      //   {
      //     selector:
      //       "JSXAttribute[name.name='className'][value.value=/text-xs/][parent.parent.openingElement.name.name=/^(div|main|section)$/]",
      //     message:
      //       'Avoid text-xs in main content. Use Section (defaults to text-lg) or bump to text-base/lg. See docs/tech/typography-scale.md.',
      //   },
      // ],
    },
  },
  {
    files: ['packages/strit/apps/web-strit/src/**/*.{ts,tsx,js,jsx}'],
    rules: {
      // Enforce i18n for user-visible strings in JSX for web-coliving
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-text-only',
          markupOnly: true,
          ignoreAttribute: [
            'className',
            'data-*',
            'aria-*',
            'id',
            'href',
            'src',
            'role',
            'alt',
            'title',
          ],
          ignore: [
            // Allow small UI tokens and formatting strings
            '^[-–—…•→←↑↓→]$',
            '^[#@]$',
          ],
        },
      ],
    },
  },
]);
