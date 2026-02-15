import { describe, expect, it } from 'bun:test';
import { ProductIntentRegistry } from '@contractspec/lib.contracts-spec/product-intent/registry';
import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import type { EvidenceChunk } from '@contractspec/lib.contracts-spec/product-intent/types';
import type { ProductIntentMeta } from '@contractspec/lib.contracts-spec/product-intent/spec';
import { ProductIntentOrchestrator } from '../orchestrator/product-intent-orchestrator';
import type { ProductIntentModelRunner } from '../types';

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

const responses = {
  insights: JSON.stringify({
    insights: [
      {
        insightId: 'ins-1',
        claim: 'Admins struggle with setup time.',
        citations: [
          { chunkId: 'EV-001', quote: 'Admins struggle with setup time.' },
        ],
      },
    ],
  }),
  brief: JSON.stringify({
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
  }),
  patchIntent: JSON.stringify({
    featureKey: 'activation_onboarding',
    changes: [
      {
        type: 'add_field',
        target: 'User.onboardingStep',
        detail: 'Track onboarding step',
      },
    ],
    acceptanceCriteria: ['Users can resume onboarding'],
  }),
  patch: JSON.stringify({
    overlay: {
      adds: [
        {
          path: 'features.activation.fields.onboardingStep',
          value: { type: 'string' },
        },
      ],
    },
  }),
  impact: JSON.stringify({
    reportId: 'impact-1',
    patchId: 'patch-1',
    summary: 'Adds onboarding step tracking',
    surfaces: {
      api: ['user.update'],
    },
  }),
  tasks: JSON.stringify({
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
      {
        id: 't2',
        title: 'Update API',
        surface: ['api'],
        why: 'Expose field',
        acceptance: ['API returns onboardingStep'],
        agentPrompt: 'Update user update response',
      },
      {
        id: 't3',
        title: 'Add UI stepper',
        surface: ['ui'],
        why: 'Guide users',
        acceptance: ['Stepper visible'],
        agentPrompt: 'Add onboarding stepper component',
      },
    ],
  }),
};

const modelRunner: ProductIntentModelRunner = {
  async generateJson(prompt: string) {
    if (prompt.includes('ATOMIC')) return responses.insights;
    if (prompt.includes('opportunity brief')) return responses.brief;
    if (prompt.includes('ContractPatchIntent')) return responses.patchIntent;
    if (prompt.includes('GENERIC spec overlay')) return responses.patch;
    if (prompt.includes('Impact Report')) return responses.impact;
    if (prompt.includes('Task Pack')) return responses.tasks;
    throw new Error('Unexpected prompt');
  },
};

describe('ProductIntentOrchestrator', () => {
  it('runs the discovery loop end-to-end', async () => {
    const registry = new ProductIntentRegistry();
    const orchestrator = new ProductIntentOrchestrator<{ tenantId: string }>(
      {
        fetchEvidence: async () => evidence,
        modelRunner,
      },
      registry
    );

    const spec = await orchestrator.runDiscovery({
      id: 'run-1',
      meta,
      question: 'How do we improve activation?',
      context: { tenantId: 't-1' },
      baseSpecSnippet: 'feature: activation',
      repoContext: 'packages/bundles',
    });

    expect(spec.meta.key).toBe(meta.key);
    expect(spec.runtimeContext?.tenantId).toBe('t-1');
    expect(spec.brief?.title).toBe('Reduce setup time');
    expect(spec.patchIntent?.featureKey).toBe('activation_onboarding');
    expect(spec.patch?.overlay.adds?.length).toBe(1);

    const stored = registry.get(meta.key, meta.version);
    expect(stored?.id).toBe('run-1');
  });
});
