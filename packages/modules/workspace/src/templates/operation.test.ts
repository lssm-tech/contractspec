import { describe, expect, it } from 'bun:test';
import { generateOperationSpec } from './operation';
import type { OperationSpecData } from '../types/spec-types';

describe('generateOperationSpec', () => {
  const baseData: OperationSpecData = {
    name: 'test.op',
    version: '1',
    description: 'Test operation',
    owners: ['team-a'],
    tags: ['test'],
    stability: 'stable',
    kind: 'command',
    goal: 'Test goal',
    context: 'Test context',
    hasInput: true,
    hasOutput: true,
    auth: 'user',
    flags: [],
    emitsEvents: false,
  };

  it('generates a command spec', () => {
    const code = generateOperationSpec(baseData);
    expect(code).toContain(
      "import { defineCommand } from '@contractspec/lib.contracts'"
    );
    expect(code).toContain('export const OpSpec = defineCommand({');
    expect(code).toContain("key: 'test.op'");
    expect(code).toContain("goal: 'Test goal'");
    expect(code).toContain("method: 'POST'");
  });

  it('generates a query spec', () => {
    const data: OperationSpecData = { ...baseData, kind: 'query' };
    const code = generateOperationSpec(data);
    expect(code).toContain(
      "import { defineQuery } from '@contractspec/lib.contracts'"
    );
    expect(code).toContain('export const OpSpec = defineQuery({');
    expect(code).toContain("method: 'GET'");
  });

  it('includes flags if present', () => {
    const data: OperationSpecData = { ...baseData, flags: ['flag-a'] };
    const code = generateOperationSpec(data);
    expect(code).toContain("flags: ['flag-a']");
  });

  it('includes event emission section if enabled', () => {
    const data: OperationSpecData = { ...baseData, emitsEvents: true };
    const code = generateOperationSpec(data);
    expect(code).toContain('emits: [');
    expect(code).toContain('// Define events to emit');
  });
});
