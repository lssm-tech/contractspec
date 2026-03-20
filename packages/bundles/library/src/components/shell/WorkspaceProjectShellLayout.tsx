import {
	SidebarInset,
	SidebarProvider,
} from '@contractspec/lib.ui-kit-web/ui/sidebar';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import * as React from 'react';
import {
	type ShellSelect,
	type ShellSelectOption,
	WorkspaceHeader,
	type WorkspaceHeaderProps,
} from './WorkspaceHeader';
import {
	type ShellModuleItem,
	WorkspaceSidebar,
	type WorkspaceSidebarProps,
} from './WorkspaceSidebar';

export type { ShellModuleItem, ShellSelect, ShellSelectOption };

export interface WorkspaceProjectShellLayoutProps
	extends WorkspaceSidebarProps,
		WorkspaceHeaderProps {
	assistant?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}

export function WorkspaceProjectShellLayout({
	// Header props
	title,
	subtitle,
	workspaceSelect,
	projectSelect,
	environmentSelect,
	stickyHeaderOffsetPx,
	headerRight,
	// Sidebar props
	modules,
	activeModuleId,
	onModuleChange,
	sidebarFooter,
	// Layout props
	assistant,
	children,
	className,
}: WorkspaceProjectShellLayoutProps) {
	return (
		<SidebarProvider>
			<WorkspaceSidebar
				modules={modules}
				activeModuleId={activeModuleId}
				onModuleChange={onModuleChange}
				sidebarFooter={sidebarFooter}
			/>
			<SidebarInset>
				<div className={cn('min-h-svh bg-background', className)}>
					<WorkspaceHeader
						title={title}
						subtitle={subtitle}
						workspaceSelect={workspaceSelect}
						projectSelect={projectSelect}
						environmentSelect={environmentSelect}
						stickyHeaderOffsetPx={stickyHeaderOffsetPx}
						headerRight={headerRight}
					/>
					<main className="m-4">{children}</main>
				</div>
			</SidebarInset>
			{assistant}
		</SidebarProvider>
	);
}
