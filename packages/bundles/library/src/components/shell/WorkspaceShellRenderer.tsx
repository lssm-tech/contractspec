'use client';

import {
	BundleProvider,
	BundleRenderer,
} from '@contractspec/lib.surface-runtime/react';
import type { ResolvedSurfacePlan } from '@contractspec/lib.surface-runtime/runtime/resolve-bundle';
import { SidebarProvider } from '@contractspec/lib.ui-kit-web/ui/sidebar';
import * as React from 'react';
import type {
	ShellSelect,
	ShellSelectOption,
	WorkspaceHeaderProps,
} from './WorkspaceHeader';
import { WorkspaceHeader } from './WorkspaceHeader';
import type {
	ShellModuleItem,
	WorkspaceSidebarProps,
} from './WorkspaceSidebar';
import { WorkspaceSidebar } from './WorkspaceSidebar';

export type { ShellModuleItem, ShellSelect, ShellSelectOption };

export interface WorkspaceShellRendererProps
	extends WorkspaceSidebarProps,
		WorkspaceHeaderProps {
	plan: ResolvedSurfacePlan;
	assistant?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}

/**
 * Renders the library workspace using surface-runtime BundleRenderer.
 * Uses the resolved plan for adaptive layout and preferences.
 * Replaces WorkspaceProjectShellLayout when surface-runtime is available.
 */
export function WorkspaceShellRenderer({
	plan,
	title,
	subtitle,
	workspaceSelect,
	projectSelect,
	environmentSelect,
	stickyHeaderOffsetPx,
	headerRight,
	modules,
	activeModuleId,
	onModuleChange,
	sidebarFooter,
	assistant,
	children,
	className,
}: WorkspaceShellRendererProps) {
	const slotContent: Partial<Record<string, React.ReactNode>> = {
		header: (
			<WorkspaceHeader
				title={title}
				subtitle={subtitle}
				workspaceSelect={workspaceSelect}
				projectSelect={projectSelect}
				environmentSelect={environmentSelect}
				stickyHeaderOffsetPx={stickyHeaderOffsetPx}
				headerRight={headerRight}
			/>
		),
		sidebar: (
			<WorkspaceSidebar
				modules={modules}
				activeModuleId={activeModuleId}
				onModuleChange={onModuleChange}
				sidebarFooter={sidebarFooter}
			/>
		),
		primary: (
			<main className={className ? `m-4 ${className}` : 'm-4'}>{children}</main>
		),
	};
	if (assistant != null) {
		slotContent.assistant = assistant;
	}

	return (
		<SidebarProvider>
			<BundleProvider plan={plan}>
				<div className="min-h-svh bg-background">
					<BundleRenderer slotContent={slotContent} />
				</div>
			</BundleProvider>
		</SidebarProvider>
	);
}
