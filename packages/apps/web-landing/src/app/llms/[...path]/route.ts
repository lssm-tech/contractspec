import { NextRequest, NextResponse } from 'next/server';
import {
  getPresentationForRoute,
  getAllPresentationRoutes,
  renderPresentationToMarkdown,
} from '@lssm/bundle.contractspec-studio/presentation/presentations';

/**
 * API route handler for markdown rendering via llms. subdomain or .md/.mdx extensions.
 *
 * Routes:
 * - llms.contractspec.chaman.ventures/ → markdown of landing page
 * - llms.contractspec.chaman.ventures/docs.md → markdown of docs index
 * - llms.contractspec.chaman.ventures/docs/getting-started/installation.md → markdown of that page
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  try {
    // Await params (Next.js 15+ uses Promise for params)
    const resolvedParams = await params;
    // Reconstruct path from params
    const pathSegments = resolvedParams.path ?? [];
    let route = pathSegments.length > 0 ? '/' + pathSegments.join('/') : '/';

    // Handle .md or .mdx extension
    if (route.endsWith('.md') || route.endsWith('.mdx')) {
      route = route.replace(/\.mdx?$/, '');
    }

    // Normalize root route (handle /index from proxy rewrite)
    if (route === '' || route === '/index') {
      route = '/';
    }

    // Get presentation descriptor for this route
    const descriptor = getPresentationForRoute(route);

    if (!descriptor) {
      const availableRoutes = getAllPresentationRoutes();

      return new NextResponse(
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
    return new NextResponse(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return new NextResponse(
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
