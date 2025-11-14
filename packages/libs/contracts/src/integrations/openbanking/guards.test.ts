import { describe, expect, it } from 'vitest';
import type {
  AppIntegrationBinding,
  AppIntegrationSlot,
} from '../../app-config/spec';
import type { ResolvedAppConfig } from '../../app-config/runtime';
import type { IntegrationConnection } from '../connection';
import type { IntegrationSpec } from '../spec';
import { ensurePrimaryOpenBankingIntegration } from './guards';

function buildResolvedConfig(
  integration?: Partial<IntegrationConnection> & { specKey?: string }
): ResolvedAppConfig {
  const slot: AppIntegrationSlot = {
    slotId: 'primaryOpenBanking',
    requiredCategory: 'open-banking',
    required: true,
  };
  const binding: AppIntegrationBinding = {
    slotId: 'primaryOpenBanking',
    connectionId: integration?.meta?.id ?? 'conn-powens',
  };
  const connection: IntegrationConnection = {
    meta: {
      id: integration?.meta?.id ?? 'conn-powens',
      tenantId: 'tenant',
      integrationKey: integration?.meta?.integrationKey ?? 'openbanking.powens',
      integrationVersion: 1,
      label: 'Powens',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ownershipMode: 'byok',
    config: { environment: 'sandbox' },
    secretProvider: 'gcp',
    secretRef: 'gcp://secret',
    status: integration?.status ?? 'connected',
  };

  const spec: IntegrationSpec = {
    meta: {
      key: integration?.specKey ?? 'openbanking.powens',
      version: 1,
      category: 'open-banking',
      displayName: 'Powens Open Banking',
      title: 'Powens',
      description: 'Powens integration spec',
      domain: 'finance',
      owners: ['platform.finance'],
      tags: ['open-banking'],
      stability: 'experimental',
    },
    supportedModes: ['byok'],
    capabilities: { provides: [] },
    configSchema: { schema: {} },
    secretSchema: { schema: {} },
  };

  const resolved = {
    appId: 'app',
    tenantId: 'tenant',
    blueprintName: 'pfo',
    blueprintVersion: 1,
    configVersion: 1,
    capabilities: { enabled: [], disabled: [] } as any,
    features: { include: [], exclude: [] } as any,
    dataViews: {} as any,
    workflows: {} as any,
    policies: [] as any,
    integrations: integration
      ? [
          {
            slot,
            binding,
            connection: { ...connection, ...integration },
            spec,
          },
        ]
      : [],
    theme: undefined,
    telemetry: undefined,
    knowledge: [],
    translations: {
      defaultLocale: 'en',
      supportedLocales: ['en'],
    },
    routes: [] as any,
    notes: undefined,
  } as ResolvedAppConfig;
  return resolved;
}

describe('ensurePrimaryOpenBankingIntegration', () => {
  it('returns error when primaryOpenBanking is unbound', () => {
    const result = ensurePrimaryOpenBankingIntegration(buildResolvedConfig());
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/not bound/i);
  });

  it('returns error when connection status is error', () => {
    const result = ensurePrimaryOpenBankingIntegration(
      buildResolvedConfig({ status: 'error' })
    );
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/status "error"/i);
  });

  it('returns integration when connection is healthy', () => {
    const result = ensurePrimaryOpenBankingIntegration(
      buildResolvedConfig({ status: 'connected' })
    );
    expect(result.ok).toBe(true);
    expect(result.integration?.connection.status).toBe('connected');
  });
});

