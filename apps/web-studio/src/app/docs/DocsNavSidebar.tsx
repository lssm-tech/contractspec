import * as React from 'react';
import { AnvilIcon, BookOpenIcon, HouseIcon, Minus, Plus } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@contractspec/lib.ui-kit-web/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@contractspec/lib.ui-kit-web/ui/sidebar';
import { docsSections } from '@/components/docs-sidebar-nav';
import { usePathname } from 'next/navigation';
import { cn } from '@contractspec/lib.ui-kit-core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@contractspec/lib.ui-kit-web/ui/dropdown-menu';
import packageJson from '../../../package.json';

// This is sample data.
const data = {
  navSpaces: [
    {
      title: 'Home',
      href: 'https://www.contractspec.io/docs',
      icon: <HouseIcon />,
    },
    { title: 'Studio', href: '/docs', icon: <AnvilIcon /> },
  ],
  navMain: docsSections,
};

export function DocsNavSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  const isItemActive = (href?: string) =>
    typeof href === 'string' && pathname === href;

  const activeSectionIndex = data.navMain.findIndex((section) => {
    return (
      isItemActive(section.href) ||
      section.items.some((item) => isItemActive(item.href))
    );
  });

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <DropdownMenu>
            <SidebarMenuItem>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" asChild>
                  <a href="/docs">
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      <BookOpenIcon className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-medium">Studio Documentation</span>
                      <span className="">v{packageJson.version}</span>
                    </div>
                  </a>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
                // className="rounded-lg"
              >
                {data.navSpaces.map((item) => (
                  <DropdownMenuItem asChild key={item.title}>
                    <a href={item.href}>
                      {item.icon}
                      {item.title}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </SidebarMenuItem>
          </DropdownMenu>
        </SidebarMenu>

        {/* TODO: plug a rag + fuzzy search into the search */}
        {/*<DocsSearchForm />*/}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((section, idx) => (
              <Collapsible
                key={section.title}
                defaultOpen={idx === activeSectionIndex}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  {section.items?.length ? (
                    <React.Fragment key={section.title}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          {section.title}{' '}
                          <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                          <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {section.items.map((sectionItem) => (
                            <SidebarMenuSubItem key={sectionItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isItemActive(sectionItem.href)}
                                className={cn({
                                  'text-primary': isItemActive(
                                    sectionItem.href
                                  ),
                                })}
                              >
                                <a href={sectionItem.href}>
                                  {sectionItem.title}
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </React.Fragment>
                  ) : (
                    <SidebarMenuButton key={section.title}>
                      <a
                        href={section.href}
                        className={cn({
                          'text-primary': isItemActive(section.href),
                        })}
                      >
                        {section.title}
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
