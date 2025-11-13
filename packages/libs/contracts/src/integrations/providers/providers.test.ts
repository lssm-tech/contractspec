import { describe, expect, it } from 'vitest';
import { IntegrationSpecRegistry } from '../spec';
import {
  registerStripeIntegration,
  stripeIntegrationSpec,
} from './stripe';
import {
  postmarkIntegrationSpec,
  registerPostmarkIntegration,
} from './postmark';
import {
  qdrantIntegrationSpec,
  registerQdrantIntegration,
} from './qdrant';

describe('integration provider specs', () => {
  it('registers Stripe integration', () => {
    const registry = registerStripeIntegration(new IntegrationSpecRegistry());
    const registered = registry.get('payments.stripe', 1);
    expect(registered).toBe(stripeIntegrationSpec);
    expect(registered?.capabilities.provides).toEqual([
      { key: 'payments.psp', version: 1 },
    ]);
  });

  it('registers Postmark integration', () => {
    const registry = registerPostmarkIntegration(new IntegrationSpecRegistry());
    const registered = registry.get('email.postmark', 1);
    expect(registered).toBe(postmarkIntegrationSpec);
    expect(registered?.configSchema.schema).toMatchObject({
      type: 'object',
      required: ['serverToken'],
    });
  });

  it('registers Qdrant integration', () => {
    const registry = registerQdrantIntegration(new IntegrationSpecRegistry());
    const registered = registry.get('vectordb.qdrant', 1);
    expect(registered).toBe(qdrantIntegrationSpec);
    expect(registered?.capabilities.provides).toEqual([
      { key: 'vector-db.search', version: 1 },
      { key: 'vector-db.storage', version: 1 },
    ]);
  });
});

