import { defineTestSpec } from '@contractspec/lib.contracts-spec/tests';

export const CreateQueryTest = defineTestSpec({
  meta: {
    key: 'analytics.query.create.test',
    version: '1.0.0',
    title: 'Create Query Test',
    description: 'Verifies query creation flow',
    owners: ['@example.analytics-dashboard'],
    tags: ['analytics', 'query', 'test'],
    stability: 'stable',
  },
  target: {
    type: 'operation',
    operation: { key: 'analytics.query.create', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      description: 'Successfully create a query',
      when: {
        operation: { key: 'analytics.query.create', version: '1.0.0' },
        input: {
          name: 'Revenue Query',
          sql: 'SELECT * FROM revenue',
        },
      },
      then: [
        {
          type: 'expectOutput',
          match: {
            name: 'Revenue Query',
            type: 'sql',
          },
        },
      ],
    },
    {
      key: 'error-invalid-sql',
      description: 'Fail with invalid SQL',
      when: {
        operation: { key: 'analytics.query.create', version: '1.0.0' },
        input: {
          name: 'Bad Query',
          sql: '',
        },
      },
      then: [
        {
          type: 'expectError',
          messageIncludes: 'VALIDATION_ERROR',
        },
      ],
    },
  ],
});

export const ExecuteQueryTest = defineTestSpec({
  meta: {
    key: 'analytics.query.execute.test',
    version: '1.0.0',
    title: 'Execute Query Test',
    description: 'Verifies query execution',
    owners: ['@example.analytics-dashboard'],
    tags: ['analytics', 'query', 'test'],
    stability: 'stable',
  },
  target: {
    type: 'operation',
    operation: { key: 'analytics.query.execute', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      description: 'Successfully execute query',
      when: {
        operation: { key: 'analytics.query.execute', version: '1.0.0' },
        input: {
          queryId: 'q-123',
          params: { limit: 10 },
        },
      },
      then: [
        {
          type: 'expectOutput',
          match: {
            rowCount: 1,
          },
        },
      ],
    },
    {
      key: 'error-query-not-found',
      description: 'Fail when query not found',
      when: {
        operation: { key: 'analytics.query.execute', version: '1.0.0' },
        input: {
          queryId: 'q-999',
          params: {},
        },
      },
      then: [
        {
          type: 'expectError',
          messageIncludes: 'NOT_FOUND',
        },
      ],
    },
  ],
});
