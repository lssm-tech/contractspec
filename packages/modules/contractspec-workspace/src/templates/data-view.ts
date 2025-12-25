import type { DataViewSpecData } from '../types/spec-types';
import { toPascalCase, escapeString } from './utils';

export function generateDataViewSpec(data: DataViewSpecData): string {
  const viewVarName =
    toPascalCase(data.name.split('.').pop() ?? 'DataView') + 'DataView';

  const fields = data.fields
    .map(
      (field) => `      {
        key: '${escapeString(field.key)}',
        label: '${escape(field.label)}',
        dataPath: '${escapeString(field.dataPath)}',
        ${field.format ? `format: '${escapeString(field.format)}',` : ''}
        ${field.sortable ? 'sortable: true,' : ''}
        ${field.filterable ? 'filterable: true,' : ''}
      }`
    )
    .join(',\n');

  const secondaryFields = data.secondaryFields?.length
    ? `secondaryFields: [${data.secondaryFields
        .map((key) => `'${escapeString(key)}'`)
        .join(', ')}],`
    : '';

  const itemOperation = data.itemOperation
    ? `item: { name: '${escapeString(data.itemOperation.name)}', version: ${data.itemOperation.version} },`
    : '';

  return `import type { DataViewSpec } from '@lssm/lib.contracts/data-views';

export const ${viewVarName}: DataViewSpec = {
  meta: {
    key: '${escapeString(data.name)}',
    version: ${data.version},
    entity: '${escapeString(data.entity)}',
    title: '${escape(data.title)}',
    description: '${escape(
      data.description || 'Describe the purpose of this data view.'
    )}',
    domain: '${escape(data.domain || data.entity)}',
    owners: [${data.owners.map((owner) => `'${escapeString(owner)}'`).join(', ')}],
    tags: [${data.tags.map((tag) => `'${escapeString(tag)}'`).join(', ')}],
    stability: '${data.stability}',
  },
  source: {
    primary: {
      name: '${escapeString(data.primaryOperation.name)}',
      version: ${data.primaryOperation.version},
    },
    ${itemOperation}
    refreshEvents: [
      // { name: 'entity.updated', version: 1 },
    ],
  },
  view: {
    kind: '${data.kind}',
    fields: [
${fields}
    ],
    ${data.primaryField ? `primaryField: '${escapeString(data.primaryField)}',` : ''}
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
    // empty: { name: 'app.data.empty', version: 1 },
    // error: { name: 'app.data.error', version: 1 },
  },
};
`;
}

function escape(value: string): string {
  return value.replace(/'/g, "\\'");
}
