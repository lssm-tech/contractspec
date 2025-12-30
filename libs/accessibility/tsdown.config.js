import { defineConfig } from 'tsdown';
import { reactLibrary } from '@contractspec/tool.tsdown';

export default defineConfig((options) => ({
  ...reactLibrary,
  // inputOptions: {
  //   jsx: 'react', // use classic pragma-based JSX transform
  // },
}));
