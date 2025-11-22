import { defineConfig } from 'tsdown';
import { nodeDatabaseLib } from '@lssm/tool.tsdown';

export default defineConfig(() => ({
  ...nodeDatabaseLib,
  entry: ['src/cli.ts', 'src/index.ts'],
}));
