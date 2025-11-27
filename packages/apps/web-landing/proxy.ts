import { NextResponse, type NextRequest } from 'next/server';

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

const SESSION_ENDPOINT = '/api/auth/session';
const SESSION_FETCH_TIMEOUT = 4_000;

type AuthSessionResponse = {
  user?: { id?: string };
  session?: { activeOrganizationId?: string | null };
} | null;

const fetchSession = async (
  request: NextRequest
): Promise<AuthSessionResponse> => {
  const sessionUrl = request.nextUrl.clone();
  sessionUrl.pathname = SESSION_ENDPOINT;
  sessionUrl.search = '';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SESSION_FETCH_TIMEOUT);

  try {
    const response = await fetch(sessionUrl, {
      headers: {
        cookie: request.headers.get('cookie') ?? '',
        'user-agent': request.headers.get('user-agent') ?? '',
      },
      cache: 'no-store',
      credentials: 'include',
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json().catch(() => null)) as AuthSessionResponse;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
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
    const session = await fetchSession(request);
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
