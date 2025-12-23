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
    name: 'analytics.dashboard.create',
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
        name: 'analytics.dashboard.created',
        version: 1,
        when: 'Dashboard created',
        payload: DashboardModel,
      },
    ],
    audit: ['analytics.dashboard.created'],
  },
});

/**
 * Add a widget to a dashboard.
 */
export const AddWidgetContract = defineCommand({
  meta: {
    name: 'analytics.widget.add',
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
        name: 'analytics.widget.added',
        version: 1,
        when: 'Widget added',
        payload: WidgetModel,
      },
    ],
  },
});

/**
 * List dashboards.
 */
export const ListDashboardsContract = defineQuery({
  meta: {
    name: 'analytics.dashboard.list',
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
});

/**
 * Get a dashboard with widgets.
 */
export const GetDashboardContract = defineQuery({
  meta: {
    name: 'analytics.dashboard.get',
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
});
