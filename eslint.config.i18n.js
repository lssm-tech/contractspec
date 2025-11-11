import globals from 'globals';
import { defineConfig } from 'eslint/config';
import i18next from 'eslint-plugin-i18next';
import tseslint from 'typescript-eslint';

export default defineConfig([
  i18next.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['packages/artisanos/apps/web-artisan/src/**/*.{ts,tsx,js,jsx}'],
    rules: {
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
          ignore: ['^[-–—…•→←↑↓→]$', '^[#@]$'],
        },
      ],
    },
  },
  tseslint.configs.base,
  // tseslint.configs.stylistic,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: ['packages/artisanos/apps/web-artisan/src/components/**/*.{ts,tsx}'],
    rules: {
      // Only allow thin consumers/imports, discourage heavy logic
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/lib/**', '**/hooks/**', '**/services/**'],
              message:
                'Keep heavy logic out of web-artisan/components. Use @lssm/bundle.artisan or DS.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/hcircle/apps/web-coliving/src/**/*.{ts,tsx,js,jsx}'],
    rules: {
      // Some projects still reference this rule but plugin isn't installed in all workspaces
      'react-hooks/exhaustive-deps': 'off',
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
            // Common icon glyphs used in buttons or badges
            '^[✕×✖★🗑️∞👍👎]$',
          ],
        },
      ],
      // Prevent tiny text in main content (heuristic): flag text-xs usage
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            "JSXAttribute[name.name='className'][value.value=/text-xs/][parent.parent.openingElement.name.name=/^(div|main|section)$/]",
          message:
            'Avoid text-xs in main content. Use Section (defaults to text-lg) or bump to text-base/lg. See docs/tech/typography-scale.md.',
        },
      ],
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
