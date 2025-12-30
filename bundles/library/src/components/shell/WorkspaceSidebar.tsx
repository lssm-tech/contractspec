import * as React from 'react';
import { Settings } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@contractspec/lib.ui-kit-web/ui/sidebar';

export interface ShellModuleItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface WorkspaceSidebarProps {
  modules: ShellModuleItem[];
  activeModuleId: string;
  onModuleChange: (moduleId: string) => void;
  sidebarFooter?: React.ReactNode;
}

export function WorkspaceSidebar({
  modules,
  activeModuleId,
  onModuleChange,
  sidebarFooter,
}: WorkspaceSidebarProps) {
  return (
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
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={activeModuleId === 'settings'}
              onClick={() => onModuleChange('settings')}
            >
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>{sidebarFooter}</SidebarFooter>
    </Sidebar>
  );
}
