import { describe, it, expect } from 'bun:test';
import { computeSemanticDiff } from './semantic';

describe('computeSemanticDiff', () => {
  it('should detect breaking changes when name changes', () => {
    const a = `
export const Spec = defineCommand({
  meta: { key: 'a.b', version: '1.0.0', kind: 'command', stability: 'stable' },
  io: {},
  policy: {},
});
`;
    const b = `
export const Spec = defineCommand({
  meta: { key: 'a.c', version: '1.0.0', kind: 'command', stability: 'stable' },
  io: {},
  policy: {},
});
`;

    const diffs = computeSemanticDiff(a, 'x.contracts.ts', b, 'x.contracts.ts');
    expect(diffs.some((d) => d.path === 'key' && d.type === 'breaking')).toBe(
      true
    );
  });

  it('should filter to breaking only when requested', () => {
    const a = `
export const Spec = defineCommand({
  meta: { key: 'a.b', version: '1.0.0', kind: 'command', stability: 'beta', owners: ['@a'] },
  io: {},
  policy: {},
});
`;
    const b = `
export const Spec = defineCommand({
  meta: { key: 'a.b', version: '1.0.0', kind: 'command', stability: 'beta', owners: ['@b'] },
  io: {},
  policy: {},
});
`;

    const diffs = computeSemanticDiff(
      a,
      'x.contracts.ts',
      b,
      'x.contracts.ts',
      {
        breakingOnly: true,
      }
    );
    // owners change is not breaking in our heuristic
    expect(diffs.length).toBe(0);
  });
});
