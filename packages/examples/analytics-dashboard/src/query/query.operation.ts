import { defineCommand, defineQuery } from '@lssm/lib.contracts/operations';
import {
  QueryModel,
  QueryResultModel,
  CreateQueryInputModel,
  ExecuteQueryInputModel,
} from './query.schema';

const OWNERS = ['@example.analytics-dashboard'] as const;

/**
 * Create a data query.
 */
export const CreateQueryContract = defineCommand({
  meta: {
    key: 'analytics.query.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['analytics', 'query', 'create'],
    description: 'Create a data query.',
    goal: 'Define reusable data queries.',
    context: 'Query builder.',
  },
  io: { input: CreateQueryInputModel, output: QueryModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'analytics.query.created',
        version: 1,
        when: 'Query created',
        payload: QueryModel,
      },
    ],
    audit: ['analytics.query.created'],
  },
});

/**
 * Execute a data query.
 */
export const ExecuteQueryContract = defineQuery({
  meta: {
    key: 'analytics.query.execute',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['analytics', 'query', 'execute'],
    description: 'Execute a data query.',
    goal: 'Fetch data for visualizations.',
    context: 'Dashboard rendering.',
  },
  io: { input: ExecuteQueryInputModel, output: QueryResultModel },
  policy: { auth: 'user' },
});
