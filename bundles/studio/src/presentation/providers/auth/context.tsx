'use client';

import {
  graphql,
  type Organization,
} from '@contractspec/lib.gql-client-studio';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useGraphQL } from '../../libs/gql-client';
import { initPosthog, posthog } from '../../libs/posthog/client';
import { authClient } from './client';

type SessionData =
  ReturnType<typeof authClient.useSession> extends {
    data: infer T;
  }
    ? T
    : unknown;

interface AuthContextValue {
  user: SessionData extends { user?: infer U } ? U | null : unknown;
  session: SessionData extends { session?: infer S } ? S | null : unknown;
  isAuthenticated: boolean;
  organization: Pick<Organization, 'id' | 'name' | 'slug' | 'type'> | null;
  isLoading: boolean;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: authSession } = authClient.useSession();
  const { data: organizationQuery, isLoading } = useGraphQL(
    UserActiveOrganizationQuery,
    {}
  );

  useEffect(() => {
    try {
      initPosthog();
    } catch {
      // PostHog might not be initialized
    }
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
      isLoading,
    };
  }, [authSession?.user, authSession?.session, isLoading, organizationQuery]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
