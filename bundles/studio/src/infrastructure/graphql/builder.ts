import {
  getDatamodel,
  type PothosPrismaTypes,
  prisma,
} from '@contractspec/lib.database-studio';
import {
  createLoggerTracing,
  createPrismaSchemaBuilder,
} from '@contractspec/lib.graphql-prisma';
import type { Context } from './types';

export const contractSpecStudioSchemaBuilder = createPrismaSchemaBuilder<
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
      console.log(msg, meta as Record<string, unknown>),
  }),
  federation: true,
});

export type ContractSpecStudioSchemaBuilder =
  typeof contractSpecStudioSchemaBuilder;
