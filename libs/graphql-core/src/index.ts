import SchemaBuilder from '@pothos/core';
import ComplexityPlugin from '@pothos/plugin-complexity';
import DataloaderPlugin from '@pothos/plugin-dataloader';
import RelayPlugin from '@pothos/plugin-relay';
import TracingPlugin, {
  isRootField,
  wrapResolver,
} from '@pothos/plugin-tracing';
import { DateResolver, JSONResolver } from 'graphql-scalars';

export interface CreateBuilderOptions<C> {
  contextType: C;
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
}

export function createSchemaBuilder<C extends {}>(
  options: CreateBuilderOptions<C>
) {
  const builder = new SchemaBuilder<{
    Context: C;
    Scalars: {
      JSON: { Input: unknown; Output: unknown };
      Date: { Input: Date; Output: Date };
    };
  }>({
    plugins: [RelayPlugin, ComplexityPlugin, TracingPlugin, DataloaderPlugin],
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

  builder.addScalarType('JSON', JSONResolver);
  builder.addScalarType('Date', DateResolver);

  return builder as typeof builder;
}

// Complexity helpers for consistent usage in field definitions
export const complexity = (value: number) => () => value;
export const listComplexity =
  (base: number, multiplier = 10) =>
  (_args: unknown, childComplexity: number) =>
    base + multiplier * childComplexity;

// Tracing helper that integrates with a logger-like object
export interface LoggerLike {
  info: (msg: string, meta?: unknown) => void;
}
export function createLoggerTracing(logger: LoggerLike, opLabel = 'gql.field') {
  return {
    enableByDefault: true,
    onResolved: (parentType: string, fieldName: string, durationMs: number) => {
      logger.info(opLabel, { parentType, fieldName, durationMs });
    },
  } as CreateBuilderOptions<unknown>['tracing'];
}
