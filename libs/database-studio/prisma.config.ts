import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
    // seed: "bun run prisma/seed.ts",
  },
  datasource: {
    url: process.env.CONTRACTSPEC_STUDIO_POSTGRES_PRISMA_URL,
  },
});
