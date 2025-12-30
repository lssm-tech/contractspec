/**
 * Impact classifier tests.
 */

import { describe, it, expect } from 'bun:test';
import { classifyImpact } from './classifier';
import type { OperationSnapshot } from '../snapshot/types';
import type { SemanticDiffItem } from '../../types/analysis-types';

describe('classifyImpact', () => {
  it('should detect removed operation as breaking', () => {
    const baseSpecs: OperationSnapshot[] = [
      {
        type: 'operation',
        key: 'user.create',
        version: '1.0.0',
        kind: 'command',
        stability: 'stable',
        io: { input: {}, output: {} },
      },
    ];
    const headSpecs: OperationSnapshot[] = [];
    const diffs: SemanticDiffItem[] = [];

    const result = classifyImpact(baseSpecs, headSpecs, diffs);

    expect(result.status).toBe('breaking');
    expect(result.hasBreaking).toBe(true);
    expect(result.removedSpecs).toHaveLength(1);
    expect(result.deltas.some((d) => d.rule === 'endpoint-removed')).toBe(true);
  });

  it('should detect added operation as non-breaking', () => {
    const baseSpecs: OperationSnapshot[] = [];
    const headSpecs: OperationSnapshot[] = [
      {
        type: 'operation',
        key: 'user.create',
        version: '1.0.0',
        kind: 'command',
        stability: 'stable',
        io: { input: {}, output: {} },
      },
    ];
    const diffs: SemanticDiffItem[] = [];

    const result = classifyImpact(baseSpecs, headSpecs, diffs);

    expect(result.status).toBe('non-breaking');
    expect(result.hasNonBreaking).toBe(true);
    expect(result.addedSpecs).toHaveLength(1);
    expect(result.deltas.some((d) => d.rule === 'endpoint-added')).toBe(true);
  });

  it('should report no-impact when specs are identical', () => {
    const baseSpecs: OperationSnapshot[] = [
      {
        type: 'operation',
        key: 'user.create',
        version: '1.0.0',
        kind: 'command',
        stability: 'stable',
        io: { input: {}, output: {} },
      },
    ];
    const headSpecs: OperationSnapshot[] = [
      {
        type: 'operation',
        key: 'user.create',
        version: '1.0.0',
        kind: 'command',
        stability: 'stable',
        io: { input: {}, output: {} },
      },
    ];
    const diffs: SemanticDiffItem[] = [];

    const result = classifyImpact(baseSpecs, headSpecs, diffs);

    expect(result.status).toBe('no-impact');
    expect(result.hasBreaking).toBe(false);
    expect(result.hasNonBreaking).toBe(false);
  });

  it('should classify field removal as breaking via diff', () => {
    const baseSpecs: OperationSnapshot[] = [
      {
        type: 'operation',
        key: 'user.get',
        version: '1.0.0',
        kind: 'query',
        stability: 'stable',
        io: { input: {}, output: {} },
      },
    ];
    const headSpecs: OperationSnapshot[] = [
      {
        type: 'operation',
        key: 'user.get',
        version: '1.0.0',
        kind: 'query',
        stability: 'stable',
        io: { input: {}, output: {} },
      },
    ];
    const diffs: SemanticDiffItem[] = [
      {
        type: 'breaking',
        path: 'io.output.email',
        oldValue: { key: 'email', type: 'string' },
        newValue: undefined,
        description: "Field 'email' was removed",
      },
    ];

    const result = classifyImpact(baseSpecs, headSpecs, diffs);

    expect(result.hasBreaking).toBe(true);
    expect(result.deltas.some((d) => d.severity === 'breaking')).toBe(true);
  });

  it('should classify type change as breaking', () => {
    const baseSpecs: OperationSnapshot[] = [
      {
        type: 'operation',
        key: 'user.update',
        version: '1.0.0',
        kind: 'command',
        stability: 'stable',
        io: { input: {}, output: {} },
      },
    ];
    const headSpecs = baseSpecs;
    const diffs: SemanticDiffItem[] = [
      {
        type: 'breaking',
        path: 'io.input.age.type',
        oldValue: 'number',
        newValue: 'string',
        description: "Field type changed from 'number' to 'string'",
      },
    ];

    const result = classifyImpact(baseSpecs, headSpecs, diffs);

    expect(result.deltas.some((d) => d.rule === 'field-type-changed')).toBe(
      true
    );
  });

  it('should include summary counts', () => {
    const baseSpecs: OperationSnapshot[] = [];
    const headSpecs: OperationSnapshot[] = [
      {
        type: 'operation',
        key: 'user.create',
        version: '1.0.0',
        kind: 'command',
        stability: 'stable',
        io: { input: {}, output: {} },
      },
      {
        type: 'operation',
        key: 'user.delete',
        version: '1.0.0',
        kind: 'command',
        stability: 'stable',
        io: { input: {}, output: {} },
      },
    ];
    const diffs: SemanticDiffItem[] = [];

    const result = classifyImpact(baseSpecs, headSpecs, diffs);

    expect(result.summary.added).toBe(2);
    expect(result.summary.nonBreaking).toBe(2);
  });
});
