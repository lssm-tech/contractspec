import { getDocsPageByHref } from '@contractspec/bundle.library/components/docs/docsManifest';
import { cn } from '@contractspec/lib.ui-kit-core';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@contractspec/lib.ui-kit-web/ui/collapsible';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@contractspec/lib.ui-kit-web/ui/dropdown-menu';
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
import { AnvilIcon, BookOpenIcon, HouseIcon, Minus, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import {
	docsSecondarySections,
	docsSections,
} from '@/components/docs-sidebar-nav';
import packageJson from '../../../package.json';

// This is sample data.
const data = {
	navSpaces: [
		{ title: 'Home', href: '/', icon: <HouseIcon /> },
		{
			title: 'Studio',
			href: 'https://www.contractspec.studio/docs',
			icon: <AnvilIcon />,
		},
	],
	navMain: docsSections,
};

export function DocsNavSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	const { isMobile } = useSidebar();
	const activePage = getDocsPageByHref(pathname);

	const isItemActive = (href?: string) =>
		typeof href === 'string' && pathname === href;

	const activeSectionIndex = data.navMain.findIndex((section) => {
		return section.items.some((item) => isItemActive(item.href));
	});

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<div className="rounded-[24px] border border-sidebar-border/80 bg-sidebar-primary/8 p-4">
					<p className="font-mono text-[11px] text-[color:var(--rust)] uppercase tracking-[0.24em]">
						ContractSpec docs
					</p>
					<h2 className="mt-2 font-serif text-2xl tracking-[-0.03em]">
						Open system docs
					</h2>
					<p className="mt-2 text-sidebar-foreground/75 text-sm leading-6">
						Build on the OSS foundation first. Use Studio when you want the
						operating layer on top.
					</p>
				</div>
				<SidebarMenu>
					<DropdownMenu>
						<SidebarMenuItem>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton size="lg" asChild>
									<a href="#sidebar-header-btn">
										<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
											<BookOpenIcon className="size-4" />
										</div>
										<div className="flex flex-col gap-0.5 leading-none">
											<span className="font-medium">OSS reference</span>
											<span>v{packageJson.version}</span>
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
					<div className="mb-3 px-2">
						<p className="font-mono text-[11px] text-sidebar-foreground/55 uppercase tracking-[0.2em]">
							Primary docs
						</p>
						<p className="mt-1 text-sidebar-foreground/70 text-xs leading-5">
							{activePage?.description ??
								'Start with the open system, then drill into build, operate, integration, and reference paths.'}
						</p>
					</div>
					<SidebarMenu>
						{data.navMain.map((section, idx) => (
							<Collapsible
								key={section.title}
								defaultOpen={idx === activeSectionIndex}
								className="group/collapsible"
							>
								<SidebarMenuItem>
									<React.Fragment key={section.title}>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton>
												{section.title}
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
																'text-primary': isItemActive(sectionItem.href),
															})}
														>
															<a href={sectionItem.href}>{sectionItem.title}</a>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</React.Fragment>
								</SidebarMenuItem>
							</Collapsible>
						))}
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup>
					<div className="mb-3 px-2">
						<p className="font-mono text-[11px] text-sidebar-foreground/55 uppercase tracking-[0.2em]">
							Secondary reading
						</p>
						<p className="mt-1 text-sidebar-foreground/70 text-xs leading-5">
							Philosophy, comparisons, and educational pages that support the
							main OSS path without replacing it.
						</p>
					</div>

					<SidebarMenu>
						{docsSecondarySections.map((section) => (
							<Collapsible key={section.key} className="group/collapsible">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton>
											{section.title}
											<Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
											<Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{section.items.map((item) => (
												<SidebarMenuSubItem key={item.title}>
													<SidebarMenuSubButton
														asChild
														isActive={isItemActive(item.href)}
														className={cn({
															'text-primary': isItemActive(item.href),
														})}
													>
														<a href={item.href}>{item.title}</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
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
