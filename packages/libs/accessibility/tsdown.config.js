import { defineConfig, reactLibrary } from '@contractspec/tool.bun';

export default defineConfig((options) => ({
  ...reactLibrary,
  // inputOptions: {
  //   jsx: 'react', // use classic pragma-based JSX transform
  // },
}));
