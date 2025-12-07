import { createAuthClient } from 'better-auth/react';
import {
  adminClient,
  apiKeyClient,
  genericOAuthClient,
  inferOrgAdditionalFields,
  organizationClient,
  phoneNumberClient,
} from 'better-auth/client/plugins';
// import { passkeyClient } from '@better-auth/passkey/client';

type ContractSpecAuth = typeof import('../../../application').auth;

// function resolveBaseUrl() {
//   const envUrl = process.env.NEXT_PUBLIC_SIGIL_API_URL;
//   if (envUrl && envUrl.length > 0) return envUrl;
//   if (process.env.NODE_ENV === 'development') return 'http://localhost:3000';
//   return envUrl || '';
// }

export const authClient = createAuthClient({
  basePath: '/api/auth',
  baseURL:
    process.env.NEXT_PUBLIC_SIGIL_API_URL || 'https://contractspec.lssm.tech',
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    adminClient(),
    // passkeyClient(),
    apiKeyClient(),
    phoneNumberClient(),
    genericOAuthClient(),
    organizationClient({
      teams: { enabled: true },
      schema: inferOrgAdditionalFields<ContractSpecAuth>(),
    }),
  ],
});
export { AuthProvider, useAuthContext } from './context';

type Session = typeof authClient.$Infer.Session;
type AuthUser = Session['user'];
type AuthSession = Session['session'];

// Safe helpers for admin impersonation to avoid tight coupling to plugin types
export async function impersonateUser(userId: string) {
  if (authClient?.admin?.impersonateUser) {
    return authClient.admin.impersonateUser({ userId });
  }
  throw new Error('Impersonation API not available');
}

// export async function stopImpersonation() {
//   if (authClient?.admin?.stopImpersonation) {
//     return authClient.admin.stopImpersonation();
//   }
//   if (authClient?.stopImpersonation) {
//     return authClient.stopImpersonation();
//   }
//   throw new Error('Stop impersonation API not available');
// }
