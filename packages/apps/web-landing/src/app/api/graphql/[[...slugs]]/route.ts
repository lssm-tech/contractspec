import { Elysia } from 'elysia';
// import { WebStandardAdapter } from 'elysia/adapter/web-standard';
import { mountContractSpecStudioGraphQL } from '@lssm/bundle.contractspec-studio/infrastructure';

const app = new Elysia({
  prefix: '/api',
  // adapter: WebStandardAdapter,
}).use(mountContractSpecStudioGraphQL());

export const GET = app.handle;
export const POST = app.handle;
export const OPTIONS = app.handle;

// interface NextContext {
//   params: Promise<Record<string, string>>;
// }
//
// const { handleRequest } = createYoga<NextContext>({
//   schema,
//
//   // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
//   graphqlEndpoint: '/api/graphql',
//
//   // Yoga needs to know how to create a valid Next response
//   fetchAPI: { Response },
//   context: async ({ request }: { request: Request }) => {
//     const session = await auth.api.getSession({ headers: request.headers });
//     // console.log('gql create context', session);
//     return createContext({
//       user: session?.user,
//       session: session?.session ?? undefined,
//       logger: console as any,
//       headers: request.headers,
//     });
//   },
// });

// export {
//   handleRequest as GET,
//   handleRequest as POST,
//   handleRequest as OPTIONS,
// };
