import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

// ============ Event Payloads ============

const DashboardCreatedPayload = defineSchemaModel({
  name: 'DashboardCreatedEventPayload',
  fields: {
    dashboardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const DashboardPublishedPayload = defineSchemaModel({
  name: 'DashboardPublishedEventPayload',
  fields: {
    dashboardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    publishedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const WidgetAddedPayload = defineSchemaModel({
  name: 'WidgetAddedEventPayload',
  fields: {
    widgetId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    dashboardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const QueryCreatedPayload = defineSchemaModel({
  name: 'QueryCreatedEventPayload',
  fields: {
    queryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    createdBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const QueryExecutedPayload = defineSchemaModel({
  name: 'QueryExecutedEventPayload',
  fields: {
    queryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    executionTimeMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    rowCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    cached: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    executedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const DashboardViewedPayload = defineSchemaModel({
  name: 'DashboardViewedEventPayload',
  fields: {
    dashboardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    viewedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    isPublicView: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ReportGeneratedPayload = defineSchemaModel({
  name: 'ReportGeneratedEventPayload',
  fields: {
    reportId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reportRunId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    format: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    recipientCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// ============ Events ============

export const DashboardCreatedEvent = defineEvent({
  name: 'analytics.dashboard.created',
  version: 1,
  description: 'A new dashboard has been created.',
  payload: DashboardCreatedPayload,
});

export const DashboardPublishedEvent = defineEvent({
  name: 'analytics.dashboard.published',
  version: 1,
  description: 'A dashboard has been published.',
  payload: DashboardPublishedPayload,
});

export const WidgetAddedEvent = defineEvent({
  name: 'analytics.widget.added',
  version: 1,
  description: 'A widget has been added to a dashboard.',
  payload: WidgetAddedPayload,
});

export const QueryCreatedEvent = defineEvent({
  name: 'analytics.query.created',
  version: 1,
  description: 'A query has been created.',
  payload: QueryCreatedPayload,
});

export const QueryExecutedEvent = defineEvent({
  name: 'analytics.query.executed',
  version: 1,
  description: 'A query has been executed.',
  payload: QueryExecutedPayload,
});

export const DashboardViewedEvent = defineEvent({
  name: 'analytics.dashboard.viewed',
  version: 1,
  description: 'A dashboard has been viewed.',
  payload: DashboardViewedPayload,
});

export const ReportGeneratedEvent = defineEvent({
  name: 'analytics.report.generated',
  version: 1,
  description: 'A report has been generated.',
  payload: ReportGeneratedPayload,
});

// ============ All Events ============

export const AnalyticsDashboardEvents = {
  DashboardCreatedEvent,
  DashboardPublishedEvent,
  WidgetAddedEvent,
  QueryCreatedEvent,
  QueryExecutedEvent,
  DashboardViewedEvent,
  ReportGeneratedEvent,
};
