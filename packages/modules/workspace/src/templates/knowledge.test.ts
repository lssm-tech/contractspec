import { describe, expect, it } from 'bun:test';
import { generateKnowledgeSpaceSpec } from './knowledge';
import type { KnowledgeSpaceSpecData } from '../types/spec-types';

describe('generateKnowledgeSpaceSpec', () => {
  const baseData: KnowledgeSpaceSpecData = {
    name: 'test.knowledge',
    version: '1',
    description: 'Test knowledge space',
    owners: ['team-a'],
    tags: ['test'],
    stability: 'stable',
    title: 'Test Knowledge',
    domain: 'test-domain',
    displayName: 'Test Knowledge',
    category: 'operational',
    retention: { ttlDays: 30 },
    trustLevel: 'high',
    automationWritable: false,
  };

  it('generates a knowledge space spec', () => {
    const code = generateKnowledgeSpaceSpec(baseData);
    expect(code).toContain(
      "import type { KnowledgeSpaceSpec } from '@contractspec/lib.contracts-spec/knowledge/spec'"
    );
    expect(code).toContain(
      'export const KnowledgeKnowledgeSpace: KnowledgeSpaceSpec = {'
    );
    expect(code).toContain("category: 'operational'");
    expect(code).toContain("trustLevel: 'high'");
  });

  it('renders retention policy', () => {
    const data: KnowledgeSpaceSpecData = {
      ...baseData,
      retention: { ttlDays: 365, archiveAfterDays: 30 },
    };
    const code = generateKnowledgeSpaceSpec(data);
    expect(code).toContain('ttlDays: 365');
    expect(code).toContain('archiveAfterDays: 30');
  });

  it('renders indexing options', () => {
    const data: KnowledgeSpaceSpecData = {
      ...baseData,
      embeddingModel: 'text-embedding-3-small',
      chunkSize: 512,
      vectorDbIntegration: 'vec.db',
    };
    const code = generateKnowledgeSpaceSpec(data);
    expect(code).toContain('indexing: {');
    expect(code).toContain("embeddingModel: 'text-embedding-3-small'");
    expect(code).toContain('chunkSize: 512');
    expect(code).toContain("vectorDbIntegration: 'vec.db'");
  });

  it('renders policy reference', () => {
    const data: KnowledgeSpaceSpecData = {
      ...baseData,
      policyName: 'test.policy',
      policyVersion: '1',
    };
    const code = generateKnowledgeSpaceSpec(data);
    expect(code).toContain("policy: { name: 'test.policy', version: 1 }");
  });
});
