import { defineConfig } from 'tsdown';
import { moduleLibrary, withDevExports } from '@lssm/tool.tsdown';

export default defineConfig(() => ({
  ...moduleLibrary,
  ...withDevExports,
}));



