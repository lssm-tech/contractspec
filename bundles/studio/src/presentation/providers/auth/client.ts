'use client';

import { createAuthClient } from 'better-auth/react';
import {
  adminClient,
  apiKeyClient,
  genericOAuthClient,
  inferOrgAdditionalFields,
  organizationClient,
  phoneNumberClient,
} from 'better-auth/client/plugins';

type ContractSpecAuth = typeof import('../../../application').auth;

function createClient() {
  return createAuthClient({
    basePath: '/api/auth',
    baseURL: process.env.NEXT_PUBLIC_SIGIL_API_URL || 'https://contractspec.io',
    fetchOptions: {
      credentials: 'include',
    },
    plugins: [
      apiKeyClient(),
      phoneNumberClient(),
      genericOAuthClient(),
      adminClient(),
      organizationClient({
        teams: { enabled: true },
        schema: inferOrgAdditionalFields<ContractSpecAuth>(),
      }),
    ],
  });
}

type AuthClient = ReturnType<typeof createClient>;

const globalForAuthClient = globalThis as typeof globalThis & {
  __lssm_contractspec_authClient?: AuthClient;
};

export const authClient: AuthClient =
  globalForAuthClient.__lssm_contractspec_authClient ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForAuthClient.__lssm_contractspec_authClient = authClient;
}

// Safe helper for admin impersonation to avoid tight coupling to plugin types
export async function impersonateUser(userId: string) {
  if (authClient?.admin?.impersonateUser) {
    return authClient.admin.impersonateUser({ userId });
  }
  throw new Error('Impersonation API not available');
}
