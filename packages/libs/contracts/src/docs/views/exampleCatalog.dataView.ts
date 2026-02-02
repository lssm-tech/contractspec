import { defineDataView } from '../../data-views';
import '../ensure-docblocks';
import { docId } from '../registry';
import {
  DOCS_DOMAIN,
  DOCS_OWNERS,
  DOCS_STABILITY,
  DOCS_TAGS,
} from '../constants';
import { DocsIndexQuery } from '../queries/docsIndex.query';

export const ExampleCatalogDataView = defineDataView({
  meta: {
    key: 'docs.examples.catalog.view',
    title: 'Examples Catalog',
    version: '1.0.0',
    description: 'Catalog view of ContractSpec examples and demos.',
    domain: DOCS_DOMAIN,
    owners: DOCS_OWNERS,
    tags: [...DOCS_TAGS, 'examples'],
    stability: DOCS_STABILITY,
    entity: 'docs-examples',
    docId: [docId('docs.tech.docs-examples')],
  },
  source: {
    primary: {
      key: DocsIndexQuery.meta.key,
      version: DocsIndexQuery.meta.version,
    },
  },
  view: {
    kind: 'grid',
    fields: [
      { key: 'id', label: 'ID', dataPath: 'id' },
      { key: 'title', label: 'Title', dataPath: 'title' },
      { key: 'summary', label: 'Summary', dataPath: 'summary' },
      { key: 'route', label: 'Route', dataPath: 'route' },
      { key: 'tags', label: 'Tags', dataPath: 'tags', format: 'badge' },
    ],
    primaryField: 'title',
    secondaryFields: ['summary'],
    filters: [
      { key: 'query', label: 'Search', field: 'query', type: 'search' },
      {
        key: 'tags',
        label: 'Tags',
        field: 'tag',
        type: 'enum',
        options: [
          { value: 'examples', label: 'Examples' },
          { value: 'templates', label: 'Templates' },
          { value: 'sandbox', label: 'Sandbox' },
        ],
      },
    ],
  },
  policy: {
    flags: [],
    pii: [],
  },
});
