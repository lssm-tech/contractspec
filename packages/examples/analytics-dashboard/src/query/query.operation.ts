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
        stability: 'stable',
        owners: [...OWNERS],
        tags: ['analytics', 'query', 'created'],
        when: 'Query created',
        payload: QueryModel,
      },
    ],
    audit: ['analytics.query.created'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'create-query-happy-path',
        given: ['User is authenticated'],
        when: ['User submits valid query definition'],
        then: ['Query is created', 'QueryCreated event is emitted'],
      },
    ],
    examples: [
      {
        key: 'create-sql-query',
        input: {
          name: 'Monthly Revenue',
          sql: 'SELECT SUM(amount) FROM orders WHERE date >= :startDate',
        },
        output: { id: 'query-123', name: 'Monthly Revenue', type: 'sql' },
      },
    ],
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
  acceptance: {
    scenarios: [
      {
        key: 'execute-query-happy-path',
        given: ['Query exists'],
        when: ['User executes query with parameters'],
        then: ['Query results are returned'],
      },
    ],
    examples: [
      {
        key: 'execute-with-params',
        input: { queryId: 'query-123', params: { startDate: '2025-01-01' } },
        output: { columns: ['total'], rows: [{ total: 50000 }], rowCount: 1 },
      },
    ],
  },
});
