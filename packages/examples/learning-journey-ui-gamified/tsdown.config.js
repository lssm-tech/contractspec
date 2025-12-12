import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/views/index.ts',
    'src/components/index.ts',
  ],
  format: 'esm',
  target: 'esnext',
  dts: true,
});

