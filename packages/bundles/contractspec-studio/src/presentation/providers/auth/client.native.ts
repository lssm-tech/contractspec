import { createAuthClient } from 'better-auth/react';
import {
  adminClient,
  apiKeyClient,
  genericOAuthClient,
  inferOrgAdditionalFields,
  organizationClient,
  phoneNumberClient,
} from 'better-auth/client/plugins';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

type ContractSpecAuth = typeof import('../../../application').auth;

type AuthClient = ReturnType<typeof createAuthClient>;

const globalForAuthClient = globalThis as typeof globalThis & {
  __lssm_contractspec_authClient?: AuthClient;
};

function createClient(): AuthClient {
  return createAuthClient({
    basePath: '/api/auth',
    baseURL:
      process.env.NEXT_PUBLIC_SIGIL_API_URL || 'https://contractspec.lssm.tech',
    fetchOptions: {
      credentials: 'include',
    },
    plugins: [
      adminClient(),
      apiKeyClient(),
      phoneNumberClient(),
      genericOAuthClient(),
      expoClient({
        scheme: 'lssm',
        storagePrefix: 'lssm',
        storage: SecureStore,
      }),
      organizationClient({
        teams: { enabled: true },
        schema: inferOrgAdditionalFields<ContractSpecAuth>(),
      }),
    ],
  });
}

export const authClient: AuthClient =
  globalForAuthClient.__lssm_contractspec_authClient ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalForAuthClient.__lssm_contractspec_authClient = authClient;
}
