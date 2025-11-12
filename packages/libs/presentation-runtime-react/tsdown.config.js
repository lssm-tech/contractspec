import { defineConfig } from 'tsdown';
import { reactLibrary } from '@lssm/tool.tsdown';

export default defineConfig((options) => ({
  ...reactLibrary,
  exports: {
    all: true,
    devExports: true,
  },
  skipNodeModulesBundle: true,
}));


