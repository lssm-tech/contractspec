import SchemaBuilder, { type SchemaTypes } from '@pothos/core';
import PrismaPlugin, { type PrismaClient } from '@pothos/plugin-prisma';
import ComplexityPlugin from '@pothos/plugin-complexity';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import RelayPlugin from '@pothos/plugin-relay';
import TracingPlugin, {
  isRootField,
  wrapResolver,
} from '@pothos/plugin-tracing';
import '@pothos/plugin-prisma';
import '@pothos/plugin-relay';
import '@pothos/plugin-complexity';
import { GeoJSONResolver } from 'graphql-scalars';
import { ScalarTypeEnum } from '@lssm/lib.schema';

export interface PrismaBuilderOptions {
  complexity?: {
    defaultComplexity?: number;
    defaultListMultiplier?: number;
  };
  tracing?: {
    enableByDefault?: boolean;
    onResolved?: (
      parentType: string,
      fieldName: string,
      durationMs: number
    ) => void;
  };
  federation?: boolean;
  prisma: {
    client: PrismaClient;
    dmmf?: unknown;
    exposeDescriptions?: boolean;
    filterConnectionTotalCount?: boolean;
    onUnusedQuery?: 'warn' | null;
  };
}

export function createPrismaSchemaBuilder<
  C extends object,
  PT extends {} | undefined,
  Objects extends object = object,
  Scalars extends object = object,
>(options: PrismaBuilderOptions) {
  // const plugins: (keyof PothosSchemaTypes.Plugins<SchemaTypes>)[] = [
  const plugins = [
    RelayPlugin,
    ComplexityPlugin,
    TracingPlugin,
    DataloaderPlugin,
    PrismaPlugin,
  ] satisfies (keyof PothosSchemaTypes.Plugins<SchemaTypes>)[];
  // if (options.federation) plugins.push(FederationPlugin);

  const builder = new SchemaBuilder<{
    DefaultInputFieldRequiredness: true;
    PrismaTypes: PT;
    Context: C;
    Objects: Objects;
    Scalars: {
      JSON: { Input: unknown; Output: unknown };
      Date: { Input: Date; Output: Date };
      EmailAddress: { Input: string; Output: string };
      Locale: { Input: string; Output: string };
      URL: { Input: string; Output: string };
      GeoJSON: { Input: string; Output: string };
    } & Scalars;
    ObjectType: { CommunityRule: { id: string } };
  }>({
    defaultInputFieldRequiredness: true,
    plugins,
    relay: {},
    prisma: {
      client: options.prisma.client,
      ...(options.prisma.dmmf ? { dmmf: options.prisma.dmmf as any } : {}),
      exposeDescriptions: options.prisma.exposeDescriptions ?? true,
      filterConnectionTotalCount:
        options.prisma.filterConnectionTotalCount ?? true,
      onUnusedQuery: options.prisma.onUnusedQuery ?? null,
    },
    complexity: {
      defaultComplexity: options.complexity?.defaultComplexity ?? 1,
      defaultListMultiplier: options.complexity?.defaultListMultiplier ?? 10,
    },
    tracing: {
      default: (cfg) =>
        (options.tracing?.enableByDefault ?? true) ? isRootField(cfg) : false,
      wrap: (resolver, _opts, cfg) =>
        wrapResolver(resolver, (_err, dur) => {
          options.tracing?.onResolved?.(cfg.parentType, cfg.name, dur);
        }),
    },
  });

  Object.entries(ScalarTypeEnum).forEach(([name, type]) => {
    if (!['ID', 'Boolean'].includes(name)) {
      builder.addScalarType(name as any, type());
    }
  });
  builder.addScalarType('GeoJSON', GeoJSONResolver);

  builder.queryType({
    fields: (t) => ({}),
  });

  // Mutation Type (reduced, moved fields into modules)
  builder.mutationType({
    fields: (t) => ({}),
  });

  return builder;
}

// export async function loadDmmfFromClient(
//   client: any
// ): Promise<PrismaDMMF.Document> {
//   const dmmf: PrismaDMMF.Document | undefined = (client as any)?._dmmf;
//   if (dmmf) return dmmf;
//   if (typeof (client as any).$extends === 'function') {
//     const ext = await (client as any).$extends({});
//     if (ext && ext._dmmf) return ext._dmmf as PrismaDMMF.Document;
//   }
//   throw new Error('Unable to load Prisma DMMF from client');
// }

// export type PrismaSchemaBuilder<
//   C extends object,
//   PT extends {} | undefined,
// > = PothosSchemaTypes.SchemaBuilder<
//   PothosSchemaTypes.ExtendDefaultTypes<{
//     PrismaTypes: PT;
//     Context: C;
//     Scalars: {
//       JSON: { Input: unknown; Output: unknown };
//       Date: { Input: Date; Output: Date };
//     };
//   }>
// >;

// export type PrismaSchemaBuilder<C, PT> = InstanceType<typeof SchemaBuilder><{
//   PrismaTypes: PT;
//   Context: C;
//   Scalars: {
//     JSON: { Input: unknown; Output: unknown };
//     Date: { Input: Date; Output: Date };
//   };
// }>;

// export function createTypedPrismaBuilder<PT extends {}>() {
//   return function create<C extends object>(options: PrismaBuilderOptions<C>) {
//     return createPrismaSchemaBuilder<C, PT>(options);
//   };
// }

// Tracing helper that integrates with a logger-like object
export interface LoggerLike {
  info: (msg: string, meta?: unknown) => void;
}
export function createLoggerTracing(logger: LoggerLike, opLabel = 'gql.field') {
  return {
    enableByDefault: true,
    onResolved: (
      parentType: string,
      fieldName: string,
      durationMs: number,
      ...others: any[]
    ) => {
      // logger.info(opLabel, { parentType, fieldName, durationMs, others });
    },
  } as PrismaBuilderOptions['tracing'];
}
