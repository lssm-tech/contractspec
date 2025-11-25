import { defineConfig } from 'tsdown';
import { moduleLibrary, nodeLib } from '@lssm/tool.tsdown';

export default defineConfig(() => ({
  ...moduleLibrary,
  entry: ['src/index.ts'],
  external: [...nodeLib.external, '@apollo/client'],
  exports: {
    all: true,
    devExports: true,
  },
  skipNodeModulesBundle: true,
}));
