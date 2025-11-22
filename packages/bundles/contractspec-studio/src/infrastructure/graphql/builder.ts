import {
  getDatamodel,
  type PothosPrismaTypes,
  prisma,
} from '@lssm/lib.database-contractspec-studio';
import { createPrismaSchemaBuilder } from '@lssm/lib.graphql-prisma';
import { createLoggerTracing } from '@lssm/lib.graphql-prisma';
import type { Context } from './types';

export const gqlSchemaBuilder = createPrismaSchemaBuilder<
  Context,
  PothosPrismaTypes
>({
  prisma: {
    client: prisma,
    dmmf: getDatamodel(),
    exposeDescriptions: true,
    filterConnectionTotalCount: true,
    onUnusedQuery: process.env.NODE_ENV === 'production' ? null : 'warn',
  },
  complexity: {
    defaultComplexity: 1,
    defaultListMultiplier: 10,
  },
  tracing: createLoggerTracing({
    info: (msg: string, meta?: unknown) =>
      console.log(msg, meta as Record<string, any>),
  }),
  federation: true,
});

export type StritSchemaBuilder = typeof gqlSchemaBuilder;
