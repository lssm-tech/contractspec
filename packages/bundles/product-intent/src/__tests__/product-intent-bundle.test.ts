import { describe, expect, it } from 'bun:test';
import type { LanguageModel } from 'ai';
import { StabilityEnum } from '@contractspec/lib.contracts/ownership';
import type { EvidenceChunk } from '@contractspec/lib.contracts/product-intent/types';
import type { ProductIntentMeta } from '@contractspec/lib.contracts/product-intent/spec';
import { createAiProductIntentRunner } from '../ai-runner';
import { createProductIntentService } from '../service';
import type { ProductIntentModelRunner } from '@contractspec/module.product-intent-core';

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
    chunkId: 'EV-100',
    text: 'Admins struggle with setup time.',
    meta: { source: 'interview' },
  },
];

const stubRunner: ProductIntentModelRunner = {
  async generateJson(prompt: string) {
    if (prompt.includes('ATOMIC')) {
      return JSON.stringify({
        insights: [
          {
            insightId: 'ins-1',
            claim: 'Admins struggle with setup time.',
            citations: [
              { chunkId: 'EV-100', quote: 'Admins struggle with setup time.' },
            ],
          },
        ],
      });
    }
    if (prompt.includes('opportunity brief')) {
      return JSON.stringify({
        opportunityId: 'opp-1',
        title: 'Reduce setup time',
        problem: {
          text: 'Setup time is too long.',
          citations: [{ chunkId: 'EV-100', quote: 'setup time' }],
        },
        who: {
          text: 'Admins',
          citations: [{ chunkId: 'EV-100', quote: 'Admins' }],
        },
        proposedChange: {
          text: 'Add guided setup.',
          citations: [{ chunkId: 'EV-100', quote: 'setup' }],
        },
        expectedImpact: {
          metric: 'activation_rate',
          direction: 'up',
        },
        confidence: 'medium',
        risks: [],
      });
    }
    if (prompt.includes('ContractPatchIntent')) {
      return JSON.stringify({
        featureKey: 'activation_onboarding',
        changes: [
          {
            type: 'add_field',
            target: 'User.onboardingStep',
            detail: 'Track onboarding step',
          },
        ],
        acceptanceCriteria: ['Users can resume onboarding'],
      });
    }
    if (prompt.includes('GENERIC spec overlay')) {
      return JSON.stringify({
        overlay: {
          adds: [
            {
              path: 'features.activation.fields.onboardingStep',
              value: { type: 'string' },
            },
          ],
        },
      });
    }
    if (prompt.includes('Impact Report')) {
      return JSON.stringify({
        reportId: 'impact-1',
        patchId: 'patch-1',
        summary: 'Adds onboarding step tracking',
        surfaces: {
          api: ['user.update'],
        },
      });
    }
    if (prompt.includes('Task Pack')) {
      return JSON.stringify({
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
      });
    }
    throw new Error('Unexpected prompt');
  },
};

describe('product-intent bundle', () => {
  it('creates an AI runner with an injected generateText', async () => {
    const runner = createAiProductIntentRunner({
      model: {} as LanguageModel,
      generateTextFn: async () => ({ text: '{"ok":true}' }),
    });

    const result = await runner.generateJson('hello');
    expect(result).toBe('{"ok":true}');
  });

  it('creates a product intent service using a custom runner', async () => {
    const service = createProductIntentService({
      model: {} as LanguageModel,
      evidence,
      modelRunner: stubRunner,
    });

    const spec = await service.runDiscovery({
      id: 'run-1',
      meta,
      question: 'How do we improve setup?',
      baseSpecSnippet: 'feature: activation',
    });

    expect(spec.patchIntent?.featureKey).toBe('activation_onboarding');
  });
});
