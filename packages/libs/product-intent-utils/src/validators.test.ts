import { describe, expect, it } from 'bun:test';
import {
  validateInsightExtraction,
  validateOpportunityBrief,
} from './validators';
import type { EvidenceChunk } from '@contractspec/lib.contracts/product-intent/types';

const evidence: EvidenceChunk[] = [
  {
    chunkId: 'EV-001',
    text: 'Admins struggle with activation and setup time.',
    meta: { source: 'interview' },
  },
];

describe('product-intent validators', () => {
  it('validates insight extraction with exact citations', () => {
    const raw = JSON.stringify({
      insights: [
        {
          insightId: 'ins-1',
          claim: 'Admins struggle with activation and setup time.',
          citations: [
            {
              chunkId: 'EV-001',
              quote: 'Admins struggle with activation and setup time.',
            },
          ],
        },
      ],
    });

    const parsed = validateInsightExtraction(raw, evidence);
    expect(parsed.insights.length).toBe(1);
  });

  it('rejects citations that are not exact substrings', () => {
    const raw = JSON.stringify({
      insights: [
        {
          insightId: 'ins-1',
          claim: 'Admins struggle with activation.',
          citations: [
            {
              chunkId: 'EV-001',
              quote: 'Nonexistent quote',
            },
          ],
        },
      ],
    });

    expect(() => validateInsightExtraction(raw, evidence)).toThrow();
  });

  it('validates opportunity brief with required citations', () => {
    const raw = JSON.stringify({
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
        citations: [{ chunkId: 'EV-001', quote: 'activation' }],
      },
      expectedImpact: {
        metric: 'activation_rate',
        direction: 'up',
      },
      confidence: 'medium',
      risks: [],
    });

    const parsed = validateOpportunityBrief(raw, evidence);
    expect(parsed.title).toBe('Reduce setup time');
  });
});
