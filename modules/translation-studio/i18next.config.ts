import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['fr', 'en'],
  extract: {
    input: [
      'src/**/*.{js,jsx,ts,tsx}',
      '../../apps/web-coliving/src/**/*.{js,jsx,ts,tsx}',
      '../../apps/mobile-coliving/src/**/*.{js,jsx,ts,tsx}',
      '../../bundles/coliving/src/**/*.{js,jsx,ts,tsx}',
    ],
    output: 'src/locales/{{language}}/{{namespace}}.json',
    defaultNS: 'missingNamespace',
    keySeparator: '.',
    nsSeparator: ':',
    contextSeparator: '_',
    functions: ['t', '*.t'],
    transComponents: ['Trans'],
    useTranslationNames: ['useTranslation', 'getT', 'useT'],
    preservePatterns: [
      'common:actions.*',
      'common:dates.*',
      'common:feedback.*',
      'common:filters.*',
      'common:form.*',
      'common:i18n.*',
      'common:navigation.*',
      'common:pagination.*',
      '(.+):enums.*',
    ],
  },
  // types: {
  //   enableSelector: true,
  //   input: ['src/locales/{{language}}/{{namespace}}.json'],
  //   output: 'src/i18next.d.ts',
  // },
  // types: {
  //   input: ['src/locales/fr/*.json'],
  //   output: 'src/types/i18next.d.ts',
  //   resourcesFile: 'src/types/resources.d.ts',
  //   enableSelector: true, // Enable type-safe key selection
  // },
});
