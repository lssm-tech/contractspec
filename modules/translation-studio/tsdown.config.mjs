import { defineConfig } from 'tsdown';
import { moduleLibrary } from '@contractspec/tool.tsdown';

export default defineConfig(() => ({
  ...moduleLibrary,
  entry: ['src/index.ts', 'src/web/index.ts', 'src/native/index.ts'],
}));
