import { defineConfig } from 'tsdown';
import { moduleLibrary } from '@lssm/tool.tsdown';

export default defineConfig(() => ({
  ...moduleLibrary,
  platform: 'neutral',
  // entry: ['src/index.ts', 'src/react.ts'],
}));
