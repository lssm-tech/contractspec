import { describe, it, expect } from 'vitest';
import { defineTranslation, type TranslationSpec } from './spec';

describe('defineTranslation', () => {
  it('should return the same spec with type inference', () => {
    const spec: TranslationSpec = {
      meta: {
        key: 'test.messages',
        version: '1.0.0',
        domain: 'test',
        owners: ['test'],
      },
      locale: 'en',
      messages: {
        greeting: {
          value: 'Hello, {name}!',
          description: 'Greeting message',
          placeholders: [
            { name: 'name', type: 'string', description: 'User name' },
          ],
        },
      },
    };

    const result = defineTranslation(spec);

    expect(result).toEqual(spec);
    expect(result.meta.key).toBe('test.messages');
    expect(result.locale).toBe('en');
    expect(result.messages['greeting']?.value).toBe('Hello, {name}!');
  });

  it('should support full spec with all options', () => {
    const spec = defineTranslation({
      meta: {
        key: 'payments.messages',
        version: '2.0.0',
        domain: 'payments',
        description: 'Payment related messages',
        owners: ['payments'],
        tags: ['payments', 'user-facing'],
      },
      locale: 'en',
      fallback: 'en-US',
      messages: {
        'payment.amount': {
          value: '{amount, number, currency}',
          description: 'Formatted payment amount',
          context: 'Shown in payment summary',
          placeholders: [
            {
              name: 'amount',
              type: 'currency',
              format: 'USD',
              example: '100.00',
            },
          ],
          maxLength: 50,
          tags: ['amount', 'currency'],
        },
        'items.count': {
          value: '{count, plural, one {1 item} other {{count} items}}',
          description: 'Item count with pluralization',
          placeholders: [
            { name: 'count', type: 'plural', description: 'Number of items' },
          ],
        },
        'greeting.formal': {
          value: 'Dear {title} {name}',
          variants: [
            { type: 'formality', key: 'informal', value: 'Hey {name}!' },
            { type: 'gender', key: 'male', value: 'Dear Mr. {name}' },
            { type: 'gender', key: 'female', value: 'Dear Ms. {name}' },
          ],
        },
      },
      pluralRules: [
        {
          variable: 'count',
          rules: [
            { category: 'one', value: '1 item' },
            { category: 'other', value: '{count} items' },
          ],
        },
      ],
      tags: ['v2', 'production'],
    });

    expect(spec.meta.version).toBe('2.0.0');
    expect(spec.fallback).toBe('en-US');
    expect(spec.messages['payment.amount']?.placeholders?.[0]?.type).toBe(
      'currency'
    );
    expect(spec.messages['greeting.formal']?.variants).toHaveLength(3);
    expect(spec.pluralRules).toHaveLength(1);
  });
});
