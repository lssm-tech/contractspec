/**
 * Dashboard domain - Dashboard and widget management.
 */

export {
  DashboardStatusEnum,
  WidgetTypeEnum,
  RefreshIntervalEnum,
} from './dashboard.enum';

export {
  WidgetModel,
  DashboardModel,
  CreateDashboardInputModel,
  AddWidgetInputModel,
  ListDashboardsInputModel,
  ListDashboardsOutputModel,
  GetDashboardInputModel,
} from './dashboard.schema';

export {
  CreateDashboardContract,
  AddWidgetContract,
  ListDashboardsContract,
  GetDashboardContract,
} from './dashboard.contracts';
