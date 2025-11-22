import { defineConfig } from 'tsdown';
import { moduleLibrary } from '@lssm/tool.tsdown';

export default defineConfig(() => ({
  ...moduleLibrary,
  exports: {
    all: true,
    devExports: true,
  },
  skipNodeModulesBundle: true,
}));

