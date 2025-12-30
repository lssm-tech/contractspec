import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
// import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prismaClientSingleton = () => {
  const rawConnectionString =
    process.env.CONTRACTSPEC_STUDIO_POSTGRES_PRISMA_URL;
  if (!rawConnectionString) {
    throw new Error('Missing env: CONTRACTSPEC_STUDIO_POSTGRES_PRISMA_URL');
  }

  const connectionString = rawConnectionString.replaceAll(
    'sslmode=require',
    'sslmode=disable'
  );
  const adapter = new PrismaPg({
    connectionString,
  });

  return new PrismaClient({ adapter });
};

export const prisma =
  //   globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());
  globalForPrisma.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
