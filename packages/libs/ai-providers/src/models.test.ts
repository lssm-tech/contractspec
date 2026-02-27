import { describe, expect, it } from 'bun:test';

import {
  DEFAULT_MODELS,
  getModelsForProvider,
  getRecommendedModels,
} from './models';

describe('models', () => {
  it('keeps Mistral default model configured', () => {
    expect(DEFAULT_MODELS.mistral).toBe('mistral-large-latest');
  });

  it('includes current Mistral model families', () => {
    const mistralModels = getModelsForProvider('mistral').map(
      (model) => model.id
    );

    expect(mistralModels).toEqual(
      expect.arrayContaining([
        'mistral-large-latest',
        'mistral-medium-latest',
        'mistral-small-latest',
        'codestral-latest',
        'devstral-small-latest',
        'magistral-medium-latest',
        'pixtral-large-latest',
      ])
    );
  });

  it('returns Mistral recommendations including coding and reasoning options', () => {
    const recommended = getRecommendedModels('mistral');
    expect(recommended).toContain('devstral-small-latest');
    expect(recommended).toContain('magistral-medium-latest');
  });
});
