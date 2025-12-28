/**
 * Deep diff tests.
 */

import { describe, it, expect } from 'bun:test';
import {
  computeIoDiff,
  computeFieldsDiff,
  computeFieldDiff,
} from './deep-diff';
import type { FieldSnapshot, IoSnapshot } from '../snapshot/types';

describe('computeIoDiff', () => {
  it('should detect removed input field as breaking', () => {
    const base: IoSnapshot = {
      input: {
        name: { name: 'name', type: 'string', required: true, nullable: false },
        email: {
          name: 'email',
          type: 'string',
          required: true,
          nullable: false,
        },
      },
      output: {},
    };
    const head: IoSnapshot = {
      input: {
        name: { name: 'name', type: 'string', required: true, nullable: false },
      },
      output: {},
    };

    const diffs = computeIoDiff(base, head);

    expect(
      diffs.some((d) => d.path === 'io.input.email' && d.type === 'breaking')
    ).toBe(true);
  });

  it('should detect added required input field as breaking', () => {
    const base: IoSnapshot = {
      input: {
        name: { name: 'name', type: 'string', required: true, nullable: false },
      },
      output: {},
    };
    const head: IoSnapshot = {
      input: {
        name: { name: 'name', type: 'string', required: true, nullable: false },
        email: {
          name: 'email',
          type: 'string',
          required: true,
          nullable: false,
        },
      },
      output: {},
    };

    const diffs = computeIoDiff(base, head);

    expect(
      diffs.some((d) => d.path === 'io.input.email' && d.type === 'breaking')
    ).toBe(true);
  });

  it('should detect added optional input field as non-breaking', () => {
    const base: IoSnapshot = {
      input: {
        name: { name: 'name', type: 'string', required: true, nullable: false },
      },
      output: {},
    };
    const head: IoSnapshot = {
      input: {
        name: { name: 'name', type: 'string', required: true, nullable: false },
        email: {
          name: 'email',
          type: 'string',
          required: false,
          nullable: false,
        },
      },
      output: {},
    };

    const diffs = computeIoDiff(base, head);

    expect(
      diffs.some((d) => d.path === 'io.input.email' && d.type === 'added')
    ).toBe(true);
  });

  it('should detect removed output field as breaking', () => {
    const base: IoSnapshot = {
      input: {},
      output: {
        id: { name: 'id', type: 'string', required: true, nullable: false },
        name: { name: 'name', type: 'string', required: true, nullable: false },
      },
    };
    const head: IoSnapshot = {
      input: {},
      output: {
        id: { name: 'id', type: 'string', required: true, nullable: false },
      },
    };

    const diffs = computeIoDiff(base, head);

    expect(
      diffs.some((d) => d.path === 'io.output.name' && d.type === 'breaking')
    ).toBe(true);
  });

  it('should detect type change as breaking', () => {
    const base: IoSnapshot = {
      input: {
        count: {
          name: 'count',
          type: 'number',
          required: true,
          nullable: false,
        },
      },
      output: {},
    };
    const head: IoSnapshot = {
      input: {
        count: {
          name: 'count',
          type: 'string',
          required: true,
          nullable: false,
        },
      },
      output: {},
    };

    const diffs = computeIoDiff(base, head);

    expect(
      diffs.some(
        (d) => d.path === 'io.input.count.type' && d.type === 'breaking'
      )
    ).toBe(true);
  });
});

