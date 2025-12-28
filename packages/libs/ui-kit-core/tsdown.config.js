import { defineConfig } from 'tsdown';
import { reactLibrary, withDevExports } from '@contractspec/tool.tsdown';

export default defineConfig({
  ...reactLibrary,
  ...withDevExports,
  entry: [
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
});

