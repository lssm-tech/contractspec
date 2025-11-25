import { describe, expect, it } from 'bun:test';

import type { ResolvedAppConfig } from './runtime';
import type { AppBlueprintSpec, TenantAppConfig } from './spec';
import {
  validateBlueprint,
  validateResolvedConfig,
  validateTenantConfig,
} from './validation';
import { IntegrationSpecRegistry } from '../integrations/spec';
import type { IntegrationConnection } from '../integrations/connection';
import { KnowledgeSpaceRegistry } from '../knowledge/spec';

const baseBlueprint: AppBlueprintSpec = {
  meta: {
    name: 'example.app',
    version: 1,
    appId: 'example',
    title: 'Example App',
    description: 'Example blueprint for validation tests.',
    domain: 'example',
    owners: ['product.artisanos'],
    tags: [],
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
  branding: {
    appNameKey: 'app.title',
  },
  translationCatalog: {
    name: 'example.catalog',
    version: 1,
  },
};

describe('validateBlueprint', () => {
  it('reports duplicate integration slots', () => {
    const originalSlot = { ...(baseBlueprint.integrationSlots ?? [])[0]! };
    const duplicateSlot = { ...originalSlot };
    const duplicated: AppBlueprintSpec = {
      ...baseBlueprint,
      integrationSlots: [originalSlot, duplicateSlot],
    };

    const result = validateBlueprint(duplicated);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'DUPLICATE_SLOT',
          path: 'integrationSlots.payments.primary',
        }),
      ])
    );
  });
});

describe('validateTenantConfig', () => {
  it('captures integration, branding, locale, and translation issues', () => {
    const tenant: TenantAppConfig = {
      meta: {
        id: 'cfg-1',
        tenantId: 'tenant-a',
        appId: 'example',
        blueprintName: baseBlueprint.meta.name,
        blueprintVersion: baseBlueprint.meta.version,
        version: 3,
        status: 'draft',
      },
      integrations: [
        {
          slotId: 'payments.primary',
          connectionId: 'missing-conn',
        },
      ],
      branding: {
        customDomain: 'http://bad-domain',
        assets: [
          {
            type: 'logo',
            url: 'http://insecure/logo.svg',
          },
        ],
      },
      locales: {
        defaultLocale: 'fr',
        enabledLocales: ['en'],
      },
      translationOverrides: {
        entries: [
          {
            key: 'unknown.key',
            locale: 'fr',
            value: 'Unknown',
          },
        ],
      },
      knowledge: [
        {
          spaceKey: 'support.faq',
        },
      ],
    };

    const integrationRegistry = new IntegrationSpecRegistry();

    const knowledgeRegistry = new KnowledgeSpaceRegistry().register({
      meta: {
        key: 'support.faq',
        version: 1,
        category: 'external',
        displayName: 'Support FAQ',
        title: 'Support FAQ',
        description: 'External support knowledge base.',
        domain: 'knowledge',
        owners: ['product.artisanos'],
        tags: [],
        stability: 'experimental',
      },
      retention: {},
      access: {
        trustLevel: 'low',
        automationWritable: false,
      },
    });

    const context = {
      integrationSpecs: integrationRegistry,
      tenantConnections: [] as IntegrationConnection[],
      existingConfigs: [tenant],
      translationCatalogs: {
        blueprint: {
          meta: { name: 'example.catalog', version: 1 },
          defaultLocale: 'en',
          supportedLocales: ['en'],
          entries: [
            { key: 'app.title', locale: 'en', value: 'Example' },
            { key: 'app.title', locale: 'fr', value: 'Exemple' },
          ],
        },
        platform: [],
      },
      knowledgeSpaces: knowledgeRegistry,
      knowledgeSources: [],
    };

    const result = validateTenantConfig(baseBlueprint, tenant, context);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'MISSING_INTEGRATION_CONNECTION',
          path: 'integrations.payments.primary',
        }),
        expect.objectContaining({
          code: 'MISSING_REQUIRED_SLOT',
          path: 'integrations.payments.primary',
        }),
        expect.objectContaining({
          code: 'INVALID_DOMAIN',
          path: 'branding.customDomain',
        }),
        expect.objectContaining({
          code: 'UNKNOWN_TRANSLATION_KEY',
          path: 'translationOverrides.entries[0]',
        }),
        expect.objectContaining({
          code: 'UNSUPPORTED_LOCALE',
          path: 'locales.enabledLocales',
        }),
        expect.objectContaining({
          code: 'MISSING_KNOWLEDGE_SOURCES',
          path: 'knowledge[0]',
        }),
        expect.objectContaining({
          code: 'INSECURE_ASSET_URL',
          path: 'branding.assets[0].url',
        }),
      ])
    );
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'LOCALE_NOT_ENABLED',
          path: 'locales.enabledLocales',
        }),
        expect.objectContaining({
          code: 'LOW_TRUST_KNOWLEDGE',
          path: 'knowledge[0]',
        }),
      ])
    );
  });
});

describe('validateResolvedConfig', () => {
  it('ensures required integration slots are satisfied in resolved config', () => {
    const resolved: ResolvedAppConfig = {
      appId: 'example',
      tenantId: 'tenant-a',
      blueprintName: baseBlueprint.meta.name,
      blueprintVersion: baseBlueprint.meta.version,
      configVersion: 4,
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
        blueprintCatalog: baseBlueprint.translationCatalog,
        tenantOverrides: [],
      },
      branding: {
        appName: 'Example',
        assets: {},
        colors: { primary: '#000000', secondary: '#ffffff' },
        domain: 'tenant-a.example.app',
      },
    };

    const result = validateResolvedConfig(baseBlueprint, resolved);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'MISSING_REQUIRED_SLOT',
          path: 'integrations.payments.primary',
        }),
      ])
    );
  });
});
