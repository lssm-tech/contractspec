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
    files: ['packages/apps/*/src/components/**/*.{ts,tsx}'],
    rules: {
      // Only allow thin consumers/imports, discourage heavy logic
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/lib/**', '**/hooks/**', '**/services/**'],
              message:
                'Keep heavy logic out of web-artisan/components. Use @contractspec/bundle.artisan or DS.',
            },
          ],
        },
      ],
    },
  },
]);
