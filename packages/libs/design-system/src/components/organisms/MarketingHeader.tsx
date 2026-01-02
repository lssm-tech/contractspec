'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { Button } from '../atoms/Button';
import { ButtonLink } from '../atoms/ButtonLink';
import {
  NavigationMenu as Nav,
  NavigationMenuContent as NavContent,
  NavigationMenuItem as NavItem,
  NavigationMenuLink as NavLink,
  NavigationMenuList as NavList,
  NavigationMenuTrigger as NavTrigger,
} from '@contractspec/lib.ui-kit-web/ui/navigation-menu';
import { Separator } from '@contractspec/lib.ui-kit-web/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@contractspec/lib.ui-kit-web/ui/sheet';
import { Menu } from 'lucide-react';
import { MobileNavMenu } from '../molecules/MobileNavMenu';
import { CommandSearchTrigger } from '../molecules/CommandSearchTrigger';
import { LangSwitchDropdown } from '../molecules/LangSwitchDropdown';
import type {
  CtaAction,
  HeaderNavItem,
  UserMenuItem,
} from '../../types/navigation';
import { NavUser } from '../molecules/NavUser';
import { cva } from 'class-variance-authority';
import { NavItemCard } from '../molecules/NavItemCard';
import { Box, HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { CommandPalette } from '../molecules/CommandPalette';
import type { LangSwitchProps } from '../molecules/LangSwitch';
import { Text } from '@contractspec/lib.ui-kit-web/ui/text';

export interface MarketingHeaderProps {
  logo: React.ReactNode;
  nav?: HeaderNavItem[];
  navLinkClassName?: string;
  userMenu?: {
    name?: string;
    email?: string;
    imageUrl?: string;
    items: UserMenuItem[];
  };
  cta?: CtaAction;
  className?: string;
  density?: 'compact' | 'comfortable';
  right?: React.ReactNode; // e.g. AI link button, extra actions
  commandPaletteGroups: React.ComponentProps<typeof CommandPalette>['groups'];
  langSwitchProps: LangSwitchProps;
}

const headerVariants = cva('flex items-center justify-between gap-4', {
  variants: {
    density: {
      compact: 'px-3 py-2',
      comfortable: 'px-4 py-3',
    },
  },
  defaultVariants: { density: 'comfortable' },
});

export function MarketingHeader({
  logo,
  nav = [],
  navLinkClassName,
  userMenu,
  cta,
  className,
  density,
  right,
  commandPaletteGroups,
  langSwitchProps,
}: MarketingHeaderProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <HStack
      as="header"
      className={cn(
        'bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xs',
        className
      )}
    >
      <HStack
        className={cn(
          'mx-auto w-full max-w-7xl items-center justify-center',
          headerVariants({ density })
        )}
      >
        {/* Mobile: compact left cluster */}
        <VStack className="flex items-center gap-2 md:hidden">
          {/* Menu trigger (sheet) */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[320px] p-4">
              {!!commandPaletteGroups?.length && (
                <SheetHeader>
                  <CommandSearchTrigger groups={commandPaletteGroups} />
                  {/*<SheetTitle>Menu</SheetTitle>*/}
                </SheetHeader>
              )}

              {cta && (
                <VStack className="mb-3">
                  <ButtonLink
                    variant={cta.variant}
                    size={cta.size}
                    href={cta.href}
                    onClick={cta.onClick}
                  >
                    <Text>{cta.label}</Text>
                  </ButtonLink>
                </VStack>
              )}

              <MobileNavMenu items={nav} />
            </SheetContent>
          </Sheet>
        </VStack>

        {logo}

        {/* Desktop navigation */}
        <HStack className="hidden items-center gap-4 md:flex">
          {nav.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Nav className="hidden md:flex">
                <NavList>
                  {nav.map((item) => (
                    <NavItem key={String(item.key ?? item.href ?? item.label)}>
                      {item.items && item.items.length > 0 ? (
                        <>
                          <NavTrigger className={navLinkClassName}>
                            {item.label}
                          </NavTrigger>
                          <NavContent>
                            <div className="grid w-[760px] grid-cols-3 gap-3 p-3">
                              {item.items.map((link) => (
                                <NavItemCard key={link.href} item={link} />
                              ))}
                            </div>
                          </NavContent>
                        </>
                      ) : (
                        <NavLink
                          className={navLinkClassName}
                          href={item.href || '#'}
                        >
                          {item.label}
                        </NavLink>
                      )}
                    </NavItem>
                  ))}
                </NavList>
              </Nav>
            </>
          )}
        </HStack>

        <HStack className="flex items-center gap-2">
          {/* Desktop: show search trigger and custom right slot */}
          {!!commandPaletteGroups?.length && (
            <Box className="hidden items-center gap-2 md:flex">
              <CommandSearchTrigger groups={commandPaletteGroups} />
            </Box>
          )}

          {!!(langSwitchProps?.options?.length > 1) && (
            <LangSwitchDropdown
              value={langSwitchProps.value}
              onChange={langSwitchProps.onChange}
              options={langSwitchProps.options}
            />
          )}

          {right && <Box className="hidden md:flex">{right}</Box>}

          {cta && (
            <Box className="hidden md:flex">
              <ButtonLink
                variant={cta.variant}
                size={cta.size}
                href={cta.href}
                onClick={cta.onClick}
              >
                <Text>{cta.label}</Text>
              </ButtonLink>
            </Box>
          )}

          {userMenu && <NavUser {...userMenu} />}
        </HStack>
      </HStack>
    </HStack>
  );
}
