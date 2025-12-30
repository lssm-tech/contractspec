import { defineConfig } from 'tsdown';
import { nodeDatabaseLib } from '@contractspec/tool.tsdown';

export default defineConfig(() => ({
  ...nodeDatabaseLib,
  entry: ['src/cli.ts', 'src/index.ts'],
}));
