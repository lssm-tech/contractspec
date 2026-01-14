import { defineTestSpec } from '@contractspec/lib.contracts';

export const CreateDashboardTest = defineTestSpec({
  meta: {
    key: 'analytics.dashboard.create.test',
    version: '1.0.0',
    title: 'Create Dashboard Test',
    description: 'Verifies dashboard creation flow',
    owners: ['@example.analytics-dashboard'],
    tags: ['analytics', 'dashboard', 'test'],
    stability: 'stable',
  },
  target: {
    type: 'operation',
    operation: { key: 'analytics.dashboard.create', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      description: 'Successfully create a dashboard',
      when: {
        operation: { key: 'analytics.dashboard.create', version: '1.0.0' },
        input: {
          name: 'Test Dashboard',
          description: 'Test Description',
        },
      },
      then: [
        {
          type: 'expectOutput',
          match: {
            name: 'Test Dashboard',
          },
        },
      ],
    },
    {
      key: 'error-invalid-input',
      description: 'Fail to create dashboard with invalid input',
      when: {
        operation: { key: 'analytics.dashboard.create', version: '1.0.0' },
        input: {
          name: '',
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

export const ListDashboardsTest = defineTestSpec({
  meta: {
    key: 'analytics.dashboard.list.test',
    version: '1.0.0',
    title: 'List Dashboards Test',
    description: 'Verifies dashboard listing',
    owners: ['@example.analytics-dashboard'],
    tags: ['analytics', 'dashboard', 'test'],
    stability: 'stable',
  },
  target: {
    type: 'operation',
    operation: { key: 'analytics.dashboard.list', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      description: 'Successfully list dashboards',
      when: {
        operation: { key: 'analytics.dashboard.list', version: '1.0.0' },
        input: { limit: 10, offset: 0 },
      },
      then: [
        {
          type: 'expectOutput',
          match: {
            items: [],
            total: 0,
          },
        },
      ],
    },
    {
      key: 'error-invalid-format',
      description: 'Fail with invalid pagination',
      when: {
        operation: { key: 'analytics.dashboard.list', version: '1.0.0' },
        input: { limit: -1 },
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

export const GetDashboardTest = defineTestSpec({
  meta: {
    key: 'analytics.dashboard.get.test',
    version: '1.0.0',
    title: 'Get Dashboard Test',
    description: 'Verifies dashboard retrieval',
    owners: ['@example.analytics-dashboard'],
    tags: ['analytics', 'dashboard', 'test'],
    stability: 'stable',
  },
  target: {
    type: 'operation',
    operation: { key: 'analytics.dashboard.get', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      description: 'Successfully get dashboard',
      when: {
        operation: { key: 'analytics.dashboard.get', version: '1.0.0' },
        input: { dashboardId: 'dash-123' },
      },
      then: [
        {
          type: 'expectOutput',
          match: {
            id: 'dash-123',
          },
        },
      ],
    },
    {
      key: 'error-not-found',
      description: 'Fail when dashboard not found',
      when: {
        operation: { key: 'analytics.dashboard.get', version: '1.0.0' },
        input: { dashboardId: 'dash-999' },
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

export const AddWidgetTest = defineTestSpec({
  meta: {
    key: 'analytics.widget.add.test',
    version: '1.0.0',
    title: 'Add Widget Test',
    description: 'Verifies adding widget to dashboard',
    owners: ['@example.analytics-dashboard'],
    tags: ['analytics', 'widget', 'test'],
    stability: 'stable',
  },
  target: {
    type: 'operation',
    operation: { key: 'analytics.widget.add', version: '1.0.0' },
  },
  scenarios: [
    {
      key: 'success',
      description: 'Successfully add widget',
      when: {
        operation: { key: 'analytics.widget.add', version: '1.0.0' },
        input: {
          dashboardId: 'dash-123',
          type: 'chart',
          queryId: 'q-1',
          config: {},
        },
      },
      then: [
        {
          type: 'expectOutput',
          match: {
            type: 'chart',
            dashboardId: 'dash-123',
          },
        },
      ],
    },
    {
      key: 'error-dashboard-not-found',
      description: 'Fail when dashboard does not exist',
      when: {
        operation: { key: 'analytics.widget.add', version: '1.0.0' },
        input: {
          dashboardId: 'dash-999',
          type: 'chart',
          queryId: 'q-1',
          config: {},
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
