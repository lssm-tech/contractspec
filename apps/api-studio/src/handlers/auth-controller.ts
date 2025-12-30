import { auth } from '@contractspec/bundle.studio/application/services/auth';
import { Elysia } from 'elysia';

// user middleware (compute user and session and pass to routes)
export const betterAuthController = () =>
  new Elysia({ name: 'auth handler' }).mount(auth.handler).macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });
        console.log('elysia auth resolve', { session: !!session });

        if (!session) return status(401);
        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });
