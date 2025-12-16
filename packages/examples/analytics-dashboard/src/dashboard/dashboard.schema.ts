import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import {
  DashboardStatusEnum,
  WidgetTypeEnum,
  RefreshIntervalEnum,
} from './dashboard.enum';

/**
 * A dashboard widget.
 */
export const WidgetModel = defineSchemaModel({
  name: 'WidgetModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    dashboardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: WidgetTypeEnum, isOptional: false },
    gridX: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    gridY: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    gridWidth: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    gridHeight: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    queryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    config: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

/**
 * An analytics dashboard.
 */
export const DashboardModel = defineSchemaModel({
  name: 'DashboardModel',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: DashboardStatusEnum, isOptional: false },
    refreshInterval: { type: RefreshIntervalEnum, isOptional: false },
    isPublic: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    widgets: { type: WidgetModel, isArray: true, isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Input for creating a dashboard.
 */
export const CreateDashboardInputModel = defineSchemaModel({
  name: 'CreateDashboardInput',
  fields: {
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    slug: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    refreshInterval: { type: RefreshIntervalEnum, isOptional: true },
    dateRange: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

/**
 * Input for adding a widget.
 */
export const AddWidgetInputModel = defineSchemaModel({
  name: 'AddWidgetInput',
  fields: {
    dashboardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    type: { type: WidgetTypeEnum, isOptional: false },
    gridX: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    gridY: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    gridWidth: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    gridHeight: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    queryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    config: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

/**
 * Input for listing dashboards.
 */
export const ListDashboardsInputModel = defineSchemaModel({
  name: 'ListDashboardsInput',
  fields: {
    status: { type: DashboardStatusEnum, isOptional: true },
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

/**
 * Output for listing dashboards.
 */
export const ListDashboardsOutputModel = defineSchemaModel({
  name: 'ListDashboardsOutput',
  fields: {
    dashboards: { type: DashboardModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

/**
 * Input for getting a dashboard.
 */
export const GetDashboardInputModel = defineSchemaModel({
  name: 'GetDashboardInput',
  fields: {
    dashboardId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    shareToken: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});
