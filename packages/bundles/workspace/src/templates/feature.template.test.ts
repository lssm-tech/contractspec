
import { describe, it, expect } from 'bun:test';
import { generateFeatureSpec, type FeatureSpecParams } from './feature.template';

describe('generateFeatureSpec', () => {
  it('should generate a feature spec with basic params', () => {
    const params: FeatureSpecParams = {
        key: 'my-feature',
        title: 'My Feature',
        owners: ['team-a'],
        tags: ['web'],
        operations: [],
        events: [],
        presentations: [],
        experiments: [],
    };
    const code = generateFeatureSpec(params);
    expect(code).toContain('export const myFeatureFeature = defineFeature({');
    expect(code).toContain("key: 'my-feature'");
    expect(code).toContain("owners: ['team-a']");
  });

  it('should include references', () => {
    const params: FeatureSpecParams = {
        key: 'my-feature',
        title: 'My Feature',
        owners: [],
        tags: [],
        operations: [{ name: 'op1', version: '1.0.0'}],
        events: [{ name: 'ev1', version: '1.0.0'}],
        presentations: [{ name: 'pres1', version: '1.0.0'}],
        experiments: [{ name: 'exp1', version: '1.0.0'}],
    };
    const code = generateFeatureSpec(params);
    expect(code).toContain("{ name: 'op1', version: '1.0.0' }");
    expect(code).toContain("{ name: 'ev1', version: '1.0.0' }");
    expect(code).toContain("{ name: 'pres1', version: '1.0.0' }");
    expect(code).toContain("{ name: 'exp1', version: '1.0.0' }");
  });

  it('should use defaults', () => {
      const params: FeatureSpecParams = {
        key: 'my-feature',
        title: 'My Feature',
        owners: [],
        tags: [],
        operations: [],
        events: [],
        presentations: [],
        experiments: [],
    };
    const code = generateFeatureSpec(params);
    expect(code).toContain("stability: 'alpha'");
    expect(code).toContain("// Add operations here");
  });
});
