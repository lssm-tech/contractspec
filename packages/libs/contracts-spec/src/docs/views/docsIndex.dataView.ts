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

export const DocsIndexDataView = defineDataView({
  meta: {
    key: 'docs.index.view',
    title: 'Docs Index',
    version: '1.0.0',
    description: 'List and filter documentation entries.',
    domain: DOCS_DOMAIN,
    owners: DOCS_OWNERS,
    tags: [...DOCS_TAGS, 'index'],
    stability: DOCS_STABILITY,
    entity: 'docs',
    docId: [docId('docs.tech.docs-search')],
  },
  source: {
    primary: {
      key: DocsIndexQuery.meta.key,
      version: DocsIndexQuery.meta.version,
    },
  },
  view: {
    kind: 'list',
    fields: [
      { key: 'id', label: 'ID', dataPath: 'id' },
      { key: 'title', label: 'Title', dataPath: 'title' },
      { key: 'summary', label: 'Summary', dataPath: 'summary' },
      { key: 'route', label: 'Route', dataPath: 'route' },
      { key: 'tags', label: 'Tags', dataPath: 'tags', format: 'badge' },
      { key: 'kind', label: 'Kind', dataPath: 'kind' },
      { key: 'visibility', label: 'Visibility', dataPath: 'visibility' },
    ],
    primaryField: 'title',
    secondaryFields: ['summary', 'route'],
    filters: [
      { key: 'query', label: 'Search', field: 'query', type: 'search' },
      {
        key: 'visibility',
        label: 'Visibility',
        field: 'visibility',
        type: 'enum',
        options: [
          { value: 'public', label: 'Public' },
          { value: 'internal', label: 'Internal' },
          { value: 'mixed', label: 'Mixed' },
        ],
      },
      {
        key: 'kind',
        label: 'Kind',
        field: 'kind',
        type: 'enum',
        options: [
          { value: 'goal', label: 'Goal' },
          { value: 'how', label: 'How' },
          { value: 'usage', label: 'Usage' },
          { value: 'reference', label: 'Reference' },
          { value: 'faq', label: 'FAQ' },
          { value: 'changelog', label: 'Changelog' },
        ],
      },
    ],
  },
  policy: {
    flags: [],
    pii: [],
  },
});
