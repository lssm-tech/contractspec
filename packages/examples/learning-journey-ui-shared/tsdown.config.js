import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/hooks/index.ts',
    'src/components/index.ts',
    'src/types.ts',
  ],
  format: 'esm',
  target: 'esnext',
  dts: true,
});

