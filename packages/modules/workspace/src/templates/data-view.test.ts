import { describe, expect, it } from 'bun:test';
import { generateDataViewSpec } from './data-view';
import type { DataViewSpecData } from '../types/spec-types';

describe('generateDataViewSpec', () => {
  const baseData: DataViewSpecData = {
    name: 'test.view',
    version: '1',
    description: 'Test view',
    owners: ['team-a'],
    tags: ['test'],
    stability: 'stable',
    title: 'Test View',
    domain: 'test-domain',
    entity: 'User',
    kind: 'list',
    primaryOperation: { name: 'op.list', version: '1' },
    fields: [],
  };

  it('generates a data view spec', () => {
    const code = generateDataViewSpec(baseData);
    expect(code).toContain(
      "import type { DataViewSpec } from '@contractspec/lib.contracts/data-views'"
    );
    expect(code).toContain('export const Test_viewDataView: DataViewSpec = {');
    expect(code).toContain("kind: 'list'");
    expect(code).toContain("entity: 'User'");
  });

  it('includes fields', () => {
    const data: DataViewSpecData = {
      ...baseData,
      fields: [
        { key: 'id', label: 'ID', dataPath: 'id', sortable: true },
        { key: 'name', label: 'Name', dataPath: 'name', filterable: true },
      ],
    };
    const code = generateDataViewSpec(data);
    expect(code).toContain("key: 'id'");
    expect(code).toContain("label: 'ID'");
    expect(code).toContain('sortable: true');
    expect(code).toContain('filterable: true');
  });

  it('includes secondary fields', () => {
    const data: DataViewSpecData = {
      ...baseData,
      secondaryFields: ['email', 'phone'],
    };
    const code = generateDataViewSpec(data);
    expect(code).toContain("secondaryFields: ['email', 'phone']");
  });

  it('includes item operation if present', () => {
    const data: DataViewSpecData = {
      ...baseData,
      itemOperation: { name: 'op.get', version: '1' },
    };
    const code = generateDataViewSpec(data);
    expect(code).toContain("item: { name: 'op.get', version: 1 }");
  });
});
