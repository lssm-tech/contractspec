export { schema } from './schema';
export { createNextjsContext } from './context';

export function mountStritGraphQL(app: unknown): unknown {
  console.warn(
    '[contractspec-studio] GraphQL server mounting is not available in this bundle.'
  );
  return app;
}
