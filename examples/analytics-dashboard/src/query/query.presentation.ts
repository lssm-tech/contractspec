import type { PresentationSpec } from '@contractspec/lib.contracts';
import { StabilityEnum } from '@contractspec/lib.contracts';
import { QueryModel } from './query.schema';

export const QueriesListPresentation: PresentationSpec = {
  meta: {
    key: 'analytics.query.list',
    version: '1.0.0',
    title: 'Queries List',
    description: 'List of saved queries',
    domain: 'analytics',
    owners: ['@analytics-dashboard'],
    tags: ['analytics', 'queries', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Browse and manage saved data queries.',
    context: 'The library of reusable data definitions.',
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
    version: '1.0.0',
    title: 'Query Builder',
    description: 'Visual query builder interface',
    domain: 'analytics',
    owners: ['@analytics-dashboard'],
    tags: ['analytics', 'query', 'builder'],
    stability: StabilityEnum.Experimental,
    goal: 'Visually construct data queries and transformations.',
    context: 'Developer tool for data analysis.',
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
