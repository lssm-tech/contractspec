import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import {
  SidebarProvider,
  SidebarInset,
} from '@contractspec/lib.ui-kit-web/ui/sidebar';
import {
  WorkspaceHeader,
  type WorkspaceHeaderProps,
  type ShellSelect,
  type ShellSelectOption,
} from './WorkspaceHeader';
import {
  WorkspaceSidebar,
  type WorkspaceSidebarProps,
  type ShellModuleItem,
} from './WorkspaceSidebar';

export type { ShellSelect, ShellSelectOption, ShellModuleItem };

export interface WorkspaceProjectShellLayoutProps
  extends WorkspaceSidebarProps, WorkspaceHeaderProps {
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
        <div className={cn('bg-background min-h-svh', className)}>
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
