import { defineConfig } from 'tsdown';
import { moduleLibrary, nodeLib } from '@lssm/tool.tsdown';

export default defineConfig(() => ({
  ...moduleLibrary,
  entry: ['src/index.ts', 'src/lib/**/*.ts'],
}));
