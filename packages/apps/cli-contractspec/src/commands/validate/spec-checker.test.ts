import { describe, it, expect } from 'bun:test';
import { validateSpecStructure } from './spec-checker';

describe('validateSpecStructure', () => {
  it('should validate valid operation spec', () => {
    const validOperationSpec = `
import { defineCommand } from '@lssm/lib.contracts';
import { SchemaModel } from '@lssm/lib.schema';

export const TestSpec = defineCommand({
  meta: {
    key: 'test.operation',
    version: 1,
    kind: 'command',
    stability: 'beta',
    owners: ['@team'],
    tags: ['test'],
    description: 'Test operation',
    goal: 'Test goal',
    context: 'Test context',
  },
  io: {
    input: null,
    output: null,
  },
  policy: {
    auth: 'user',
  },
});
    `;

    const result = validateSpecStructure(
      validOperationSpec,
      'test.contracts.ts'
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect missing sections in operation spec', () => {
    const invalidSpec = `
export const TestSpec = defineCommand({
  meta: {
    key: 'test.operation',
  },
});
    `;

    const result = validateSpecStructure(invalidSpec, 'test.contracts.ts');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((e) => e.includes('io'))).toBe(true);
    expect(result.errors.some((e) => e.includes('policy'))).toBe(true);
  });

  it('should validate event spec', () => {
    const validEventSpec = `
import { defineEvent } from '@lssm/lib.contracts';
import { SchemaModel } from '@lssm/lib.schema';

export const TestEvent = defineEvent({
  name: 'test.event_created',
  version: 1,
  description: 'Test event',
  payload: new SchemaModel({}),
});
    `;

    const result = validateSpecStructure(validEventSpec, 'test.event.ts');
    expect(result.valid).toBe(true);
  });

  it('should warn about event naming conventions', () => {
    const badEventName = `
import { defineEvent } from '@lssm/lib.contracts';

export const TestEvent = defineEvent({
  name: 'test.create_user',
  version: 1,
  description: 'Test',
  payload: {},
});
    `;

    const result = validateSpecStructure(badEventName, 'test.event.ts');
    expect(result.warnings.some((w) => w.includes('past tense'))).toBe(true);
  });

  it('should detect missing imports', () => {
    const noImports = `
export const TestSpec = defineCommand({
  meta: { name: 'test' },
});
    `;

    const result = validateSpecStructure(noImports, 'test.contracts.ts');
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('import'))).toBe(true);
  });
});
