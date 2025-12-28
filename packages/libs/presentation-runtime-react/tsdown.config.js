import { defineConfig } from 'tsdown';
import { reactLibrary } from '@contractspec/tool.tsdown';

export default defineConfig((options) => ({
  ...reactLibrary,
}));


