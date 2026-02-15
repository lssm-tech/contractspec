import { describe, expect, it } from 'bun:test';
import { KnowledgeSpaceRegistry } from '../spec';
import {
  productCanonKnowledgeSpace,
  registerProductCanonKnowledgeSpace,
} from './product-canon';
import {
  registerSupportFaqKnowledgeSpace,
  supportFaqKnowledgeSpace,
} from './support-faq';
import {
  emailThreadsKnowledgeSpace,
  registerEmailThreadsKnowledgeSpace,
} from './email-threads';
import {
  uploadedDocsKnowledgeSpace,
  registerUploadedDocsKnowledgeSpace,
} from './uploaded-docs';
import {
  financialDocsKnowledgeSpace,
  registerFinancialDocsKnowledgeSpace,
} from './financial-docs';

describe('knowledge space specs', () => {
  it('registers Product Canon knowledge space', () => {
    const registry = registerProductCanonKnowledgeSpace(
      new KnowledgeSpaceRegistry()
    );
    const registered = registry.get('knowledge.product-canon', '1.0.0');
    expect(registered).toBe(productCanonKnowledgeSpace);
    expect(registered?.access.trustLevel).toBe('high');
    expect(registered?.access.automationWritable).toBe(false);
  });

  it('registers Support FAQ knowledge space', () => {
    const registry = registerSupportFaqKnowledgeSpace(
      new KnowledgeSpaceRegistry()
    );
    const registered = registry.get('knowledge.support-faq', '1.0.0');
    expect(registered).toBe(supportFaqKnowledgeSpace);
    expect(registered?.access.trustLevel).toBe('medium');
    expect(registered?.retention.ttlDays).toBe(365);
  });

  it('registers Email Threads knowledge space', () => {
    const registry = registerEmailThreadsKnowledgeSpace(
      new KnowledgeSpaceRegistry()
    );
    const registered = registry.get('knowledge.email-threads', '1.0.0');
    expect(registered).toBe(emailThreadsKnowledgeSpace);
    expect(registered?.access.automationWritable).toBe(true);
  });

  it('registers Uploaded Docs knowledge space', () => {
    const registry = registerUploadedDocsKnowledgeSpace(
      new KnowledgeSpaceRegistry()
    );
    const registered = registry.get('knowledge.uploaded-docs', '1.0.0');
    expect(registered).toBe(uploadedDocsKnowledgeSpace);
    expect(registered?.retention.ttlDays).toBeNull();
  });

  it('registers Financial Docs knowledge space', () => {
    const registry = registerFinancialDocsKnowledgeSpace(
      new KnowledgeSpaceRegistry()
    );
    const registered = registry.get('knowledge.financial-docs', '1.0.0');
    expect(registered).toBe(financialDocsKnowledgeSpace);
    expect(registered?.access.trustLevel).toBe('high');
  });
});
