import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/track.ts',
    'src/docs/index.ts',
    'src/docs/quest-challenges.docblock.ts',
  ],
  format: 'esm',
  target: 'esnext',
  dts: true,
});
