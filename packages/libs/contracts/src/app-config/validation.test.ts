import { describe, expect, it } from 'vitest';

import type { AppBlueprintSpec, TenantAppConfig } from './spec';
import type { ResolvedAppConfig } from './runtime';
import {
  validateAppBlueprintSpec,
  validateResolvedAppConfig,
  validateTenantAppConfig,
} from './validation';

const baseBlueprint: AppBlueprintSpec = {
  meta: {
    name: 'example.app',
    version: 1,
    appId: 'example',
    title: 'Example App',
    description: 'Example blueprint for validation tests.',
    domain: 'example',
    owners: ['@team.example'],
    tags: ['example'],
    stability: 'experimental',
  },
  integrationSlots: [
    {
      slotId: 'payments.primary',
      requiredCategory: 'payments',
      allowedModes: ['managed', 'byok'],
      requiredCapabilities: [{ key: 'payments.charge', version: 1 }],
      required: true,
    },
  ],
};

const baseTenant: TenantAppConfig = {
  meta: {
    id: 'tenant-config',
    tenantId: 'tenant',
    appId: 'example',
    blueprintName: 'example.app',
    blueprintVersion: 1,
    environment: 'production',
    version: 1,
  },
  integrations: [
    {
      slotId: 'payments.primary',
      connectionId: 'conn-1',
    },
  ],
};

describe('validateAppBlueprintSpec', () => {
  it('reports duplicate integration slots', () => {
    const originalSlot = baseBlueprint.integrationSlots?.[0];
    expect(originalSlot).toBeDefined();
    const duplicateSlot = { ...originalSlot! };
    const issues = validateAppBlueprintSpec({
      ...baseBlueprint,
      integrationSlots: [originalSlot!, duplicateSlot],
    });
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: 'error',
          path: 'integrationSlots.payments.primary',
        }),
      ])
    );
  });
});

describe('validateTenantAppConfig', () => {
  it('flags missing required slots and invalid domains', () => {
    const tenant: TenantAppConfig = {
      ...baseTenant,
      integrations: [
        {
          slotId: 'missing.slot',
          connectionId: 'conn-unknown',
        },
      ],
      branding: {
        customDomain: 'http://not-a-hostname',
      },
    };
    const issues = validateTenantAppConfig(baseBlueprint, tenant);
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: 'error',
          path: 'integrations.missing.slot',
        }),
        expect.objectContaining({
          severity: 'error',
          path: 'integrations.payments.primary',
        }),
        expect.objectContaining({
          severity: 'error',
          path: 'branding.customDomain',
        }),
      ])
    );
  });
});

describe('validateResolvedAppConfig', () => {
  it('ensures required integration slots are satisfied', () => {
    const resolved: ResolvedAppConfig = {
      appId: 'example',
      tenantId: 'tenant',
      blueprintName: 'example.app',
      blueprintVersion: 1,
      configVersion: 1,
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
        tenantOverrides: [],
      },
      branding: {
        appName: 'Example',
        assets: {},
        colors: { primary: '#000000', secondary: '#ffffff' },
        domain: 'example.localhost',
      },
    };

    const issues = validateResolvedAppConfig(baseBlueprint, resolved);
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: 'error',
          path: 'integrations.payments.primary',
        }),
      ])
    );
  });
});

