/**
 * Example Powens webhook handler (Next.js / edge runtime ready).
 *
 * Powens delivers events (connection updates, transaction notifications, etc.)
 * to the webhook URL you configure on the integration. Use the shared webhook
 * secret to verify authenticity, then enqueue the appropriate ContractSpec
 * workflows so the canonical ledger stays in sync.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';
import { PowensOpenBankingProvider } from '@lssm/lib.contracts/integrations/providers/impls/powens-openbanking';
import type { PowensEnvironment } from '@lssm/lib.contracts/integrations/providers/impls/powens-client';

export async function powensWebhookHandler(req: NextRequest) {
  const signature = req.headers.get('x-powens-signature');
  const stateHeader = req.headers.get('x-powens-state');
  const payload = await req.text();

  if (!signature || !stateHeader) {
    return new Response('Missing Powens signature headers', { status: 400 });
  }

  const connection = await getConnectionByState(stateHeader);
  if (!connection) {
    return new Response('Unknown Powens state header', { status: 404 });
  }

  const secrets = await getPowensSecretsForConnection(connection.meta.id);
  if (!verifySignature(payload, signature, secrets.webhookSecret)) {
    return new Response('Invalid Powens webhook signature', { status: 401 });
  }

  const event = JSON.parse(payload) as PowensWebhookEvent;
  const provider = new PowensOpenBankingProvider({
    clientId: secrets.clientId,
    clientSecret: secrets.clientSecret,
    apiKey: secrets.apiKey,
    environment: connection.config.environment as PowensEnvironment,
    baseUrl: connection.config.baseUrl as string | undefined,
  });

  switch (event.type) {
    case 'connection.updated':
    case 'user.sync.completed': {
      await enqueueWorkflow('pfo.workflow.sync-openbanking-accounts', {
        tenantId: connection.meta.tenantId,
        connectionId: connection.meta.id,
        userUuid: event.user_uuid,
      });
      break;
    }
    case 'transactions.created':
    case 'transactions.updated': {
      await enqueueWorkflow('pfo.workflow.sync-openbanking-transactions', {
        tenantId: connection.meta.tenantId,
        connectionId: connection.meta.id,
        userUuid: event.user_uuid,
        accountId: event.account_uuid,
      });
      break;
    }
    default:
      // Unknown events can be ignored or logged for observability.
      await logUnmappedEvent(event);
  }

  /**
   * Optional: refresh balances eagerly when transaction webhooks arrive.
   * This keeps dashboards up to date even before the scheduled balance job.
   */
  if (event.account_uuid) {
    await provider.getBalances({
      tenantId: connection.meta.tenantId,
      connectionId: connection.meta.id,
      accountId: event.account_uuid,
    });
  }

  return new Response('OK', { status: 200 });
}

interface PowensWebhookEvent {
  type: string;
  user_uuid: string;
  connection_uuid: string;
  account_uuid?: string;
}

interface ExamplePowensSecrets {
  clientId: string;
  clientSecret: string;
  apiKey?: string;
  webhookSecret: string;
}

interface ExampleIntegrationConnection {
  meta: {
    id: string;
    tenantId: string;
  };
  config: {
    environment: PowensEnvironment;
    baseUrl?: string;
  };
}

function verifySignature(payload: string, signature: string, secret: string) {
  const digest = createHmac('sha256', secret).update(payload).digest('hex');
  const a = Buffer.from(digest, 'hex');
  const b = Buffer.from(signature, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

async function getConnectionByState(state: string): Promise<ExampleIntegrationConnection | null> {
  return fakeDatabase.connections.find((conn) => conn.state === state) ?? null;
}

async function getPowensSecretsForConnection(connectionId: string): Promise<ExamplePowensSecrets> {
  const secret = fakeSecretStore[connectionId];
  if (!secret) throw new Error(`Missing Powens secrets for ${connectionId}`);
  return secret;
}

async function enqueueWorkflow(name: string, input: Record<string, unknown>) {
  await fakeWorkflowQueue.enqueue({ name, input });
}

async function logUnmappedEvent(event: PowensWebhookEvent) {
  await fakeTelemetryLogger.record({
    event: 'openbanking.webhook.unmapped',
    payload: event,
  });
}

const fakeDatabase = {
  connections: [] as Array<ExampleIntegrationConnection & { state: string }>,
};

const fakeSecretStore: Record<string, ExamplePowensSecrets> = {};

const fakeWorkflowQueue = {
  enqueue: async (_payload: Record<string, unknown>) => {
    /* no-op */
  },
};

const fakeTelemetryLogger = {
  record: async (_payload: Record<string, unknown>) => {
    /* no-op */
  },
};




