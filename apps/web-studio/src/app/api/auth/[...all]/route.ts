import { auth } from '@contractspec/bundle.studio/application/services/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextResponse } from 'next/server';

const { GET: rawGET, POST: rawPOST } = toNextJsHandler(auth);

function isGetSessionRequest(request: Request): boolean {
  try {
    const url = new URL(request.url);
    return url.pathname.endsWith('/api/auth/get-session');
  } catch {
    return false;
  }
}

/**
 * Dev hardening:
 * If the auth database is not migrated yet, Better Auth can 500 on `get-session`.
 * The client will then aggressively retry, effectively "spamming" the endpoint.
 *
 * In development only, we downgrade 5xx responses from `get-session` to `200 null`
 * (equivalent to "no active session"), so the app stays usable while DB setup
 * is being fixed.
 */
export const GET = async (request: Request) => {
  const response = await rawGET(request);

  if (
    process.env.NODE_ENV !== 'production' &&
    isGetSessionRequest(request) &&
    response.status >= 500
  ) {
    return NextResponse.json(null, { status: 200 });
  }

  return response;
};

export const POST = async (request: Request) => {
  return rawPOST(request);
};
