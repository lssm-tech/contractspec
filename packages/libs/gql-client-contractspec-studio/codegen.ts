import type { CodegenConfig } from '@graphql-codegen/cli';
import { GeoJSONResolver } from 'graphql-scalars';
import { ScalarTypeEnum } from '@lssm/lib.schema';

const schemaSources = [
  // Prefer local schema (workspace) to avoid requiring a running server
  '../../apps/api-contractspec/schema.graphql',
];
if (process.env.GQL_SCHEMA_URL) {
  schemaSources.unshift(process.env.GQL_SCHEMA_URL);
}

const config: CodegenConfig = {
  schema: schemaSources,
  documents: [
    // '../../apps/mobile-app-strit/src/**/*.tsx',
    // '../../apps/mobile-app-strit/src/**/*.ts',
    '!../../apps/api-constractspec/src/**/*.test.ts',
    '../../apps/api-constractspec/src/**/*.ts',
    '../../apps/api-constractspec/src/**/*.tsx',
    '!../../apps/web-landing/src/**/*.test.ts',
    '../../apps/web-landing/src/**/*.ts',
    '../../apps/web-landing/src/**/*.tsx',
    '!../../bundles/contractspec-studio/src/**/*.test.ts',
    '../../bundles/contractspec-studio/src/**/*.ts',
    '../../bundles/contractspec-studio/src/**/*.tsx',
    'src/**/*.tsx',
    'src/**/*.ts',
    '!src/gql/**/*',
  ],
  generates: {
    './src/gql/': {
      preset: 'client',
      config: {
        useTypeImports: true,
        documentMode: 'string',
        avoidOptionals: false,
        flattenGeneratedTypes: true,
        scalars: {
          JSON: {
            input: 'string',
            output: 'string',
          },
          Date: {
            input: 'string',
            output: 'string',
          },
          EmailAddress: {
            input: 'string',
            output: 'string',
          },
          Locale: {
            input: 'string',
            output: 'string',
          },
          URL: {
            input: 'string',
            output: 'string',
          },
          GeoJSON: GeoJSONResolver.extensions.codegenScalarType,
          // RecurrenceFrequency: ScalarTypeEnum.RecurrenceFrequency().extensions.codegenScalarType,
          // Weekday: ScalarTypeEnum.Weekday().extensions.codegenScalarType,
          ...Object.entries(ScalarTypeEnum).reduce((acc, [key, value]) => {
            acc[key] = value().extensions.codegenScalarType;
            return acc;
          }, {}),
        },
      },
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: 'getFragmentData' },
      },
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
};

export default config;
