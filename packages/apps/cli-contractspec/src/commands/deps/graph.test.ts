import { describe, it, expect } from 'bun:test';
import { detectCycles, toDot, type ContractGraph } from './graph';

describe('deps graph', () => {
  it('detectCycles finds simple cycle', () => {
    const graph: ContractGraph = new Map([
      ['a', { name: 'a', file: 'a.ts', dependencies: ['b'], dependents: [] }],
      ['b', { name: 'b', file: 'b.ts', dependencies: ['a'], dependents: [] }],
    ]);

    const cycles = detectCycles(graph);
    expect(cycles.length).toBeGreaterThan(0);
    expect(cycles[0]?.includes('a')).toBe(true);
    expect(cycles[0]?.includes('b')).toBe(true);
  });

  it('toDot emits edges', () => {
    const graph: ContractGraph = new Map([
      ['a', { name: 'a', file: 'a.ts', dependencies: ['b'], dependents: [] }],
      ['b', { name: 'b', file: 'b.ts', dependencies: [], dependents: [] }],
    ]);

    const dot = toDot(graph);
    expect(dot.includes('"a" -> "b"')).toBe(true);
  });
});
