import { describe, expect, it } from 'bun:test';
import type { AppIntegrationSlot } from '@contractspec/lib.contracts-spec/app-config/spec';
import type { ResolvedAppConfig } from '@contractspec/lib.contracts-spec/app-config/runtime';
import type { IntegrationConnection } from '../connection';
import type { IntegrationSpec } from '../spec';
import type { AppIntegrationBinding } from '../binding';
import { ensurePrimaryHealthIntegration } from './guards';

function buildResolvedConfig(
  integration?: Partial<IntegrationConnection> & {
    specKey?: string;
    specCategory?: IntegrationSpec['meta']['category'];
  }
): ResolvedAppConfig {
  const slot: AppIntegrationSlot = {
    slotId: 'primaryHealth',
    requiredCategory: 'health',
    required: true,
  };
  const binding: AppIntegrationBinding = {
    slotId: 'primaryHealth',
    connectionId: integration?.meta?.id ?? 'conn-health',
  };
  const { specKey, specCategory, ...connectionOverrides } = integration ?? {};

  const connection: IntegrationConnection = {
    meta: {
      id: integration?.meta?.id ?? 'conn-health',
      tenantId: 'tenant',
      integrationKey:
        integration?.meta?.integrationKey ?? 'health.openwearables',
      integrationVersion: '1.0.0',
      label: 'Open Wearables',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    ownershipMode: 'byok',
    config: {},
    secretProvider: 'gcp',
    secretRef: 'gcp://secret',
    status: integration?.status ?? 'connected',
  };

  const spec: IntegrationSpec = {
    meta: {
      key: specKey ?? 'health.openwearables',
      version: '1.0.0',
      category: specCategory ?? 'health',
      title: 'Health Open Wearables',
      description: 'Health integration',
      domain: 'health',
      owners: ['platform.integrations'],
      tags: ['health'],
      stability: 'experimental',
    },
    supportedModes: ['managed', 'byok'],
    capabilities: { provides: [] },
    configSchema: { schema: {} },
    secretSchema: { schema: {} },
  };

  return {
    appId: 'app',
    tenantId: 'tenant',
    blueprintName: 'health.app',
    blueprintVersion: '1.0.0',
    configVersion: '1.0.0',
    capabilities: { enabled: [], disabled: [] },
    features: { include: [], exclude: [] },
    dataViews: {},
    workflows: {},
    policies: [],
    integrations: integration
      ? [
          {
            slot,
            binding,
            connection: { ...connection, ...connectionOverrides },
            spec,
          },
        ]
      : [],
    knowledge: [],
    translation: {
      defaultLocale: 'en',
      supportedLocales: ['en'],
      tenantOverrides: [],
    },
    branding: {
      appName: 'Health App',
      assets: {},
      colors: { primary: '#000000', secondary: '#ffffff' },
      domain: 'health.local',
    },
    experiments: {
      catalog: [],
      active: [],
      paused: [],
    },
    featureFlags: [],
    routes: [],
    notes: undefined,
  };
}

describe('ensurePrimaryHealthIntegration', () => {
  it('returns error when primaryHealth is unbound', () => {
    const result = ensurePrimaryHealthIntegration(buildResolvedConfig());
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/not bound/i);
  });

  it('returns error when category is not health', () => {
    const result = ensurePrimaryHealthIntegration(
      buildResolvedConfig({ specCategory: 'analytics' })
    );
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/must bind a health integration/i);
  });

  it('returns error when connection status is error', () => {
    const result = ensurePrimaryHealthIntegration(
      buildResolvedConfig({ status: 'error' })
    );
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/status "error"/i);
  });

  it('returns integration when connection is healthy', () => {
    const result = ensurePrimaryHealthIntegration(
      buildResolvedConfig({ status: 'connected' })
    );
    expect(result.ok).toBe(true);
    expect(result.integration?.connection.status).toBe('connected');
  });
});
