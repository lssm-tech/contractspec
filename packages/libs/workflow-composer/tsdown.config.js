import { defineConfig } from 'tsdown';
import { moduleLibrary } from '@contractspec/tool.tsdown';

export default defineConfig(() => ({
  ...moduleLibrary,
  platform: 'neutral',
  entry: ['src/index.ts'],
}));































