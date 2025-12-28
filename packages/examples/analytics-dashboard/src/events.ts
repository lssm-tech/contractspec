import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { defineEvent } from '@contractspec/lib.contracts';

const DashboardEventPayload = defineSchemaModel({
  name: 'DashboardEventPayload',
  description: 'Payload for dashboard events',
  fields: {
    dashboardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const WidgetEventPayload = defineSchemaModel({
  name: 'WidgetEventPayload',
  description: 'Payload for widget events',
  fields: {
    widgetId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    dashboardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    widgetType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const QueryEventPayload = defineSchemaModel({
  name: 'QueryEventPayload',
  description: 'Payload for query events',
  fields: {
    queryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    queryType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const DashboardCreatedEvent = defineEvent({
  meta: {
    key: 'analytics.dashboard.created',
    version: 1,
    description: 'A dashboard was created.',
    stability: 'stable',
    owners: ['@analytics-team'],
    tags: ['dashboard'],
  },
  payload: DashboardEventPayload,
});

export const WidgetAddedEvent = defineEvent({
  meta: {
    key: 'analytics.widget.added',
    version: 1,
    description: 'A widget was added to a dashboard.',
    stability: 'stable',
    owners: ['@analytics-team'],
    tags: ['dashboard'],
  },
  payload: WidgetEventPayload,
});

export const QueryCreatedEvent = defineEvent({
  meta: {
    key: 'analytics.query.created',
    version: 1,
    description: 'A query was created.',
    stability: 'stable',
    owners: ['@analytics-team'],
    tags: ['dashboard'],
  },
  payload: QueryEventPayload,
});

export const AnalyticsDashboardEvents = {
  DashboardCreatedEvent,
  WidgetAddedEvent,
  QueryCreatedEvent,
};
