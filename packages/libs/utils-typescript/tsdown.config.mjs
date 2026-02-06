import { defineConfig, moduleLibrary, nodeLib } from '@contractspec/tool.bun';

export default defineConfig(() => ({
  ...moduleLibrary,
  entry: ['src/index.ts', 'src/lib/**/*.ts'],
}));