describe('computeFieldsDiff', () => {
  it('should detect removed field as breaking', () => {
    const base: Record<string, FieldSnapshot> = {
      name: { name: 'name', type: 'string', required: true, nullable: false },
      email: { name: 'email', type: 'string', required: true, nullable: false },
    };
    const head: Record<string, FieldSnapshot> = {
      name: { name: 'name', type: 'string', required: true, nullable: false },
    };

    const diffs = computeFieldsDiff(base, head, 'fields');

    expect(
      diffs.some((d) => d.path === 'fields.email' && d.type === 'breaking')
    ).toBe(true);
    expect(diffs.some((d) => d.description?.includes('email'))).toBe(true);
  });

  it('should detect added required field as breaking', () => {
    const base: Record<string, FieldSnapshot> = {
      name: { name: 'name', type: 'string', required: true, nullable: false },
    };
    const head: Record<string, FieldSnapshot> = {
      name: { name: 'name', type: 'string', required: true, nullable: false },
      age: { name: 'age', type: 'number', required: true, nullable: false },
    };

    const diffs = computeFieldsDiff(base, head, 'fields');

    expect(
      diffs.some((d) => d.path === 'fields.age' && d.type === 'breaking')
    ).toBe(true);
  });

  it('should detect added optional field as non-breaking', () => {
    const base: Record<string, FieldSnapshot> = {
      name: { name: 'name', type: 'string', required: true, nullable: false },
    };
    const head: Record<string, FieldSnapshot> = {
      name: { name: 'name', type: 'string', required: true, nullable: false },
      nickname: {
        name: 'nickname',
        type: 'string',
        required: false,
        nullable: false,
      },
    };

    const diffs = computeFieldsDiff(base, head, 'fields');

    expect(
      diffs.some((d) => d.path === 'fields.nickname' && d.type === 'added')
    ).toBe(true);
  });

  it('should detect changed field properties', () => {
    const base: Record<string, FieldSnapshot> = {
      count: { name: 'count', type: 'number', required: true, nullable: false },
    };
    const head: Record<string, FieldSnapshot> = {
      count: { name: 'count', type: 'string', required: true, nullable: false },
    };

    const diffs = computeFieldsDiff(base, head, 'fields');

    expect(
      diffs.some((d) => d.path === 'fields.count.type' && d.type === 'breaking')
    ).toBe(true);
  });
});

describe('computeFieldDiff', () => {
  it('should detect required to optional as non-breaking', () => {
    const base: FieldSnapshot = {
      name: 'field',
      type: 'string',
      required: true,
      nullable: false,
    };
    const head: FieldSnapshot = {
      name: 'field',
      type: 'string',
      required: false,
      nullable: false,
    };

    const diffs = computeFieldDiff(base, head, 'field');

    expect(
      diffs.some((d) => d.path === 'field.required' && d.type === 'changed')
    ).toBe(true);
  });

  it('should detect optional to required as breaking', () => {
    const base: FieldSnapshot = {
      name: 'field',
      type: 'string',
      required: false,
      nullable: false,
    };
    const head: FieldSnapshot = {
      name: 'field',
      type: 'string',
      required: true,
      nullable: false,
    };

    const diffs = computeFieldDiff(base, head, 'field');

    expect(
      diffs.some((d) => d.path === 'field.required' && d.type === 'breaking')
    ).toBe(true);
  });

  it('should detect removed enum value as breaking', () => {
    const base: FieldSnapshot = {
      name: 'status',
      type: 'enum',
      required: true,
      nullable: false,
      enumValues: ['active', 'inactive', 'pending'],
    };
    const head: FieldSnapshot = {
      name: 'status',
      type: 'enum',
      required: true,
      nullable: false,
      enumValues: ['active', 'inactive'],
    };

    const diffs = computeFieldDiff(base, head, 'status');

    expect(
      diffs.some(
        (d) => d.type === 'breaking' && d.description?.includes('pending')
      )
    ).toBe(true);
  });

  it('should detect added enum value as non-breaking', () => {
    const base: FieldSnapshot = {
      name: 'status',
      type: 'enum',
      required: true,
      nullable: false,
      enumValues: ['active', 'inactive'],
    };
    const head: FieldSnapshot = {
      name: 'status',
      type: 'enum',
      required: true,
      nullable: false,
      enumValues: ['active', 'inactive', 'pending'],
    };

    const diffs = computeFieldDiff(base, head, 'status');

    expect(
      diffs.some(
        (d) => d.type === 'added' && d.description?.includes('pending')
      )
    ).toBe(true);
  });
});
