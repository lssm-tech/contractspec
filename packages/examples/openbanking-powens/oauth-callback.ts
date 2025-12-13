/**
 * Example OAuth callback handler for Powens (read-only open banking).
 *
 * This example assumes:
 * - You stored the Powens redirect `state` parameter when generating the
 *   authorisation URL. The state maps back to an integration connection record.
 * - Secrets (clientId/clientSecret/apiKey/webhookSecret) are managed via the
 *   ContractSpec secret provider abstraction.
 * - After linking, you kick off the canonical sync workflow to hydrate accounts.
 */
import type { NextRequest } from 'next/server';
import { PowensOpenBankingProvider } from '@lssm/integration.providers-impls/impls/powens-openbanking';
import type { PowensEnvironment } from '@lssm/integration.providers-impls/impls/powens-client';

export async function powensOAuthCallbackHandler(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const userUuid = url.searchParams.get('user_uuid');

  if (!code || !state || !userUuid) {
    return new Response('Missing Powens OAuth params', { status: 400 });
  }

  /**
   * Fetch the tenant integration connection that initiated the OAuth flow.
   * The store should include the resolved integration config + metadata.
   */
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

  /**
   * Optionally perform an immediate fetch so you can display accounts in the UI
   * without waiting for the next scheduled sync.
   */
  const preview = await provider.listAccounts({
    tenantId: connection.meta.tenantId,
    connectionId: connection.meta.id,
    userId: userUuid,
  });

  // Persist the Powens user UUID -> tenant user mapping.
  await connection.storePowensUser({
    tenantUserId: connection.meta.tenantUserId,
    powensUserUuid: userUuid,
    authCode: code,
  });

  /**
   * Kick off the canonical sync workflow to hydrate canonical entities.
   * The workflow `pfo.workflow.sync-openbanking-accounts` will:
   * - fetch accounts via the provider
   * - upsert `BankAccountRecord`s
   * - emit telemetry tagged with the integration slot
   */
  await enqueueWorkflow('pfo.workflow.sync-openbanking-accounts', {
    tenantId: connection.meta.tenantId,
    userUuid,
    connectionId: connection.meta.id,
    previewAccounts: preview.accounts,
  });

  return Response.redirect(
    `${process.env.APP_DASHBOARD_URL}/banking/linked?tenant=${connection.meta.tenantId}`,
    302
  );
}

/**
 * --- Example infrastructure helpers ---
 *
 * These functions would normally live in your app layer. They are sketched out
 * here for completeness.
 */

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

async function getConnectionByState(state: string): Promise<ExampleIntegrationConnection | null> {
  // Look up the integration connection associated with this OAuth state.
  const record = await fakeDatabase.connections.find((conn) => conn.state === state);
  return record ?? null;
}

async function getPowensSecretsForConnection(connectionId: string): Promise<ExamplePowensSecrets> {
  // Resolve secrets via your secret provider (env override or GCP Secret Manager).
  const secret = fakeSecretStore[connectionId];
  if (!secret) throw new Error(`Missing Powens secrets for ${connectionId}`);
  return secret;
}

async function enqueueWorkflow(name: string, input: Record<string, unknown>) {
  await fakeWorkflowQueue.enqueue({ name, input });
}

// --- Fake stores used to keep the example self-contained ---

const fakeDatabase = {
  connections: [] as Array<ExampleIntegrationConnection & { state: string }>,
};

const fakeSecretStore: Record<string, ExamplePowensSecrets> = {};

const fakeWorkflowQueue = {
  enqueue: async (_payload: Record<string, unknown>) => {
    /* no-op */
  },
};

