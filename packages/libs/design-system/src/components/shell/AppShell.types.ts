import type * as React from 'react';
import type {
	PageOutlineItem,
	ShellBreadcrumbItem,
	ShellCommandGroup,
	ShellNavItem,
	ShellNavSection,
} from './types';

export interface AppShellProps {
	brand?: React.ReactNode;
	logo?: React.ReactNode;
	title?: React.ReactNode;
	homeHref?: string;
	navigation?: ShellNavSection[];
	commands?: ShellCommandGroup[];
	breadcrumbs?: ShellBreadcrumbItem[];
	pageOutline?: PageOutlineItem[];
	activeHref?: string;
	activeOutlineId?: string;
	userMenu?: React.ReactNode;
	topbarStart?: React.ReactNode;
	topbarEnd?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	contentClassName?: string;
	onNavigate?: (item: ShellNavItem) => void;
}
