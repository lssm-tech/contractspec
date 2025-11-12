import { defineConfig } from 'tsdown';
import { reactLibrary } from '@lssm/tool.tsdown';

export default defineConfig({
  ...reactLibrary,
  // Keep platform-specific files in the bundle; exclude tests from entry
  entry: [
    'src/**/*.ts',
    'src/**/*.tsx',
    // '!src/**/*.mobile.tsx',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
    '!src/**/__tests__/**',
  ],
  exports: {
    all: true,
    devExports: true,
  },
  skipNodeModulesBundle: true,
});
