import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma', 'schema'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    // seed: "bun run prisma/seed.ts",
  },
  datasource: {
    url: process.env.CONTRACTSPEC_STUDIO_POSTGRES_NON_POOLING!,
  },
});
