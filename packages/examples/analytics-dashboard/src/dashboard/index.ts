/**
 * Dashboard domain - Dashboard and widget management.
 */

export {
	DashboardStatusEnum,
	RefreshIntervalEnum,
	WidgetTypeEnum,
} from './dashboard.enum';
export {
	AddWidgetContract,
	CreateDashboardContract,
	GetDashboardContract,
	ListDashboardsContract,
} from './dashboard.operation';
export {
	AddWidgetInputModel,
	CreateDashboardInputModel,
	DashboardModel,
	GetDashboardInputModel,
	ListDashboardsInputModel,
	ListDashboardsOutputModel,
	WidgetModel,
} from './dashboard.schema';
