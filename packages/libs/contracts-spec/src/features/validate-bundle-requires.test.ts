import { describe, expect, it } from 'bun:test';
import { defineFeature } from './types';
import { FeatureRegistry } from './registry';
import { validateBundleRequires } from './validate-bundle-requires';

const AiChatFeature = defineFeature({
  meta: {
    key: 'ai-chat',
    version: '1.0.0',
    title: 'AI Chat',
    description: 'AI chat feature for bundle spec alignment test',
    domain: 'platform',
    owners: ['@platform'],
    tags: ['ai'],
    stability: 'experimental',
  },
  operations: [],
  events: [],
  presentations: [],
  opToPresentation: [],
  presentationsTargets: [],
});

describe('validateBundleRequires', () => {
  it('returns valid when all required features exist', () => {
    const registry = new FeatureRegistry().register(AiChatFeature);
    const result = validateBundleRequires(
      [{ key: 'ai-chat', version: '1.0.0' }],
      registry
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.missing).toHaveLength(0);
  });

  it('returns invalid when required feature is missing', () => {
    const registry = new FeatureRegistry().register(AiChatFeature);
    const result = validateBundleRequires(
      [
        { key: 'ai-chat', version: '1.0.0' },
        { key: 'metering', version: '1.0.0' },
      ],
      registry
    );
    expect(result.valid).toBe(false);
    expect(result.missing).toEqual([{ key: 'metering', version: '1.0.0' }]);
    expect(result.errors).toContain(
      'Required feature "metering" not found in registry'
    );
  });

  it('reports version mismatch when versions differ', () => {
    const registry = new FeatureRegistry().register(AiChatFeature);
    const result = validateBundleRequires(
      [{ key: 'ai-chat', version: '2.0.0' }],
      registry
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('version mismatch'))).toBe(
      true
    );
  });
});
