import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/entities/index.ts', 'src/contracts/index.ts', 'src/events.ts', 'src/handlers/index.ts', 'src/presentations/index.ts', 'src/feature.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'esnext',
  external: [
    '@lssm/lib.schema',
    '@lssm/lib.contracts',
    '@lssm/lib.bus',
    '@lssm/lib.identity-rbac',
    '@lssm/lib.jobs',
    '@lssm/module.audit-trail',
    '@lssm/module.notifications',
    'zod',
  ],
});

