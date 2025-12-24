import { describe, expect, it } from 'bun:test';
import { DataViewRegistry, type DataViewSpec } from './data-views';
import { type Owner, StabilityEnum, type Tag } from '../ownership';

const baseMeta = {
  title: 'Residents List' as const,
  description: 'List residents for admins' as const,
  domain: 'residents' as const,
  owners: ['@team.people'] as Owner[],
  tags: ['residents', 'admin'] as Tag[],
  stability: StabilityEnum.Experimental,
} as const;

const spec: DataViewSpec = {
  meta: {
    ...baseMeta,
    name: 'residents.admin.list',
    version: 1,
    entity: 'resident',
  },
  source: {
    primary: { name: 'residents.list', version: 1 },
    refreshEvents: [{ name: 'resident.created', version: 1 }],
  },
  view: {
    kind: 'table',
    primaryField: 'fullName',
    fields: [
      {
        key: 'fullName',
        label: 'Name',
        dataPath: 'fullName',
        sortable: true,
      },
      {
        key: 'email',
        label: 'Email',
        dataPath: 'contact.email',
        format: 'text',
      },
    ],
    columns: [
      { field: 'fullName', width: 'md' },
      { field: 'email', width: 'lg' },
    ],
  },
};

describe('DataViewRegistry', () => {
  it('registers and retrieves data view specs', () => {
    const registry = new DataViewRegistry();
    registry.register(spec);
    const stored = registry.get(spec.meta.key, spec.meta.version);
    expect(stored?.meta.entity).toBe('resident');
    expect(stored?.view.kind).toBe('table');
  });

  it('returns highest version when version omitted', () => {
    const registry = new DataViewRegistry();
    registry.register(spec);
    registry.register({
      ...spec,
      meta: { ...spec.meta, version: 2 },
    });
    const latest = registry.get(spec.meta.key);
    expect(latest?.meta.version).toBe(2);
  });

  it('throws on duplicate key and version', () => {
    const registry = new DataViewRegistry();
    registry.register(spec);
    expect(() => registry.register(spec)).toThrowError(/Duplicate data view/);
  });
});
