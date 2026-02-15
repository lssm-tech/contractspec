import { describe, expect, it } from 'bun:test';
import { ProductIntentRuntime } from './runtime';
import { ProductIntentRegistry } from './registry';
import { StabilityEnum } from '../ownership';
import type {
  ContractPatchIntent,
  ContractSpecPatch,
  EvidenceChunk,
  ImpactReport,
  InsightExtraction,
  OpportunityBrief,
  TaskPack,
} from './types';
import type { ProductIntentMeta } from './spec';

const meta: ProductIntentMeta = {
  key: 'product-intent.activation',
  version: '1.0.0',
  description: 'Activation opportunity',
  stability: StabilityEnum.Experimental,
  owners: ['platform.core'],
  tags: ['product-intent'],
};

const evidence: EvidenceChunk[] = [
  {
    chunkId: 'EV-001',
    text: 'Admins struggle with setup time.',
    meta: { source: 'interview' },
  },
];

class TestRuntime extends ProductIntentRuntime<{ tenantId: string }> {
  protected async extractInsights(): Promise<InsightExtraction> {
    return {
      insights: [
        {
          insightId: 'ins-1',
          claim: 'Admins struggle with setup time.',
          citations: [{ chunkId: 'EV-001', quote: 'Admins struggle' }],
        },
      ],
    };
  }

  protected async synthesiseBrief(): Promise<OpportunityBrief> {
    return {
      opportunityId: 'opp-1',
      title: 'Reduce setup time',
      problem: {
        text: 'Setup time is too long.',
        citations: [{ chunkId: 'EV-001', quote: 'setup time' }],
      },
      who: {
        text: 'Admins',
        citations: [{ chunkId: 'EV-001', quote: 'Admins' }],
      },
      proposedChange: {
        text: 'Add guided setup.',
        citations: [{ chunkId: 'EV-001', quote: 'setup' }],
      },
      expectedImpact: {
        metric: 'activation_rate',
        direction: 'up',
      },
      confidence: 'medium',
      risks: [],
    };
  }

  protected async generatePatchIntent(): Promise<ContractPatchIntent> {
    return {
      featureKey: 'activation_onboarding',
      changes: [
        {
          type: 'add_field',
          target: 'User.onboardingStep',
          detail: 'Track onboarding step',
        },
      ],
      acceptanceCriteria: ['Users can resume onboarding'],
    };
  }

  protected async generatePatch(): Promise<ContractSpecPatch> {
    return {
      overlay: {
        adds: [
          {
            path: 'features.activation.fields.onboardingStep',
            value: { type: 'string' },
          },
        ],
      },
    };
  }

  protected async generateImpactReport(): Promise<ImpactReport> {
    return {
      reportId: 'impact-1',
      patchId: 'patch-1',
      summary: 'Adds onboarding step tracking',
      surfaces: {
        api: ['user.update'],
      },
    };
  }

  protected async generateTasks(): Promise<TaskPack> {
    return {
      packId: 'tasks-1',
      patchId: 'patch-1',
      overview: 'Implement onboarding tracking',
      tasks: [
        {
          id: 't1',
          title: 'Add onboarding field',
          surface: ['db'],
          why: 'Track step',
          acceptance: ['Field exists'],
          agentPrompt: 'Add onboardingStep column',
        },
      ],
    };
  }
}

describe('ProductIntentRuntime', () => {
  it('runs discovery and registers the spec', async () => {
    const registry = new ProductIntentRegistry();
    const runtime = new TestRuntime(
      {
        fetchEvidence: async () => evidence,
      },
      registry
    );

    const spec = await runtime.runDiscovery({
      id: 'run-1',
      meta,
      question: 'How do we improve activation?',
      context: { tenantId: 't-1' },
    });

    expect(spec.meta.key).toBe(meta.key);
    expect(spec.runtimeContext?.tenantId).toBe('t-1');
    expect(spec.patchIntent?.featureKey).toBe('activation_onboarding');

    const stored = registry.get(meta.key, meta.version);
    expect(stored?.id).toBe('run-1');
  });
});
