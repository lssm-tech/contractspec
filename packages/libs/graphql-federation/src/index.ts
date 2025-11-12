import { type SchemaTypes } from '@pothos/core';
import '@pothos/plugin-federation';
import { printSubgraphSchema } from '@apollo/subgraph';
import type { GraphQLSchema } from 'graphql';

export function toSubgraphSDL(schema: GraphQLSchema) {
  return printSubgraphSchema(schema);
}

export function withEntityObject<T extends SchemaTypes>(
  builder: PothosSchemaTypes.SchemaBuilder<T>,
  name: string,
  keyFields: string[],
  fields: (t: any) => Record<string, any>,
  resolveReference: (ref: any, ctx: any) => Promise<any> | any
) {
  const ref = (builder as any).objectRef(name);
  ref.implement({
    fields,
  });
  (builder as any).entity(name, {
    key: keyFields.join(' '),
    resolveReference,
  });
  return ref;
}
