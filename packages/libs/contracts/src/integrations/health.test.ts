import { describe, expect, it, vi } from 'bun:test';

import { IntegrationHealthService } from './health';
import type { IntegrationContext } from './runtime';

const baseContext = {
  tenantId: 'tenant',
  appId: 'app',
  spec: {
    meta: {
      key: 'integration.example',
      version: '1.0.0',
      category: 'custom',
      title: 'Example Integration',

      description: 'Mock integration used for health checks',
      domain: 'testing',
      owners: ['platform.integrations'],
      tags: ['test'],
      stability: 'experimental',
    },
    supportedModes: ['managed'],
    capabilities: { provides: [] },
    configSchema: { schema: {} },
    secretSchema: { schema: {} },
  },
  connection: {
    meta: {
      id: 'conn-1',
      tenantId: 'tenant',
      integrationKey: 'integration.example',
      integrationVersion: '1.0.0',
      label: 'Example',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ownershipMode: 'managed',
    config: {},
    secretProvider: 'vault',
    secretRef: 'vault://integrations/tenant/conn-1',
    status: 'connected',
  },
  config: {},
  secretProvider: {
    id: 'mock',
    canHandle: () => true,
    getSecret: vi.fn(async () => ({
      data: new Uint8Array(),
      retrievedAt: new Date(),
    })),
    setSecret: vi.fn(async () => ({
      reference: 'mock://secret',
      version: '1',
    })),
    rotateSecret: vi.fn(async () => ({
      reference: 'mock://secret',
      version: '2',
    })),
    deleteSecret: vi.fn(async () => {
      /* noop */
    }),
  },
  secretReference: 'mock://secret',
  trace: {
    blueprintName: 'core.app',
    blueprintVersion: '1.0.0',
    configVersion: '1.0.0',
  },
} satisfies IntegrationContext;

describe('IntegrationHealthService', () => {
  it('reports successful checks and emits telemetry', async () => {
    const telemetry = { record: vi.fn() };
    const service = new IntegrationHealthService({
      telemetry,
      now: () => new Date('2024-01-01T00:00:00Z'),
    });

    const result = await service.check(baseContext, async () => {
      /* noop */
    });

    expect(result.status).toBe('connected');
    expect(result.checkedAt).toEqual(new Date('2024-01-01T00:00:00Z'));
    expect(telemetry.record).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: 'tenant',
        status: 'success',
        integrationKey: 'integration.example',
      })
    );
  });

  it('captures errors and reports telemetry', async () => {
    const telemetry = { record: vi.fn() };
    const service = new IntegrationHealthService({ telemetry });
    const error = Object.assign(new Error('fail'), { code: 'ECONN' });

    const result = await service.check(baseContext, async () => {
      throw error;
    });

    expect(result.status).toBe('error');
    expect(result.errorCode).toBe('ECONN');
    expect(result.errorMessage).toBe('fail');
    expect(telemetry.record).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        errorCode: 'ECONN',
      })
    );
  });
});
