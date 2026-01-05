import { describe, expect, it } from 'bun:test';
import { generateEventSpec } from './event';
import type { EventSpecData } from '../types/spec-types';

describe('generateEventSpec', () => {
  const baseData: EventSpecData = {
    name: 'test.event',
    version: '1',
    description: 'Test event',
    owners: ['team-a'],
    tags: ['test'],
    stability: 'stable',
    piiFields: [],
  };

  it('generates an event spec', () => {
    const code = generateEventSpec(baseData);
    expect(code).toContain(
      "import { defineEvent } from '@contractspec/lib.contracts'"
    );
    expect(code).toContain('export const TestEventV1 = defineEvent({');
    expect(code).toContain("name: 'test.event'");
    expect(code).toContain('version: 1');
  });

  it('includes pii fields if present', () => {
    const data: EventSpecData = {
      ...baseData,
      piiFields: ['email', 'userId'],
    };
    const code = generateEventSpec(data);
    expect(code).toContain("pii: ['email', 'userId']");
  });

  it('comments out empty pii fields', () => {
    const code = generateEventSpec(baseData);
    expect(code).toContain('// pii: [],');
  });
});
