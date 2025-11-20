import { defineConfig } from 'tsdown';
import { reactLibrary } from '@lssm/tool.tsdown';

export default defineConfig((options) => ({
  ...reactLibrary,
}));


