import { describe, expect, it } from 'bun:test';
import { defineDataView } from './spec';
import type { DataViewSpec, DataViewRef } from './spec';

describe('DataViewSpec', () => {
  const createDataViewSpec = (
    overrides?: Partial<DataViewSpec>
  ): DataViewSpec => ({
    meta: {
      key: 'residents.list',
      version: '1.0.0',
      title: 'Residents List',
      description: 'List all residents',
      stability: 'stable',
      owners: ['team.residents'],
      tags: ['residents'],
      entity: 'resident',
    },
    source: {
      primary: { key: 'residents.list.query', version: '1.0.0' },
    },
    view: {
      kind: 'table',
      fields: [
        { key: 'name', label: 'Name', dataPath: 'name' },
        { key: 'email', label: 'Email', dataPath: 'email' },
      ],
    },
    ...overrides,
  });

  it('should define a complete data view spec', () => {
    const spec = createDataViewSpec();

    expect(spec.meta.key).toBe('residents.list');
    expect(spec.meta.entity).toBe('resident');
    expect(spec.source.primary.key).toBe('residents.list.query');
    expect(spec.view.kind).toBe('table');
  });

  it('should support optional states', () => {
    const spec = createDataViewSpec({
      states: {
        empty: { key: 'empty.residents', version: '1.0.0' },
        error: { key: 'error.residents', version: '1.0.0' },
      },
    });

    expect(spec.states?.empty?.key).toBe('empty.residents');
    expect(spec.states?.error?.key).toBe('error.residents');
  });

  it('should support optional policy', () => {
    const spec = createDataViewSpec({
      policy: {
        flags: ['internal'],
        pii: ['email', 'phone'],
      },
    });

    expect(spec.policy?.flags).toContain('internal');
    expect(spec.policy?.pii).toContain('email');
  });

  it('should support optional experiments', () => {
    const spec = createDataViewSpec({
      experiments: [{ key: 'new-layout', version: '1.0.0' }],
    });

    expect(spec.experiments).toHaveLength(1);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(spec.experiments![0]!.key).toBe('new-layout');
  });
});

describe('DataViewRef', () => {
  it('should define a reference to a data view', () => {
    const ref: DataViewRef = {
      key: 'data_view.users',
      version: '1.0.0',
    };

    expect(ref.key).toBe('data_view.users');
    expect(ref.version).toBe('1.0.0');
  });
});

describe('defineDataView', () => {
  it('should return the spec unchanged', () => {
    const spec: DataViewSpec = {
      meta: {
        key: 'test.view',
        version: '1.0.0',
        title: 'Test',
        description: 'Test view',
        stability: 'stable',
        owners: [],
        tags: [],
        entity: 'test',
      },
      source: { primary: { key: 'test.query', version: '1.0.0' } },
      view: { kind: 'list', fields: [] },
    };

    const result = defineDataView(spec);

    expect(result).toBe(spec);
    expect(result.meta.key).toBe('test.view');
  });

  it('should provide type safety', () => {
    const spec = defineDataView({
      meta: {
        key: 'typed.view',
        version: '2.0.0',
        title: 'Typed View',
        description: 'A typed view',
        stability: 'beta',
        owners: ['platform.core'],
        tags: ['typed'],
        entity: 'entity',
      },
      source: {
        primary: { key: 'typed.query', version: '1.0.0' },
        mutations: {
          create: { key: 'typed.create', version: '1.0.0' },
        },
      },
      view: {
        kind: 'grid',
        fields: [{ key: 'id', label: 'ID', dataPath: 'id' }],
        columns: 3,
      },
    });

    expect(spec.meta.version).toBe('2.0.0');
    expect(spec.view.kind).toBe('grid');
    if (spec.view.kind === 'grid') {
      expect(spec.view.columns).toBe(3);
    }
  });
});
