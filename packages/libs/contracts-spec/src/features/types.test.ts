import { describe, expect, it } from 'bun:test';
import type {
  OpRef,
  EventRef,
  PresentationRef,
  DataViewRef,
  FormRef,
  WorkflowRef,
  KnowledgeRef,
  TelemetryRef,
  IntegrationRef,
  JobRef,
  DocRef,
  PolicyRef,
  TranslationRef,
  FeatureModuleSpec,
  FeatureModuleMeta,
  FeatureRef,
} from './types';
import { StabilityEnum } from '../ownership';

describe('OpRef', () => {
  it('should define operation reference', () => {
    const ref: OpRef = { key: 'user.create', version: '1.0.0' };
    expect(ref.key).toBe('user.create');
    expect(ref.version).toBe('1.0.0');
  });
});

describe('EventRef', () => {
  it('should define event reference', () => {
    const ref: EventRef = { key: 'user.created', version: '1.0.0' };
    expect(ref.key).toBe('user.created');
    expect(ref.version).toBe('1.0.0');
  });
});

describe('PresentationRef', () => {
  it('should define presentation reference', () => {
    const ref: PresentationRef = { key: 'user.profile', version: '1.0.0' };
    expect(ref.key).toBe('user.profile');
    expect(ref.version).toBe('1.0.0');
  });
});

describe('DataViewRef', () => {
  it('should define data view reference', () => {
    const ref: DataViewRef = { key: 'dashboard.overview', version: '1.0.0' };
    expect(ref.key).toBe('dashboard.overview');
    expect(ref.version).toBe('1.0.0');
  });
});

describe('FormRef', () => {
  it('should define form reference', () => {
    const ref: FormRef = { key: 'user.profile.edit', version: '1.0.0' };
    expect(ref.key).toBe('user.profile.edit');
    expect(ref.version).toBe('1.0.0');
  });
});

describe('FeatureRef', () => {
  it('should define feature reference', () => {
    const ref: FeatureRef = { key: 'payments.stripe' };
    expect(ref.key).toBe('payments.stripe');
  });
});

describe('FeatureModuleMeta', () => {
  it('should extend OwnerShipMeta', () => {
    const meta: FeatureModuleMeta = {
      key: 'payments.stripe',
      version: '1.0.0',
      title: 'Stripe Payments',
      description: 'Enable Stripe payment processing',
      stability: StabilityEnum.Stable,
      owners: ['platform.payments'],
      tags: ['payments', 'stripe'],
    };

    expect(meta.key).toBe('payments.stripe');
    expect(meta.stability).toBe('stable');
  });
});

