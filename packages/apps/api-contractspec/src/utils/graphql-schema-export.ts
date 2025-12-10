'use server';

import { GraphQLSchema, printSchema } from 'graphql';
import { toSubgraphSDL } from '@lssm/lib.graphql-federation';

export const exportContractsToGraphQLSchema = async (
  schema: GraphQLSchema,
  outputPathDir: string
) => {
  const fs = await import('fs');
  const path = await import('path');

  const schemaString = printSchema(schema);
  const subgraphString = toSubgraphSDL(schema);
  const outputPath = path.join(outputPathDir, '../schema.graphql');
  const subgraphPath = path.join(outputPathDir, '../schema.subgraph.graphql');

  fs.writeFileSync(outputPath, schemaString);
  console.log(`Schema exported to ${outputPath}`);
  fs.writeFileSync(subgraphPath, subgraphString);
  console.log(`Subgraph exported to ${subgraphPath}`);
};
