export { AppShell } from './AppShell';
export type { AppShellProps } from './AppShell.types';
export {
	PageOutline,
	type PageOutlineProps,
	usePageOutlineActiveItem,
} from './PageOutline';
export type {
	PolicyAwareShellCommandItem,
	PolicyAwareShellNavItem,
	ShellPolicyAnnotated,
	ShellPolicyBehavior,
	ShellPolicyDecisionProvider,
} from './policy';
export {
	annotateShellCommandsDecisions,
	annotateShellNavigationDecisions,
	filterShellNavigationForPolicy,
} from './policy';
export {
	ShellNotifications,
	type ShellNotificationsProps,
} from './ShellNotifications';
export { ShellSidebar, type ShellSidebarProps } from './ShellSidebar';
export type {
	AppShellConfig,
	PageOutlineItem,
	PageOutlineLevel,
	ShellBreadcrumbItem,
	ShellCommandGroup,
	ShellCommandItem,
	ShellNavItem,
	ShellNavMatch,
	ShellNavSection,
	ShellNotificationCenter,
	ShellNotificationItem,
	ShellNotificationRenderContext,
	ShellNotificationStatus,
	ShellUserMenu,
	ShellUserMenuItem,
} from './types';
