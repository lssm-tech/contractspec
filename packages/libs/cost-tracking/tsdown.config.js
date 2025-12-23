import { defineConfig } from 'tsdown';
import { moduleLibrary } from '@lssm/tool.tsdown';

export default defineConfig(() => ({
  ...moduleLibrary,
  entry: ['src/index.ts'],
}));
