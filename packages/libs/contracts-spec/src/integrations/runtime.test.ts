import { describe, expect, it, vi } from 'bun:test';

import type {
  ResolvedAppConfig,
  ResolvedIntegration,
} from '@contractspec/lib.contracts-spec/app-config/runtime';
import type { IntegrationConnection } from './connection';
import type { IntegrationSpec } from './spec';
import { IntegrationCallGuard } from './runtime';
import type {
  IntegrationTelemetryEmitter,
  IntegrationTelemetryEvent,
} from './runtime';
import type {
  SecretProvider,
  SecretReference,
  SecretValue,
} from './secrets/provider';

const baseSpec: IntegrationSpec = {
  meta: {
    title: 'Stripe',
    description: 'Stripe integration',
    category: 'payments',
    version: '1.0.0',
    key: 'integration.stripe',
    stability: 'stable',
    owners: [],
    tags: [],
    domain: 'core',
  },
  supportedModes: ['managed'],
  capabilities: { provides: [] },
  configSchema: { schema: {} },
  secretSchema: { schema: {} },
};

function makeConnection(
  status: IntegrationConnection['status'] = 'connected'
): IntegrationConnection {
  const now = new Date().toISOString();
  return {
    meta: {
      id: 'conn-1',
      tenantId: 'tenant-1',
      integrationKey: baseSpec.meta.key,
      integrationVersion: baseSpec.meta.version,
      label: 'Stripe Production',
      environment: 'production',
      createdAt: now,
      updatedAt: now,
    },
    ownershipMode: 'managed',
    config: {},
    secretProvider: 'vault',
    secretRef: 'vault://integrations/tenant-1/stripe',
    status,
  };
}

function makeResolvedIntegration(
  slotId: string,
  status: IntegrationConnection['status'] = 'connected'
): ResolvedIntegration {
  return {
    slot: {
      slotId,
      requiredCategory: 'payments',
      allowedModes: ['managed'],
      requiredCapabilities: [],
      required: true,
      description: 'Primary payments provider',
    },
    binding: {
      slotId,
      connectionId: 'conn-1',
    },
    connection: makeConnection(status),
    spec: baseSpec,
  };
}

function makeResolvedConfig(
  overrides: Partial<ResolvedAppConfig> = {}
): ResolvedAppConfig {
  return {
    appId: 'demo-app',
    tenantId: 'tenant-1',
    blueprintName: 'demo.blueprint',
    blueprintVersion: '1.0.0',
    configVersion: '1.0.0',
    environment: 'production',
    capabilities: { enabled: [], disabled: [] },
    features: { include: [], exclude: [] },
    dataViews: {},
    workflows: {},
    policies: [],
    experiments: { catalog: [], active: [], paused: [] },
    featureFlags: [],
    routes: [],
    integrations: [],
    knowledge: [],
    translation: {
      defaultLocale: 'en',
      supportedLocales: ['en'],
      blueprintCatalog: { key: 'demo.catalog', version: '1.0.0' },
      tenantOverrides: [],
    },
    branding: {
      appName: 'Demo App',
      assets: {},
      colors: { primary: '#000000', secondary: '#ffffff' },
      domain: 'tenant-1.demo.localhost',
    },
    ...overrides,
  };
}

class MockSecretProvider implements SecretProvider {
  id = 'vault';
  canHandle(reference: SecretReference): boolean {
    return reference.startsWith('vault://');
  }

  async getSecret(): Promise<SecretValue> {
    return {
      data: new TextEncoder().encode(
        JSON.stringify({ apiKey: 'sk_test_123', account: 'acct_123' })
      ),
      retrievedAt: new Date(),
    };
  }

  async setSecret(): Promise<never> {
    throw new Error('not implemented');
  }

  async rotateSecret(): Promise<never> {
    throw new Error('not implemented');
  }

  async deleteSecret(): Promise<void> {
    throw new Error('not implemented');
  }
}

class RecordingTelemetry implements IntegrationTelemetryEmitter {
  public events: IntegrationTelemetryEvent[] = [];

  record(event: IntegrationTelemetryEvent): void {
    this.events.push(event);
  }
}

