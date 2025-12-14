import * as React from 'react';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lssm/lib.ui-kit-web/ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from '@lssm/lib.ui-kit-web/ui/sidebar';

export interface ShellSelectOption {
  value: string;
  label: string;
}

export interface ShellSelect {
  label: string;
  value: string;
  options: ShellSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface ShellModuleItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface WorkspaceProjectShellLayoutProps {
  title: string;
  subtitle?: string;
  workspaceSelect?: ShellSelect;
  projectSelect?: ShellSelect;
  environmentSelect?: ShellSelect;
  /**
   * Offset (in px) applied to the sticky header inside the shell.
   * Use this when the page is already wrapped by a global app header (e.g. Studio app shell)
   * to prevent sticky header overlap.
   */
  stickyHeaderOffsetPx?: number;
  modules: ShellModuleItem[];
  activeModuleId: string;
  onModuleChange: (moduleId: string) => void;
  headerRight?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  assistant?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function WorkspaceProjectShellLayout({
  title,
  subtitle,
  workspaceSelect,
  projectSelect,
  environmentSelect,
  stickyHeaderOffsetPx,
  modules,
  activeModuleId,
  onModuleChange,
  headerRight,
  sidebarFooter,
  assistant,
  children,
  className,
}: WorkspaceProjectShellLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarRail />
        <SidebarHeader />
        <SidebarContent>
          <SidebarMenu>
            {modules.map((m) => (
              <SidebarMenuItem key={m.id}>
                <SidebarMenuButton
                  isActive={m.id === activeModuleId}
                  onClick={() => onModuleChange(m.id)}
                >
                  {m.icon}
                  <span>{m.label}</span>
                  {m.badge != null ? (
                    <span className="text-muted-foreground ml-auto text-xs">
                      {String(m.badge)}
                    </span>
                  ) : null}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>{sidebarFooter}</SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className={cn('bg-background min-h-svh', className)}>
          <div
            className="border-border bg-card sticky top-0 z-10 border-b"
            style={{ top: stickyHeaderOffsetPx ?? 0 }}
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-base font-semibold">{title}</p>
                  {subtitle ? (
                    <p className="text-muted-foreground hidden text-sm md:block">
                      {subtitle}
                    </p>
                  ) : null}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {workspaceSelect ? (
                    <ShellSelectControl select={workspaceSelect} />
                  ) : null}
                  {projectSelect ? (
                    <ShellSelectControl select={projectSelect} />
                  ) : null}
                  {environmentSelect ? (
                    <ShellSelectControl select={environmentSelect} />
                  ) : null}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 md:justify-end">
                {headerRight}
              </div>
            </div>
          </div>

          <main className="m-4">{children}</main>
        </div>
      </SidebarInset>
      {assistant}
    </SidebarProvider>
  );
}

function ShellSelectControl({ select }: { select: ShellSelect }) {
  const labelId = React.useId();
  return (
    <div className="flex min-w-[220px] flex-col gap-1">
      <span id={labelId} className="text-muted-foreground text-xs">
        {select.label}
      </span>
      <Select value={select.value} onValueChange={select.onChange}>
        <SelectTrigger aria-labelledby={labelId} className="w-full">
          <SelectValue placeholder={select.placeholder ?? select.label} />
        </SelectTrigger>
        <SelectContent>
          {select.options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
