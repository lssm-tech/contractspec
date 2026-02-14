import { defineCommand } from '@contractspec/lib.contracts-spec';
import {
  AcceptQuoteInputModel,
  CreateQuoteInputModel,
  QuoteModel,
} from './quote.schema';

const OWNERS = ['@examples.service-business-os'] as const;

/**
 * Create a new quote.
 */
export const CreateQuoteContract = defineCommand({
  meta: {
    key: 'service.quote.create',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-business-os', 'quote', 'create'],
    description: 'Create a quote/proposal.',
    goal: 'Quote clients.',
    context: 'Quote creation.',
  },
  io: {
    input: CreateQuoteInputModel,
    output: QuoteModel,
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'create-quote-happy-path',
        given: ['Client exists'],
        when: ['User creates quote'],
        then: ['Quote is created'],
      },
    ],
    examples: [
      {
        key: 'create-proposal',
        input: {
          clientId: 'client-123',
          items: [{ description: 'Project A', price: 5000 }],
        },
        output: { id: 'quote-123', status: 'draft', total: 5000 },
      },
    ],
  },
});

/**
 * Accept a quote.
 */
export const AcceptQuoteContract = defineCommand({
  meta: {
    key: 'service.quote.accept',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-business-os', 'quote', 'accept'],
    description: 'Accept a quote.',
    goal: 'Confirm quote.',
    context: 'Quote acceptance.',
  },
  io: {
    input: AcceptQuoteInputModel,
    output: QuoteModel,
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'accept-quote-happy-path',
        given: ['Quote is open'],
        when: ['Client accepts quote'],
        then: ['Quote status becomes ACCEPTED'],
      },
    ],
    examples: [
      {
        key: 'client-accepts',
        input: { quoteId: 'quote-123', signature: 'John Doe' },
        output: { id: 'quote-123', status: 'accepted' },
      },
    ],
  },
});
