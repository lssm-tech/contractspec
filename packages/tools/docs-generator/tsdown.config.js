import { defineConfig } from 'tsdown';
import { nodeLib } from '@contractspec/tool.tsdown';

export default defineConfig(() => ({
  ...nodeLib,
  entry: ['src/index.ts'],
}));
