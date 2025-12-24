import type { PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';
import { QueryModel } from './query.schema';

export const QueriesListPresentation: PresentationSpec = {
  meta: {
    key: 'analytics.query.list',
    version: 1,
    title: 'Queries List',
    description: 'List of saved queries',
    domain: 'analytics',
    owners: ['@analytics-dashboard'],
    tags: ['analytics', 'queries', 'list'],
    stability: StabilityEnum.Experimental,
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
    key: 'analytics.query.builder',
    version: 1,
    title: 'Query Builder',
    description: 'Visual query builder interface',
    domain: 'analytics',
    owners: ['@analytics-dashboard'],
    tags: ['analytics', 'query', 'builder'],
    stability: StabilityEnum.Experimental,
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
