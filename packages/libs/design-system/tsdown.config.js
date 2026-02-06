import { defineConfig, reactLibrary } from '@contractspec/tool.bun';

export default defineConfig({
  ...reactLibrary,
  // Keep platform-specific files in the bundle; exclude tests from entry
  exports: {
    devExports: true
  },
  entry: [
    'src/index.ts',
    // 'src/**/*.ts',
    // 'src/**/*.tsx',
    // '!src/**/*.mobile.tsx',
    // '!src/**/*.test.ts',
    // '!src/**/*.test.tsx',
    // '!src/**/__tests__/**',
  ],
});
