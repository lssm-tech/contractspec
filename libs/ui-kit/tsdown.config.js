import { defineConfig } from 'tsdown';
import { reactLibrary } from '@contractspec/tool.tsdown';

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

