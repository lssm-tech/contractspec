import { defineConfig, moduleLibrary, withDevExports } from '@contractspec/tool.bun';

export default defineConfig(() => ({
  ...moduleLibrary,
  ...withDevExports,
}));
