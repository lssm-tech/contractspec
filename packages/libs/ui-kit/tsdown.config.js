import { defineConfig, reactLibrary } from '@contractspec/tool.bun';

export default defineConfig({
  ...reactLibrary,
  entry: [
    'ui/**/*.ts',
    'ui/**/*.tsx',
    'index.ts',
    '!ui/**/*.test.ts',
    '!ui/**/*.test.tsx',
    '!ui/**/__tests__/**',
  ],
});