describe('FeatureModuleSpec', () => {
  const createFeature = (
    overrides?: Partial<FeatureModuleSpec>
  ): FeatureModuleSpec => ({
    meta: {
      key: 'test.feature',
      version: '1.0.0',
      title: 'Test Feature',
      description: 'A test feature',
      stability: StabilityEnum.Experimental,
      owners: ['platform.core'],
      tags: ['test'],
    },
    ...overrides,
  });

  it('should define minimal feature', () => {
    const feature = createFeature();
    expect(feature.meta.key).toBe('test.feature');
  });

  it('should support operations', () => {
    const feature = createFeature({
      operations: [
        { key: 'user.create', version: '1.0.0' },
        { key: 'user.update', version: '1.0.0' },
      ],
    });

    expect(feature.operations).toHaveLength(2);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(feature.operations![0]!.key).toBe('user.create');
  });

  it('should support events', () => {
    const feature = createFeature({
      events: [
        { key: 'user.created', version: '1.0.0' },
        { key: 'user.updated', version: '1.0.0' },
      ],
    });

    expect(feature.events).toHaveLength(2);
  });

  it('should support presentations', () => {
    const feature = createFeature({
      presentations: [
        { key: 'user.profile', version: '1.0.0' },
        { key: 'user.settings', version: '1.0.0' },
      ],
    });

    expect(feature.presentations).toHaveLength(2);
  });

  it('should support capabilities', () => {
    const feature = createFeature({
      capabilities: {
        provides: [{ key: 'payments.stripe', version: '1.0.0' }],
        requires: [{ key: 'auth.session', version: '1.0.0', optional: false }],
      },
    });

    expect(feature.capabilities?.provides).toHaveLength(1);
    expect(feature.capabilities?.requires).toHaveLength(1);
  });

  it('should support opToPresentation links', () => {
    const feature = createFeature({
      opToPresentation: [
        {
          op: { key: 'user.create', version: '1.0.0' },
          pres: { key: 'user.create.form', version: '1.0.0' },
        },
      ],
    });

    expect(feature.opToPresentation).toHaveLength(1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(feature.opToPresentation![0]!.op.key).toBe('user.create');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(feature.opToPresentation![0]!.pres.key).toBe('user.create.form');
  });

  it('should support presentationsTargets', () => {
    const feature = createFeature({
      presentationsTargets: [
        {
          key: 'user.profile',
          version: '1.0.0',
          targets: ['react', 'markdown'],
        },
      ],
    });

    expect(feature.presentationsTargets).toHaveLength(1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(feature.presentationsTargets![0]!.targets).toContain('react');
  });

  it('should support implementations', () => {
    const feature = createFeature({
      implementations: [
        {
          path: 'src/features/payments/stripe.ts',
          type: 'service',
          description: 'Stripe payment service',
        },
      ],
    });

    expect(feature.implementations).toHaveLength(1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(feature.implementations![0]!.type).toBe('service');
  });

  it('should support dataViews', () => {
    const feature = createFeature({
      dataViews: [
        { key: 'dashboard.overview', version: '1.0.0' },
        { key: 'user.list', version: '1.0.0' },
      ],
    });
    expect(feature.dataViews).toHaveLength(2);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(feature.dataViews![0]!.key).toBe('dashboard.overview');
  });

  it('should support forms', () => {
    const feature = createFeature({
      forms: [
        { key: 'user.profile.edit', version: '1.0.0' },
        { key: 'settings.general', version: '1.0.0' },
      ],
    });
    expect(feature.forms).toHaveLength(2);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(feature.forms![0]!.key).toBe('user.profile.edit');
  });

  it('should support workflows', () => {
    const feature = createFeature({
      workflows: [{ key: 'onboarding.flow', version: '1.0.0' }],
    });
    expect(feature.workflows).toHaveLength(1);
  });

  it('should support knowledge', () => {
    const feature = createFeature({
      knowledge: [{ key: 'docs.canonical', version: '1.0.0' }],
    });
    expect(feature.knowledge).toHaveLength(1);
  });

  it('should support telemetry', () => {
    const feature = createFeature({
      telemetry: [{ key: 'payments.telemetry', version: '1.0.0' }],
    });
    expect(feature.telemetry).toHaveLength(1);
  });

  it('should support policies', () => {
    const feature = createFeature({
      policies: [{ key: 'payments.access', version: '1.0.0' }],
    });
    expect(feature.policies).toHaveLength(1);
  });

  it('should support integrations', () => {
    const feature = createFeature({
      integrations: [{ key: 'stripe', version: '1.0.0' }],
    });
    expect(feature.integrations).toHaveLength(1);
  });

  it('should support jobs', () => {
    const feature = createFeature({
      jobs: [{ key: 'payments.reconcile', version: '1.0.0' }],
    });
    expect(feature.jobs).toHaveLength(1);
  });

  it('should support translations', () => {
    const feature = createFeature({
      translations: [{ key: 'payments.messages', version: '1.0.0' }],
    });
    expect(feature.translations).toHaveLength(1);
  });

  it('should support docs', () => {
    const feature = createFeature({
      docs: ['docs.tech.payments.overview'],
    });
    expect(feature.docs).toHaveLength(1);
  });
});

describe('WorkflowRef', () => {
  it('should define workflow reference', () => {
    const ref: WorkflowRef = { key: 'onboarding.flow', version: '1.0.0' };
    expect(ref.key).toBe('onboarding.flow');
  });
});

describe('KnowledgeRef', () => {
  it('should define knowledge reference', () => {
    const ref: KnowledgeRef = { key: 'docs.canonical', version: '1.0.0' };
    expect(ref.key).toBe('docs.canonical');
  });
});

describe('TelemetryRef', () => {
  it('should define telemetry reference', () => {
    const ref: TelemetryRef = { key: 'payments.telemetry', version: '1.0.0' };
    expect(ref.key).toBe('payments.telemetry');
  });
});

describe('IntegrationRef', () => {
  it('should define integration reference', () => {
    const ref: IntegrationRef = { key: 'stripe', version: '1.0.0' };
    expect(ref.key).toBe('stripe');
  });
});

describe('JobRef', () => {
  it('should define job reference', () => {
    const ref: JobRef = { key: 'payments.reconcile', version: '1.0.0' };
    expect(ref.key).toBe('payments.reconcile');
  });
});

describe('DocRef', () => {
  it('should be a string referencing a DocBlock id', () => {
    const ref: DocRef = 'docs.tech.payments.overview';
    expect(ref).toBe('docs.tech.payments.overview');
  });
});

describe('PolicyRef', () => {
  it('should define policy reference', () => {
    const ref: PolicyRef = { key: 'payments.access', version: '1.0.0' };
    expect(ref.key).toBe('payments.access');
  });
});

describe('TranslationRef', () => {
  it('should define translation reference', () => {
    const ref: TranslationRef = { key: 'payments.messages', version: '1.0.0' };
    expect(ref.key).toBe('payments.messages');
  });
});
