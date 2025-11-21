'use server';

import { Logger } from '@lssm/lib.logger';
import type { Session, User } from 'better-auth';
import type { Context } from './types';
import { auth } from '../../application/services/auth';
import { headers } from 'next/headers';

export async function createContext({
  user,
  session,
  logger,
  headers,
}: {
  user?: User | null;
  session?: Session | null;
  logger: Logger;
  headers: Headers;
}): Promise<Context> {
  return {
    user: user ?? undefined,
    session: session ?? undefined,
    headers,
    logger,
  };
}

export const createNextjsContext = async ({
  request,
}: {
  request: Request;
}) => {
  // console.log(
  //   'gql create nextjs context ENVI',
  //   process.env.NODE_ENV,
  //   'headers',
  //   request.headers
  // );
  let session = await auth.api.getSession({ headers: request.headers });
  // console.log('gql create context', session);
  if (!session?.user) {
    // console.log('no user, trying again');
    session = await auth.api.getSession({ headers: await headers() });
    // console.log('gql create context', session);
  }
  return createContext({
    user: session?.user,
    session: session?.session ?? undefined,
    logger: console as any,
    headers: request.headers,
  });
};