describe('IntegrationCallGuard', () => {
  it('returns failure when slot is not bound', async () => {
    const telemetry = new RecordingTelemetry();
    const guard = new IntegrationCallGuard(new MockSecretProvider(), {
      telemetry,
      maxAttempts: 1,
    });
    const config = makeResolvedConfig({ integrations: [] });

    const result = await guard.executeWithGuards(
      'payments.primary',
      'payments.charge',
      { amount: 1000 },
      config,
      async () => ({})
    );

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('SLOT_NOT_BOUND');
    expect(telemetry.events).toHaveLength(0);
  });

  it('fails when the integration connection is disconnected', async () => {
    const telemetry = new RecordingTelemetry();
    const guard = new IntegrationCallGuard(new MockSecretProvider(), {
      telemetry,
    });
    const integration = makeResolvedIntegration(
      'payments.primary',
      'disconnected'
    );
    const config = makeResolvedConfig({ integrations: [integration] });

    const result = await guard.executeWithGuards(
      'payments.primary',
      'payments.charge',
      {},
      config,
      async () => ({})
    );

    expect(result.success).toBe(false);
    expect(result.error?.code).toBe('CONNECTION_NOT_READY');
    expect(telemetry.events).toHaveLength(1);
    expect(telemetry.events[0]).toMatchObject({
      status: 'error',
      errorCode: 'CONNECTION_NOT_READY',
    });
  });

  it('executes the integration call successfully and records telemetry', async () => {
    const telemetry = new RecordingTelemetry();
    const guard = new IntegrationCallGuard(new MockSecretProvider(), {
      telemetry,
      maxAttempts: 1,
    });
    const integration = makeResolvedIntegration(
      'payments.primary',
      'connected'
    );
    const config = makeResolvedConfig({ integrations: [integration] });

    const result = await guard.executeWithGuards(
      'payments.primary',
      'payments.charge',
      { amount: 5000 },
      config,
      async (_connection, secrets) => {
        expect(secrets).toEqual({
          apiKey: 'sk_test_123',
          account: 'acct_123',
        });
        return { status: 'ok' };
      }
    );

    expect(result.success).toBe(true);
    expect(result.metadata.connectionId).toBe('conn-1');
    expect(telemetry.events).toHaveLength(1);
    expect(telemetry.events[0]).toMatchObject({
      status: 'success',
      integrationKey: baseSpec.meta.key,
    });
  });

  it('retries when executor throws retryable error', async () => {
    const telemetry = new RecordingTelemetry();
    const sleep = vi.fn(async () => {
      /* noop */
    });
    let attempt = 0;
    const guard = new IntegrationCallGuard(new MockSecretProvider(), {
      telemetry,
      sleep,
      maxAttempts: 3,
    });
    const integration = makeResolvedIntegration(
      'payments.primary',
      'connected'
    );
    const config = makeResolvedConfig({ integrations: [integration] });

    const executor = vi.fn().mockImplementation(async () => {
      attempt += 1;
      if (attempt < 2) {
        const error = new Error('timeout');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).retryable = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).code = 'ETIMEDOUT';
        throw error;
      }
      return { status: 'ok' };
    });

    const result = await guard.executeWithGuards(
      'payments.primary',
      'payments.charge',
      {},
      config,
      executor
    );

    expect(result.success).toBe(true);
    expect(executor).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
    expect(result.metadata.attempts).toBe(2);
    expect(
      telemetry.events.filter((event) => event.status === 'error')
    ).toHaveLength(1);
    expect(
      telemetry.events.filter((event) => event.status === 'success')
    ).toHaveLength(1);
  });

  it('stops retrying when error is not retryable', async () => {
    const telemetry = new RecordingTelemetry();
    const guard = new IntegrationCallGuard(new MockSecretProvider(), {
      telemetry,
      maxAttempts: 3,
    });
    const integration = makeResolvedIntegration(
      'payments.primary',
      'connected'
    );
    const config = makeResolvedConfig({ integrations: [integration] });

    const executor = vi.fn(async () => {
      const error = new Error('bad request');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).code = 'ECLIENT';
      return Promise.reject(error);
    });

    const result = await guard.executeWithGuards(
      'payments.primary',
      'payments.charge',
      {},
      config,
      executor
    );

    expect(result.success).toBe(false);
    expect(result.metadata.attempts).toBe(1);
    expect(executor).toHaveBeenCalledTimes(1);
    expect(telemetry.events).toHaveLength(1);
    expect(telemetry.events[0]).toMatchObject({
      status: 'error',
      errorCode: 'ECLIENT',
    });
  });
});
