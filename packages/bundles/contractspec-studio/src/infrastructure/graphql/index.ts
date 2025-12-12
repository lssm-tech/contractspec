import { yoga } from '@elysiajs/graphql-yoga';
import { Elysia } from 'elysia';
import { schema } from './schema';
import { createNextjsContext } from './context';
import { exportContractsToGraphQLSchema } from '@lssm/app.api-contractspec/src/utils/graphql-schema-export';

export function mountContractSpecStudioGraphQL(path = '/graphql') {
  const app = new Elysia();

  const graphlYogaServer = yoga({
    schema,
    path: path,
    landingPage: false,
    logging: true,
    fetchAPI: { Response, Request },

    context: createNextjsContext,
  });

  exportContractsToGraphQLSchema(schema, __dirname);

  return app.use(graphlYogaServer);
}

export { schema };
