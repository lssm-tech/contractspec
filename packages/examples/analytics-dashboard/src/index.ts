/**
 * @lssm/example.analytics-dashboard
 *
 * Analytics Dashboard Example
 *
 * A comprehensive analytics and dashboarding solution demonstrating:
 * - Customizable dashboards with drag-and-drop widgets
 * - Visual query builder with multiple query types
 * - Real-time data visualization
 * - Scheduled report generation
 * - Public dashboard sharing
 *
 * This example showcases integration with:
 * - @lssm/lib.metering for usage data
 * - @lssm/lib.identity-rbac for access control
 * - @lssm/modules.audit-trail for change tracking
 * - @lssm/modules.notifications for report delivery
 */

// ============ Entities ============
export {
  DashboardEntity,
  DashboardStatusEnum,
  WidgetEntity,
  WidgetTypeEnum,
  ChartTypeEnum,
  QueryEntity,
  QueryTypeEnum,
  SavedFilterEntity,
  ReportEntity,
  ReportRunEntity,
  TimeRangeEnum,
  ReportFormatEnum,
  analyticsDashboardSchemaContribution,
} from './entities';

// ============ Contracts ============
export {
  CreateDashboardContract,
  AddWidgetContract,
  CreateQueryContract,
  ExecuteQueryContract,
  ListDashboardsContract,
  GetDashboardContract,
} from './contracts';

// ============ Events ============
export {
  DashboardCreatedEvent,
  DashboardPublishedEvent,
  WidgetAddedEvent,
  QueryCreatedEvent,
  QueryExecutedEvent,
  DashboardViewedEvent,
  ReportGeneratedEvent,
  AnalyticsDashboardEvents,
} from './events';

// ============ Query Engine ============
export {
  createQueryEngine,
  BasicQueryEngine,
  InMemoryQueryCache,
  type IQueryEngine,
  type IQueryCache,
  type QueryDefinition,
  type QueryResult,
  type QueryParameters,
} from './query-engine';

// ============ Handlers ============
export {
  handleCreateDashboard,
  handleAddWidget,
  handleCreateQuery,
  handleListDashboards,
  handleGetDashboard,
} from './handlers';

// ============ Presentations ============
export { AnalyticsDashboardPresentations } from './presentations';

// ============ Feature ============
export { AnalyticsDashboardFeature } from './feature';


