import { defineConfig, reactLibrary, withDevExports } from '@contractspec/tool.bun';

export default defineConfig({
  ...reactLibrary,
  ...withDevExports,
  entry: [
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
});

