import { defineConfig } from 'tsdown';
import { moduleLibrary } from '@lssm/tool.tsdown';

export default defineConfig((options) => ({
  ...moduleLibrary,
  external: ['graphql', '@apollo/subgraph'],
}));
