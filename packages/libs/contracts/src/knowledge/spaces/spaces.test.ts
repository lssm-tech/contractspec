import { describe, expect, it } from 'vitest';
import { KnowledgeSpaceRegistry } from '../spec';
import {
  productCanonKnowledgeSpace,
  registerProductCanonKnowledgeSpace,
} from './product-canon';
import {
  registerSupportFaqKnowledgeSpace,
  supportFaqKnowledgeSpace,
} from './support-faq';

describe('knowledge space specs', () => {
  it('registers Product Canon knowledge space', () => {
    const registry = registerProductCanonKnowledgeSpace(
      new KnowledgeSpaceRegistry()
    );
    const registered = registry.get('knowledge.product-canon', 1);
    expect(registered).toBe(productCanonKnowledgeSpace);
    expect(registered?.access.trustLevel).toBe('high');
    expect(registered?.access.automationWritable).toBe(false);
  });

  it('registers Support FAQ knowledge space', () => {
    const registry = registerSupportFaqKnowledgeSpace(
      new KnowledgeSpaceRegistry()
    );
    const registered = registry.get('knowledge.support-faq', 1);
    expect(registered).toBe(supportFaqKnowledgeSpace);
    expect(registered?.access.trustLevel).toBe('medium');
    expect(registered?.retention.ttlDays).toBe(365);
  });
});

