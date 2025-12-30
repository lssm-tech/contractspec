import { defineConfig } from 'tsdown';
import { nodeDatabaseLib } from '@contractspec/tool.tsdown';

export default defineConfig((options) => ({
  ...nodeDatabaseLib,
}));
