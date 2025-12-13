import { yoga } from '@elysiajs/graphql-yoga';
import { Elysia } from 'elysia';
import { schema } from './schema';
import { createNextjsContext } from './context';

export function mountContractSpecStudioGraphQL(path = '/graphql') {
  const app = new Elysia();

  const graphlYogaServer = yoga({
    schema,
    path: path,
    landingPage: true,
    logging: true,
    fetchAPI: { Response, Request },

    context: createNextjsContext,
  });

  return app.use(graphlYogaServer);
}

export { schema };
