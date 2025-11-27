import { describe, expect, it } from 'bun:test';

import type {
  ResolvedAppConfig,
  ResolvedKnowledge,
} from '../app-config/runtime';
import type { KnowledgeSpaceSpec } from './spec';
import type { AppKnowledgeBinding } from './binding';
import { KnowledgeAccessGuard } from './runtime';

const baseSpace: KnowledgeSpaceSpec = {
  meta: {
    title: 'Product Canon',
    description: 'Primary product knowledge base',
    domain: 'knowledge',
    owners: ['platform.docs'],
    tags: [],
    stability: 'stable',
    key: 'product-canon',
    version: 1,
    category: 'canonical',
    displayName: 'Product Canon',
  },
  retention: { ttlDays: null },
  access: {
    trustLevel: 'high',
    automationWritable: false,
  },
};

const baseBinding: AppKnowledgeBinding = {
  spaceKey: baseSpace.meta.key,
  spaceVersion: baseSpace.meta.version,
  required: true,
};

function makeResolvedKnowledge(
  overrides: Partial<AppKnowledgeBinding> = {}
): ResolvedKnowledge {
  return {
    binding: { ...baseBinding, ...overrides },
    space: baseSpace,
    sources: [],
  };
}

function makeAppConfig(
  overrides: Partial<ResolvedAppConfig> = {}
): ResolvedAppConfig {
  return {
    appId: 'demo-app',
    tenantId: 'tenant-1',
    blueprintName: 'demo.blueprint',
    blueprintVersion: 1,
    configVersion: 1,
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
      blueprintCatalog: { name: 'demo.catalog', version: 1 },
      tenantOverrides: [],
    },
    branding: {
      appName: 'Demo App',
      assets: {},
      colors: { primary: '#000000', secondary: '#ffffff' },
      domain: 'tenant.demo.localhost',
    },
    ...overrides,
  };
}

describe('KnowledgeAccessGuard', () => {
  it('denies access when space is not bound in resolved app config', () => {
    const guard = new KnowledgeAccessGuard();
    const resolved = makeResolvedKnowledge();
    const appConfig = makeAppConfig({ knowledge: [] });

    const result = guard.checkAccess(
      resolved,
      {
        tenantId: 'tenant-1',
        appId: 'demo-app',
        operation: 'read',
      },
      appConfig
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/is not bound/);
  });

  it('blocks writes to external spaces', () => {
    const guard = new KnowledgeAccessGuard();
    const externalSpace: KnowledgeSpaceSpec = {
      ...baseSpace,
      meta: {
        ...baseSpace.meta,
        key: 'external.faq',
        category: 'external',
      },
    };
    const resolved: ResolvedKnowledge = {
      binding: { ...baseBinding, spaceKey: externalSpace.meta.key },
      space: externalSpace,
      sources: [],
    };
    const appConfig = makeAppConfig({
      knowledge: [resolved],
    });

    const result = guard.checkAccess(
      resolved,
      {
        tenantId: 'tenant-1',
        appId: 'demo-app',
        operation: 'write',
      },
      appConfig
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/read-only/);
  });

  it('requires workflow binding when configured', () => {
    const guard = new KnowledgeAccessGuard({ requireWorkflowBinding: true });
    const resolved = makeResolvedKnowledge({
      scope: { workflows: ['order-processing'] },
    });
    const appConfig = makeAppConfig({ knowledge: [resolved] });

    const result = guard.checkAccess(
      resolved,
      {
        tenantId: 'tenant-1',
        appId: 'demo-app',
        workflowName: 'support-ticket',
        operation: 'read',
      },
      appConfig
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/not authorized/);
  });

  it('allows access for authorized workflow', () => {
    const guard = new KnowledgeAccessGuard({ requireWorkflowBinding: true });
    const resolved = makeResolvedKnowledge({
      scope: { workflows: ['order-processing'] },
    });
    const appConfig = makeAppConfig({ knowledge: [resolved] });

    const result = guard.checkAccess(
      resolved,
      {
        tenantId: 'tenant-1',
        appId: 'demo-app',
        workflowName: 'order-processing',
        operation: 'read',
      },
      appConfig
    );

    expect(result.allowed).toBe(true);
  });

  it('flags ephemeral read access with warning severity', () => {
    const guard = new KnowledgeAccessGuard();
    const ephemeralSpace: KnowledgeSpaceSpec = {
      ...baseSpace,
      meta: {
        ...baseSpace.meta,
        key: 'ephemeral.rag-cache',
        category: 'ephemeral',
      },
    };
    const resolved: ResolvedKnowledge = {
      binding: { ...baseBinding, spaceKey: ephemeralSpace.meta.key },
      space: ephemeralSpace,
      sources: [],
    };
    const appConfig = makeAppConfig({ knowledge: [resolved] });

    const result = guard.checkAccess(
      resolved,
      {
        tenantId: 'tenant-1',
        appId: 'demo-app',
        operation: 'read',
      },
      appConfig
    );

    expect(result.allowed).toBe(true);
    expect(result.severity).toBe('warning');
  });
});
