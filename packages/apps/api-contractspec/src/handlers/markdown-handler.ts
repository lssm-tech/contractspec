import { appLogger } from '@lssm/bundle.contractspec-studio/infrastructure';
import { Elysia } from 'elysia';
import {
  getAllPresentationRoutes,
  getPresentationForRoute,
  renderPresentationToMarkdown,
} from '@lssm/bundle.contractspec-studio/presentation/presentations';

export const markdownHandler = new Elysia().get(
  '/docs/*',
  async ({ params, query }) => {
    try {
      console.info('params', params);

      let route = '/' + params['*'] + '/';

      // Handle .md or .mdx extension
      if (route.endsWith('.md') || route.endsWith('.mdx')) {
        route = route.replace(/\.mdx?$/, '');
      }

      // Normalize root route
      if (route === '' || route === '/index') {
        route = '/';
      }

      console.info('route', route);

      // Get presentation descriptor
      const descriptor = getPresentationForRoute(route);

      if (!descriptor) {
        const availableRoutes = getAllPresentationRoutes();

        return new Response(
          `No presentation found for route: ${route}\n\nAvailable routes:\n${availableRoutes.join('\n')}`,
          {
            status: 404,
            headers: {
              'Content-Type': 'text/plain',
            },
          }
        );
      }

      // Render to markdown
      const markdown = await renderPresentationToMarkdown(descriptor);

      // Return markdown with proper headers
      return new Response(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    } catch (error) {
      appLogger.error('Error rendering markdown', { error });
      return new Response(
        `Error rendering markdown: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          status: 500,
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );
    }
  }
);
