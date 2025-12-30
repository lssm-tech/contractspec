// Set dummy env var using a value that satisfies the Prisma client check
process.env.CONTRACTSPEC_STUDIO_POSTGRES_PRISMA_URL =
  'postgresql://postgres:postgres@localhost:5432/studio';
console.log('[library env-setup] Env var set');
