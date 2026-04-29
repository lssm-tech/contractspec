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
	ShellUserMenu,
	ShellUserMenuItem,
} from './types';
