import { defineConfig } from 'tsdown';
import { reactLibrary, withDevExports } from '@lssm/tool.tsdown';

export default defineConfig({
  ...reactLibrary,
  ...withDevExports,
  entry: [
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
});

