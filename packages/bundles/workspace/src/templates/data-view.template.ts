import type { DataViewSpecData } from '../types';

export function generateDataViewSpec(data: DataViewSpecData): string {
  const viewVarName =
    toPascalCase(data.name.split('.').pop() ?? 'DataView') + 'DataView';

  const fields = data.fields
    .map(
      (field) => `      {
        key: '${field.key}',
        label: '${escape(field.label)}',
        dataPath: '${field.dataPath}',
        ${field.format ? `format: '${field.format}',` : ''}
        ${field.sortable ? 'sortable: true,' : ''}
        ${field.filterable ? 'filterable: true,' : ''}
      }`
    )
    .join(',\n');

  const secondaryFields = data.secondaryFields?.length
    ? `secondaryFields: [${data.secondaryFields
        .map((key) => `'${key}'`)
        .join(', ')}],`
    : '';

  const itemOperation = data.itemOperation
    ? `item: { name: '${data.itemOperation.name}', version: ${data.itemOperation.version} },`
    : '';

  return `import type { DataViewSpec } from '@contractspec/lib.contracts/data-views';

export const ${viewVarName}: DataViewSpec = {
  meta: {
    key: '${data.name}',
    version: ${data.version},
    entity: '${data.entity}',
    title: '${escape(data.title)}',
    description: '${escape(
      data.description || 'Describe the purpose of this data view.'
    )}',
    domain: '${escape(data.domain || data.entity)}',
    owners: [${data.owners.map((owner) => `'${owner}'`).join(', ')}],
    tags: [${data.tags.map((tag) => `'${tag}'`).join(', ')}],
    stability: '${data.stability}',
  },
  source: {
    primary: {
      name: '${data.primaryOperation.name}',
      version: ${data.primaryOperation.version},
    },
    ${itemOperation}
    refreshEvents: [
      // { name: 'entity.updated', version: '1.0.0' },
    ],
  },
  view: {
    kind: '${data.kind}',
    fields: [
${fields}
    ],
    ${data.primaryField ? `primaryField: '${data.primaryField}',` : ''}
    ${secondaryFields}
    filters: [
      // Example filter:
      // { key: 'search', label: 'Search', field: 'fullName', type: 'search' },
    ],
    actions: [
      // Example action:
      // { key: 'open', label: 'Open', kind: 'navigation' },
    ],
  },
  states: {
    // empty: { name: 'app.data.empty', version: '1.0.0' },
    // error: { name: 'app.data.error', version: '1.0.0' },
  },
};
`;
}

function toPascalCase(value: string): string {
  return value
    .split(/[-_.]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function escape(value: string): string {
  return value.replace(/'/g, "\\'");
}
