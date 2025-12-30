import { defineConfig } from 'tsdown';
import { nodeDatabaseLib } from '@contractspec/tool.tsdown';

export default defineConfig((options) => ({
  ...nodeDatabaseLib,
  entry: ['src/cli.ts', 'src/index.ts'],
}));
