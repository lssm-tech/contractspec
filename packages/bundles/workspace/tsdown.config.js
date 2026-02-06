import { defineConfig, moduleLibrary } from '@contractspec/tool.bun';

export default defineConfig(() => ({
  ...moduleLibrary,
  platform: 'node',
  entry: ['src/index.ts'],
}));









