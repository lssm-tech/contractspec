import { defineConfig } from 'tsdown';
import { nodeDatabaseLib } from '@lssm/tool.tsdown';

export default defineConfig((options) => ({
  ...nodeDatabaseLib,
  entry: ['src/cli.ts', 'src/index.ts'],
}));
