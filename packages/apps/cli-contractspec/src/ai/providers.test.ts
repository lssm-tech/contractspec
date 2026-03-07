import { describe, expect, it } from 'bun:test';
import { DEFAULT_CONTRACTSRC } from '@contractspec/lib.contracts-spec/workspace-config';

import { getRecommendedModels, validateProvider } from './providers';

describe('AI providers', () => {
  it('returns Mistral recommended models', () => {
    const models = getRecommendedModels('mistral');
    expect(models).toContain('mistral-large-latest');
    expect(models).toContain('devstral-small-latest');
  });

  it('requires Mistral API key when provider is mistral', async () => {
    const previous = process.env.MISTRAL_API_KEY;
    delete process.env.MISTRAL_API_KEY;

    const result = await validateProvider({
      ...DEFAULT_CONTRACTSRC,
      aiProvider: 'mistral',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('MISTRAL_API_KEY');

    if (previous === undefined) {
      delete process.env.MISTRAL_API_KEY;
    } else {
      process.env.MISTRAL_API_KEY = previous;
    }
  });
});
