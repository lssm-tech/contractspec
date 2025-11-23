import { createAuthClient } from 'better-auth/react';
import {
  adminClient,
  apiKeyClient,
  genericOAuthClient,
  inferOrgAdditionalFields,
  organizationClient,
  passkeyClient,
  phoneNumberClient,
} from 'better-auth/client/plugins';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../../../application/services/auth';

export const authClient = createAuthClient({
  basePath: '/api/auth',
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3002'
      : process.env.NEXT_PUBLIC_SIGIL_API_URL || 'https://www.strit.app',
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    adminClient(),
    passkeyClient(),
    apiKeyClient(),
    phoneNumberClient(),
    genericOAuthClient(),
    expoClient({ scheme: 'lssm', storagePrefix: 'lssm', storage: SecureStore }),
    organizationClient({
      teams: { enabled: true },
      schema: inferOrgAdditionalFields<typeof auth>(),
    }),
  ],
});

export { AuthProvider, useAuthContext } from './context';
