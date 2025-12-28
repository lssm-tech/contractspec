import { defineConfig } from 'tsdown';
import { moduleLibrary, withDevExports } from '@contractspec/tool.tsdown';

export default defineConfig((options) => ({
  ...moduleLibrary,
  ...withDevExports,
}));
