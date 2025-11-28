import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/entities/index.ts', 'src/contracts/index.ts', 'src/events.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
});

