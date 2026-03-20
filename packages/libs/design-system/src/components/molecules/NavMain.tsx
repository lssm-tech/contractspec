import {
	NavigationMenu as Nav,
	NavigationMenuContent as NavContent,
	NavigationMenuItem as NavItem,
	NavigationMenuLink as NavLink,
	NavigationMenuList as NavList,
	NavigationMenuTrigger as NavTrigger,
} from '@contractspec/lib.ui-kit-web/ui/navigation-menu';
import { HStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import type { HeaderNavItem } from '../../types/navigation';

export function NavMain({
	items,
	className,
}: {
	items: HeaderNavItem[];
	className?: string;
}) {
	return (
		<Nav className={cn('hidden md:flex', className)}>
			<NavList>
				{items.map((it) => (
					<NavItem key={String(it.key ?? it.href ?? it.label)}>
						{it.items && it.items.length > 0 ? (
							<>
								<NavTrigger>
									<Text>{it.label}</Text>
								</NavTrigger>
								<NavContent>
									<HStack className="grid w-[500px] grid-cols-2 gap-3 p-3">
										{it.items.map((l) => (
											<NavLink
												key={l.href}
												href={l.href}
												className="block rounded-md p-2 hover:bg-accent"
											>
												<Text className="font-medium text-base">{l.label}</Text>
												{l.badge && (
													<Text className="ml-2 text-muted-foreground text-xs">
														{l.badge}
													</Text>
												)}
											</NavLink>
										))}
									</HStack>
								</NavContent>
							</>
						) : (
							<NavLink href={it.href || '#'}>{it.label}</NavLink>
						)}
					</NavItem>
				))}
			</NavList>
		</Nav>
	);
}
