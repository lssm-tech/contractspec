import { defineCommand } from '@lssm/lib.contracts';
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
    version: 1,
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
});

/**
 * Accept a quote.
 */
export const AcceptQuoteContract = defineCommand({
  meta: {
    key: 'service.quote.accept',
    version: 1,
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
});
