import { defineConfig } from 'tsdown';
import { moduleLibrary } from '@contractspec/tool.tsdown';

export default defineConfig((options) => ({
  ...moduleLibrary,
  external: ['graphql', '@apollo/subgraph'],
}));
