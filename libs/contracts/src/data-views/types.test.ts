import { describe, expect, it } from 'bun:test';
import type {
  DataViewAction,
  DataViewConfig,
  DataViewDetailConfig,
  DataViewField,
  DataViewFieldFormat,
  DataViewFilter,
  DataViewGridConfig,
  DataViewKind,
  DataViewListConfig,
  DataViewMeta,
  DataViewSections,
  DataViewSource,
  DataViewStates,
  DataViewTableConfig,
} from './types';

describe('DataViewKind', () => {
  it('should support list, detail, table, grid kinds', () => {
    const kinds: DataViewKind[] = ['list', 'detail', 'table', 'grid'];
    expect(kinds).toHaveLength(4);
    expect(kinds).toContain('list');
    expect(kinds).toContain('detail');
    expect(kinds).toContain('table');
    expect(kinds).toContain('grid');
  });
});

describe('DataViewMeta', () => {
  it('should extend OwnerShipMeta with entity field', () => {
    const meta: DataViewMeta = {
      key: 'residents.list',
      version: '1.0.0',
      title: 'Residents List',
      description: 'List of residents',
      stability: 'stable',
      owners: ['team.residents'],
      tags: ['residents', 'list'],
      entity: 'resident',
    };

    expect(meta.entity).toBe('resident');
    expect(meta.key).toBe('residents.list');
    expect(meta.version).toBe('1.0.0');
  });
});

describe('DataViewSource', () => {
  it('should define primary query operation', () => {
    const source: DataViewSource = {
      primary: { key: 'residents.list', version: '1.0.0' },
    };

    expect(source.primary.key).toBe('residents.list');
  });

  it('should support item operation and mutations', () => {
    const source: DataViewSource = {
      primary: { key: 'residents.list', version: '1.0.0' },
      item: { key: 'residents.get', version: '1.0.0' },
      mutations: {
        create: { key: 'residents.create', version: '1.0.0' },
        update: { key: 'residents.update', version: '1.0.0' },
        delete: { key: 'residents.delete', version: '1.0.0' },
      },
      refreshEvents: [{ key: 'resident.created', version: '1.0.0' }],
    };

    expect(source.item?.key).toBe('residents.get');
    expect(source.mutations?.create?.key).toBe('residents.create');
    expect(source.refreshEvents).toHaveLength(1);
  });
});

describe('DataViewFieldFormat', () => {
  it('should support all format types', () => {
    const formats: DataViewFieldFormat[] = [
      'text',
      'number',
      'currency',
      'percentage',
      'date',
      'dateTime',
      'boolean',
      'badge',
    ];

    expect(formats).toHaveLength(8);
  });
});

describe('DataViewField', () => {
  it('should define field structure', () => {
    const field: DataViewField = {
      key: 'fullName',
      label: 'Full Name',
      dataPath: 'name.full',
      description: 'Resident full name',
      format: 'text',
      sortable: true,
      filterable: true,
      width: 'md',
    };

    expect(field.key).toBe('fullName');
    expect(field.dataPath).toBe('name.full');
    expect(field.sortable).toBe(true);
  });

  it('should support presentation override', () => {
    const field: DataViewField = {
      key: 'avatar',
      label: 'Avatar',
      dataPath: 'profile.avatar',
      presentation: { key: 'avatar.component', version: '1.0.0' },
    };

    expect(field.presentation?.key).toBe('avatar.component');
  });
});

describe('DataViewFilter', () => {
  it('should define filter structure', () => {
    const filter: DataViewFilter = {
      key: 'status',
      label: 'Status',
      field: 'status',
      type: 'enum',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    };

    expect(filter.type).toBe('enum');
    expect(filter.options).toHaveLength(2);
  });
});

describe('DataViewAction', () => {
  it('should support navigation and operation kinds', () => {
    const navAction: DataViewAction = {
      key: 'view',
      label: 'View',
      kind: 'navigation',
    };

    const opAction: DataViewAction = {
      key: 'delete',
      label: 'Delete',
      kind: 'operation',
      operation: { key: 'residents.delete', version: '1.0.0' },
      requiresFlag: 'delete-enabled',
    };

    expect(navAction.kind).toBe('navigation');
    expect(opAction.kind).toBe('operation');
    expect(opAction.operation?.key).toBe('residents.delete');
  });
});

describe('DataViewSections', () => {
  it('should define section structure', () => {
    const section: DataViewSections = {
      title: 'Personal Info',
      description: 'Basic personal information',
      fields: ['fullName', 'email', 'phone'],
    };

    expect(section.fields).toHaveLength(3);
  });
});

describe('DataViewConfig', () => {
  it('should support list config', () => {
    const config: DataViewListConfig = {
      kind: 'list',
      fields: [{ key: 'name', label: 'Name', dataPath: 'name' }],
      layout: 'card',
    };

    expect(config.kind).toBe('list');
    expect(config.layout).toBe('card');
  });

  it('should support detail config with sections', () => {
    const config: DataViewDetailConfig = {
      kind: 'detail',
      fields: [{ key: 'name', label: 'Name', dataPath: 'name' }],
      sections: [{ title: 'Info', fields: ['name'] }],
    };

    expect(config.kind).toBe('detail');
    expect(config.sections).toHaveLength(1);
  });

  it('should support table config with columns', () => {
    const config: DataViewTableConfig = {
      kind: 'table',
      fields: [{ key: 'name', label: 'Name', dataPath: 'name' }],
      columns: [{ field: 'name', width: 'lg', align: 'left' }],
      rowSelectable: true,
      density: 'compact',
    };

    expect(config.kind).toBe('table');
    expect(config.rowSelectable).toBe(true);
  });

  it('should support grid config', () => {
    const config: DataViewGridConfig = {
      kind: 'grid',
      fields: [{ key: 'name', label: 'Name', dataPath: 'name' }],
      columns: 4,
    };

    expect(config.kind).toBe('grid');
    expect(config.columns).toBe(4);
  });

  it('should be a union type for DataViewConfig', () => {
    const configs: DataViewConfig[] = [
      { kind: 'list', fields: [] },
      { kind: 'detail', fields: [] },
      { kind: 'table', fields: [] },
      { kind: 'grid', fields: [] },
    ];

    expect(configs).toHaveLength(4);
  });
});

describe('DataViewStates', () => {
  it('should define state presentations', () => {
    const states: DataViewStates = {
      empty: { key: 'empty.state', version: '1.0.0' },
      error: { key: 'error.state', version: '1.0.0' },
      loading: { key: 'loading.state', version: '1.0.0' },
    };

    expect(states.empty?.key).toBe('empty.state');
    expect(states.error?.key).toBe('error.state');
    expect(states.loading?.key).toBe('loading.state');
  });
});
