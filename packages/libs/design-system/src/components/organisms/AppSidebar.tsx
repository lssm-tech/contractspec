import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from '@contractspec/lib.ui-kit-web/ui/sidebar';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { cva } from 'class-variance-authority';
import type { NavSection } from '../../types/navigation';

export interface AppSidebarProps {
  sections: NavSection[];
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  searchPlaceholder?: string;
  className?: string;
  density?: 'compact' | 'comfortable';
}

export function AppSidebar({
  sections,
  top,
  bottom,
  searchPlaceholder = 'Search…',
  className,
  density,
}: AppSidebarProps) {
  const sidebarVariants = cva('', {
    variants: {
      density: {
        compact: 'text-sm',
        comfortable: 'text-base',
      },
    },
    defaultVariants: { density: 'comfortable' },
  });
  return (
    <SidebarProvider>
      <Sidebar className={cn(sidebarVariants({ density }), className)}>
        <SidebarRail />
        <SidebarHeader>
          {top}
          <SidebarInput
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
        </SidebarHeader>
        <SidebarContent>
          {sections.map((s, idx) => (
            <SidebarGroup key={idx}>
              {s.title && <SidebarGroupLabel>{s.title}</SidebarGroupLabel>}
              <SidebarGroupContent>
                <SidebarMenu>
                  {s.items.map((l) => (
                    <SidebarMenuItem key={l.href}>
                      <SidebarMenuButton asChild={!!l.href} isActive={false}>
                        {}
                        <a
                          href={l.href}
                          target={l.target}
                          className="inline-flex items-center gap-2"
                        >
                          {l.icon}
                          <span>{l.label}</span>
                        </a>
                      </SidebarMenuButton>
                      {l.badge != null && (
                        <SidebarMenuBadge>{String(l.badge)}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>{bottom}</SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}

// export { SidebarTrigger } from '@contractspec/lib.ui-kit-web/ui/sidebar';
