/**
 * Example OAuth callback handler for Powens (open banking).
 *
 * This example stays framework-neutral: it operates on the standard `Request`
 * type so it can be used in Next.js, Elysia, or any fetch-compatible runtime.
 */
import { PowensOpenBankingProvider } from '@lssm/integration.providers-impls/impls/powens-openbanking';
import type { PowensEnvironment } from '@lssm/integration.providers-impls/impls/powens-client';

export async function powensOAuthCallbackHandler(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const userUuid = url.searchParams.get('user_uuid');

  if (!code || !state || !userUuid) {
    return new Response('Missing Powens OAuth params', { status: 400 });
  }

  const connection = await getConnectionByState(state);
  if (!connection) {
    return new Response('Unknown Powens OAuth state', { status: 404 });
  }

  const secrets = await getPowensSecretsForConnection(connection.meta.id);

  const provider = new PowensOpenBankingProvider({
    clientId: secrets.clientId,
    clientSecret: secrets.clientSecret,
    apiKey: secrets.apiKey,
    environment: connection.config.environment as PowensEnvironment,
    baseUrl: connection.config.baseUrl as string | undefined,
  });

  const preview = await provider.listAccounts({
    tenantId: connection.meta.tenantId,
    connectionId: connection.meta.id,
    userId: userUuid,
  });

  await connection.storePowensUser({
    tenantUserId: connection.meta.tenantUserId,
    powensUserUuid: userUuid,
    authCode: code,
  });

  await enqueueWorkflow('pfo.workflow.sync-openbanking-accounts', {
    tenantId: connection.meta.tenantId,
    userUuid,
    connectionId: connection.meta.id,
    previewAccounts: preview.accounts,
  });

  const redirectBase = process.env.APP_DASHBOARD_URL ?? '';
  return Response.redirect(
    `${redirectBase}/banking/linked?tenant=${connection.meta.tenantId}`,
    302
  );
}

interface ExamplePowensSecrets {
  clientId: string;
  clientSecret: string;
  apiKey?: string;
}

interface ExampleIntegrationConnection {
  meta: {
    id: string;
    tenantId: string;
    tenantUserId: string;
  };
  config: {
    environment: PowensEnvironment;
    baseUrl?: string;
  };
  storePowensUser(input: {
    tenantUserId: string;
    powensUserUuid: string;
    authCode: string;
  }): Promise<void>;
}

async function getConnectionByState(
  state: string
): Promise<ExampleIntegrationConnection | null> {
  const record = fakeDatabase.connections.find((conn) => conn.state === state);
  return record ?? null;
}

async function getPowensSecretsForConnection(
  connectionId: string
): Promise<ExamplePowensSecrets> {
  const secret = fakeSecretStore[connectionId];
  if (!secret) throw new Error(`Missing Powens secrets for ${connectionId}`);
  return secret;
}

async function enqueueWorkflow(name: string, input: Record<string, unknown>) {
  await fakeWorkflowQueue.enqueue({ name, input });
}

const fakeDatabase = {
  connections: [] as (ExampleIntegrationConnection & { state: string })[],
};

const fakeSecretStore: Record<string, ExamplePowensSecrets> = {};

const fakeWorkflowQueue = {
  enqueue: async (_payload: Record<string, unknown>) => {
    /* no-op */
  },
};
