import { defineConfig, moduleLibrary } from '@contractspec/tool.bun';

export default defineConfig((options) => ({
  ...moduleLibrary,
  external: ['graphql', '@apollo/subgraph'],
}));
