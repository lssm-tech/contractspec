'use client';

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { authClient } from './index';
import { initPosthog, posthog } from '../../libs/posthog/client';
import { graphql, type Organization } from '@lssm/lib.gql-client-strit';
import { useGraphQL } from '../../libs/gql-client';

// type Session = typeof authClient.$Infer.Session;
// export type AuthUser = Session['user'];
// export type AuthSession = Session['session'];

type Session =
  ReturnType<typeof authClient.useSession> extends {
    data: infer T;
  }
    ? T
    : any;

interface AuthContextValue {
  user: Session extends { user?: infer U } ? U | null : any;
  session: Session extends { session?: infer S } ? S | null : any;
  isAuthenticated: boolean;
  organization: Pick<Organization, 'id' | 'name' | 'slug' | 'type'> | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const UserActiveOrganizationQuery = graphql(`
  query Hooks_MyActiveOrg {
    myActiveOrganization {
      id
      name
      slug
      type
    }
  }
`);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: authSession } = authClient.useSession();
  const { data: organizationQuery } = useGraphQL(UserActiveOrganizationQuery);

  useEffect(() => {
    try {
      initPosthog();
    } catch {}
  }, []);

  useEffect(() => {
    if (authSession?.user?.id) {
      posthog?.identify?.(authSession.user.id, {
        ...authSession.user,
        email: authSession.user.email,
      });
    } else {
      posthog.reset();
    }
  }, [authSession?.user?.id]);

  const value = useMemo<AuthContextValue>(() => {
    const user = authSession?.user ?? null;
    const session = authSession?.session ?? null;
    return {
      user,
      session,
      isAuthenticated: !!user,
      organization: organizationQuery?.myActiveOrganization ?? null,
    };
  }, [authSession?.user, authSession?.session, organizationQuery]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
