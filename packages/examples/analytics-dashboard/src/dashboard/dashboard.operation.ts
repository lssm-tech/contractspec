import { defineCommand, defineQuery } from '@lssm/lib.contracts/operations';
import {
  DashboardModel,
  WidgetModel,
  CreateDashboardInputModel,
  AddWidgetInputModel,
  ListDashboardsInputModel,
  ListDashboardsOutputModel,
  GetDashboardInputModel,
} from './dashboard.schema';

const OWNERS = ['@example.analytics-dashboard'] as const;

/**
 * Create a new analytics dashboard.
 */
export const CreateDashboardContract = defineCommand({
  meta: {
    key: 'analytics.dashboard.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['analytics', 'dashboard', 'create'],
    description: 'Create a new analytics dashboard.',
    goal: 'Allow users to create custom dashboards.',
    context: 'Dashboard management.',
  },
  io: { input: CreateDashboardInputModel, output: DashboardModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'analytics.dashboard.created',
        version: 1,
        stability: 'stable',
        owners: [...OWNERS],
        tags: ['analytics', 'dashboard', 'created'],
        when: 'Dashboard created',
        payload: DashboardModel,
      },
    ],
    audit: ['analytics.dashboard.created'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'create-dashboard-happy-path',
        given: ['User is authenticated'],
        when: ['User submits valid dashboard configuration'],
        then: ['Dashboard is created', 'DashboardCreated event is emitted'],
      },
    ],
    examples: [
      {
        key: 'create-basic',
        input: {
          name: 'Revenue Dashboard',
          description: 'Monthly revenue metrics',
        },
        output: { id: 'dash-123', name: 'Revenue Dashboard', widgets: [] },
      },
    ],
  },
});

/**
 * Add a widget to a dashboard.
 */
export const AddWidgetContract = defineCommand({
  meta: {
    key: 'analytics.widget.add',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['analytics', 'widget', 'add'],
    description: 'Add a widget to a dashboard.',
    goal: 'Allow users to add visualizations.',
    context: 'Dashboard editor.',
  },
  io: { input: AddWidgetInputModel, output: WidgetModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'analytics.widget.added',
        version: 1,
        stability: 'stable',
        owners: [...OWNERS],
        tags: ['analytics', 'widget', 'added'],
        when: 'Widget added',
        payload: WidgetModel,
      },
    ],
  },
  acceptance: {
    scenarios: [
      {
        key: 'add-widget-happy-path',
        given: ['Dashboard exists'],
        when: ['User adds widget to dashboard'],
        then: ['Widget is created', 'WidgetAdded event is emitted'],
      },
    ],
    examples: [
      {
        key: 'add-chart-widget',
        input: {
          dashboardId: 'dash-123',
          type: 'chart',
          queryId: 'query-456',
          config: { chartType: 'bar' },
        },
        output: { id: 'widget-789', type: 'chart', dashboardId: 'dash-123' },
      },
    ],
  },
});

/**
 * List dashboards.
 */
export const ListDashboardsContract = defineQuery({
  meta: {
    key: 'analytics.dashboard.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['analytics', 'dashboard', 'list'],
    description: 'List dashboards.',
    goal: 'Browse available dashboards.',
    context: 'Dashboard listing.',
  },
  io: { input: ListDashboardsInputModel, output: ListDashboardsOutputModel },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'list-dashboards-happy-path',
        given: ['User has dashboards'],
        when: ['User lists dashboards'],
        then: ['Paginated list of dashboards is returned'],
      },
    ],
    examples: [
      {
        key: 'list-basic',
        input: { limit: 10, offset: 0 },
        output: { items: [], total: 0, hasMore: false },
      },
    ],
  },
});

/**
 * Get a dashboard with widgets.
 */
export const GetDashboardContract = defineQuery({
  meta: {
    key: 'analytics.dashboard.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['analytics', 'dashboard', 'get'],
    description: 'Get a dashboard with widgets.',
    goal: 'Load dashboard for viewing.',
    context: 'Dashboard view.',
  },
  io: { input: GetDashboardInputModel, output: DashboardModel },
  policy: { auth: 'anonymous' },
  acceptance: {
    scenarios: [
      {
        key: 'get-dashboard-happy-path',
        given: ['Dashboard exists'],
        when: ['User requests dashboard by ID'],
        then: ['Dashboard with widgets is returned'],
      },
    ],
    examples: [
      {
        key: 'get-basic',
        input: { dashboardId: 'dash-123' },
        output: { id: 'dash-123', name: 'Revenue Dashboard', widgets: [] },
      },
    ],
  },
});
