// import { PrismaClient } from '@prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';
//
// type GlobalWithDb = typeof globalThis & { __lssm_db?: PrismaClient };
// const g = global as GlobalWithDb;
//
// export function createPrismaClientFromEnv(
//   envVar: string,
//   fallback?: string
// ): PrismaClient {
//   const raw =
//     process.env[envVar] || (fallback ? process.env[fallback] : undefined);
//   if (!raw)
//     throw new Error(
//       `Missing database URL env: ${envVar}${fallback ? ` (or ${fallback})` : ''}`
//     );
//   const connectionString = `${raw}`.replaceAll(
//     'sslmode=require',
//     'sslmode=disable'
//   );
//   const adapter = new PrismaPg({ connectionString });
//   return new PrismaClient({ adapter });
// }
//
// export function getSingletonClient(envVar = 'DATABASE_URL'): PrismaClient {
//   if (!g.__lssm_db) {
//     g.__lssm_db = createPrismaClientFromEnv(envVar);
//   }
//   return g.__lssm_db;
// }
