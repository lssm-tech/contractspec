import { defineConfig, nodeLib } from '@contractspec/tool.bun';

export default defineConfig(() => ({
  ...nodeLib,
  // entry: ['src/index.ts', 'src/elysia-plugin.ts'],
}));
