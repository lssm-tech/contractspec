import { defineConfig } from 'tsdown';
import { moduleLibrary } from '@contractspec/tool.tsdown';

export default defineConfig(() => ({
  ...moduleLibrary,
  platform: 'node',
  entry: ['src/index.ts'],
}));































