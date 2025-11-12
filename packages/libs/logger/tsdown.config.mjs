import { defineConfig } from 'tsdown';
import { nodeLib } from '@lssm/tool.tsdown';

export default defineConfig(() => ({
  ...nodeLib,
  // entry: ['src/index.ts', 'src/elysia-plugin.ts'],
}));
