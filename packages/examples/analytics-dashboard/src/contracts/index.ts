import { defineCommand, defineQuery } from '@lssm/lib.contracts/spec';
import {
  defineSchemaModel,
  ScalarTypeEnum,
  defineEnum,
} from '@lssm/lib.schema';

const OWNERS = ['example.analytics-dashboard'] as const;

// ============ Enums ============

const DashboardStatusSchemaEnum = defineEnum('DashboardStatus', [
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED',
]);
const WidgetTypeSchemaEnum = defineEnum('WidgetType', [
  'LINE_CHART',
  'BAR_CHART',
  'PIE_CHART',
  'AREA_CHART',
  'SCATTER_PLOT',
  'METRIC',
  'TABLE',
  'HEATMAP',
  'FUNNEL',
  'MAP',
  'TEXT',
  'EMBED',
]);
const QueryTypeSchemaEnum = defineEnum('QueryType', [
  'SQL',
  'METRIC',
  'AGGREGATION',
  'CUSTOM',
]);
const RefreshIntervalSchemaEnum = defineEnum('RefreshInterval', [
  'NONE',
  'MINUTE',
  'FIVE_MINUTES',
  'FIFTEEN_MINUTES',
  'HOUR',
  'DAY',
]);

// ============ Schemas ============

export const WidgetModel = defineSchemaModel({
  name: 'WidgetModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    dashboardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: WidgetTypeSchemaEnum, isOptional: false },
    gridX: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    gridY: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    gridWidth: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    gridHeight: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    queryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    config: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

export const DashboardModel = defineSchemaModel({
  name: 'DashboardModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: DashboardStatusSchemaEnum, isOptional: false },
    refreshInterval: { type: RefreshIntervalSchemaEnum, isOptional: false },
    isPublic: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    widgets: { type: WidgetModel, isArray: true, isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const QueryModel = defineSchemaModel({
  name: 'QueryModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: QueryTypeSchemaEnum, isOptional: false },
    definition: { type: ScalarTypeEnum.JSON(), isOptional: false },
    sql: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    cacheTtlSeconds: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    isShared: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const QueryResultModel = defineSchemaModel({
  name: 'QueryResultModel',
  fields: {
    queryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    data: { type: ScalarTypeEnum.JSON(), isOptional: false },
    columns: { type: ScalarTypeEnum.JSON(), isOptional: false },
    rowCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    executionTimeMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    cachedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    error: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

// ============ Input Models ============

export const CreateDashboardInputModel = defineSchemaModel({
  name: 'CreateDashboardInput',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    refreshInterval: { type: RefreshIntervalSchemaEnum, isOptional: true },
    dateRange: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

export const AddWidgetInputModel = defineSchemaModel({
  name: 'AddWidgetInput',
  fields: {
    dashboardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    type: { type: WidgetTypeSchemaEnum, isOptional: false },
    gridX: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    gridY: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    gridWidth: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    gridHeight: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    queryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    config: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

export const CreateQueryInputModel = defineSchemaModel({
  name: 'CreateQueryInput',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: QueryTypeSchemaEnum, isOptional: false },
    definition: { type: ScalarTypeEnum.JSON(), isOptional: false },
    sql: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    metricIds: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
    cacheTtlSeconds: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    isShared: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

export const ExecuteQueryInputModel = defineSchemaModel({
  name: 'ExecuteQueryInput',
  fields: {
    queryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    parameters: { type: ScalarTypeEnum.JSON(), isOptional: true },
    dateRange: { type: ScalarTypeEnum.JSON(), isOptional: true },
    filters: { type: ScalarTypeEnum.JSON(), isOptional: true },
    forceRefresh: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

export const ListDashboardsInputModel = defineSchemaModel({
  name: 'ListDashboardsInput',
  fields: {
    status: { type: DashboardStatusSchemaEnum, isOptional: true },
    search: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    limit: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 20,
    },
    offset: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 0,
    },
  },
});

export const ListDashboardsOutputModel = defineSchemaModel({
  name: 'ListDashboardsOutput',
  fields: {
    dashboards: { type: DashboardModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

// ============ Contracts ============

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

export const CreateQueryContract = defineCommand({
  meta: {
    name: 'analytics.query.create',
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
        name: 'analytics.query.created',
        version: 1,
        when: 'Query created',
        payload: QueryModel,
      },
    ],
    audit: ['analytics.query.created'],
  },
});

export const ExecuteQueryContract = defineQuery({
  meta: {
    name: 'analytics.query.execute',
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

export const GetDashboardInputModel = defineSchemaModel({
  name: 'GetDashboardInput',
  fields: {
    dashboardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    shareToken: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

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
