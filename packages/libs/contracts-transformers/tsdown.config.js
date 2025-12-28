import { defineConfig } from 'tsdown';
import { moduleLibrary } from '@contractspec/tool.tsdown';

export default defineConfig({
  ...moduleLibrary,
  entry: ['src/index.ts', 'src/openapi/index.ts', 'src/common/index.ts'],
});

