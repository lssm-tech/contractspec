import { createYoga } from 'graphql-yoga';
import {
  schema,
  createNextjsContext,
} from '@lssm/bundle.contractspec-studio/infrastructure';

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/studio/graphql',
  fetchAPI: { Response },
  context: async ({ request }: { request: Request }) =>
    createNextjsContext({ request }),
});

export { handleRequest as GET, handleRequest as POST, handleRequest as OPTIONS };






