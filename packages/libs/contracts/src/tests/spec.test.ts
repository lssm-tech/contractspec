import { describe, expect, it } from 'bun:test';
import { makeTestKey, TestRegistry, type TestSpec } from './spec';
import { StabilityEnum } from '../ownership';

const sampleSpec = (version: number): TestSpec => ({
  meta: {
    key: 'sigil.operation.add_user.tests',
    version,
    title: 'Add user scenarios',
    description: 'End-to-end scenarios for add user operation',
    owners: ['@team.qa'],
    tags: ['contracts', 'qa'],
    stability: StabilityEnum.Experimental,
  },
  target: { type: 'operation', operation: { key: 'sigil.addUser' } },
  scenarios: [
    {
      key: 'creates a new user',
      when: {
        operation: { key: 'sigil.addUser' },
        input: { email: 'a@b.com' },
      },
      then: [{ type: 'expectOutput', match: { success: true } }],
    },
  ],
});

describe('TestRegistry', () => {
  it('registers and retrieves test specs', () => {
    const registry = new TestRegistry();
    const spec = sampleSpec(1);
    registry.register(spec);
    expect(registry.get('sigil.operation.add_user.tests', 1)).toEqual(spec);
    expect(registry.list()).toEqual([spec]);
  });

  it('returns latest version when version omitted', () => {
    const registry = new TestRegistry();
    registry.register(sampleSpec(1));
    const latest = sampleSpec(2);
    registry.register(latest);
    expect(registry.get('sigil.operation.add_user.tests')).toEqual(latest);
  });

  it('throws on duplicate registration', () => {
    const registry = new TestRegistry();
    const spec = sampleSpec(1);
    registry.register(spec);
    expect(() => registry.register(spec)).toThrowError(/Duplicate TestSpec/);
  });

  it('creates stable keys', () => {
    const spec = sampleSpec(1);
    expect(makeTestKey(spec.meta)).toBe('sigil.operation.add_user.tests.v1');
  });
});
