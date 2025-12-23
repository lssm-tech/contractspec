import type { PresentationSpec } from '@lssm/lib.contracts';
import { QueryModel } from './query.schema';

export const QueriesListPresentation: PresentationSpec = {
  meta: {
    name: 'analytics.query.list',
    version: 1,
    description: 'List of saved queries',
    domain: 'analytics',
    owners: ['@analytics-dashboard'],
    tags: ['analytics', 'queries', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'QueriesList',
    props: QueryModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['analytics.queries.enabled'],
  },
};

export const QueryBuilderPresentation: PresentationSpec = {
  meta: {
    name: 'analytics.query.builder',
    version: 1,
    description: 'Visual query builder interface',
    domain: 'analytics',
    owners: ['@analytics-dashboard'],
    tags: ['analytics', 'query', 'builder'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'QueryBuilder',
    props: QueryModel,
  },
  targets: ['react'],
  policy: {
    flags: ['analytics.queries.enabled'],
  },
};
