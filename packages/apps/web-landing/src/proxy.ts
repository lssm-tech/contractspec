import { type NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@lssm/bundle.contractspec-studio/application/services/auth';

const PUBLIC_ROUTES = [
  '/',
  '/templates',
  '/sandbox',
  '/docs',
  '/pricing',
  '/llms',
  '/login',
  '/signup',
  '/onboarding',
];

const isRouteMatch = (pathname: string, route: string) => {
  if (route === '/') {
    return pathname === '/';
  }
  return pathname === route || pathname.startsWith(`${route}/`);
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') ?? '';

  if (host.startsWith('llms.')) {
    return NextResponse.rewrite(new URL('/llms', request.url));
  }

  if (PUBLIC_ROUTES.some((route) => isRouteMatch(pathname, route))) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/studio')) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    console.log('session', session);
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const activeOrgId = session.session?.activeOrganizationId;
    if (!activeOrgId) {
      return NextResponse.redirect(
        new URL('/onboarding/org-select', request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
