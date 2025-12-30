'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import {
  NavigationMenu as Nav,
  NavigationMenuContent as NavContent,
  NavigationMenuItem as NavItem,
  NavigationMenuLink as NavLink,
  NavigationMenuList as NavList,
  NavigationMenuTrigger as NavTrigger,
} from '@contractspec/lib.ui-kit-web/ui/navigation-menu';
import { Separator } from '@contractspec/lib.ui-kit-web/ui/separator';
import type { MarketingHeaderProps } from './MarketingHeader';
import { cva } from 'class-variance-authority';
import { NavUser } from '../molecules/NavUser';
import { NavItemCard } from '../molecules/NavItemCard';
import { ButtonLink } from '../atoms/ButtonLink';

const headerVariants = cva(
  'hidden items-center justify-between gap-4 md:flex',
  {
    variants: {
      density: {
        compact: 'px-3 py-2',
        comfortable: 'px-4 py-3',
      },
    },
    defaultVariants: { density: 'comfortable' },
  }
);

export function MarketingHeaderDesktop({
  logo,
  nav = [],
  userMenu,
  cta,
  className,
  density,
  right,
}: MarketingHeaderProps) {
  return (
    <div
      className={cn(
        'bg-background/95 supports-backdrop-filter:bg-background/60 w-full border-b backdrop-blur-xs',
        className
      )}
    >
      <div
        className={cn('mx-auto w-full max-w-7xl', headerVariants({ density }))}
      >
        <div className="flex items-center gap-4">
          {logo}
          {nav.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Nav>
                <NavList>
                  {nav.map((item) => (
                    <NavItem key={String(item.key ?? item.href ?? item.label)}>
                      {item.items && item.items.length > 0 ? (
                        <>
                          <NavTrigger>{item.label}</NavTrigger>
                          <NavContent>
                            <div className="grid w-[760px] grid-cols-3 gap-3 p-3">
                              {item.items.map((link) => (
                                <NavItemCard key={link.href} item={link} />
                              ))}
                            </div>
                          </NavContent>
                        </>
                      ) : (
                        <NavLink href={item.href || '#'}>{item.label}</NavLink>
                      )}
                    </NavItem>
                  ))}
                </NavList>
              </Nav>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {right}
          {cta && (
            <ButtonLink
              variant={cta.variant}
              size={cta.size}
              href={cta.href}
              onClick={cta.onClick}
            >
              {cta.label}
            </ButtonLink>
          )}
          {userMenu && <NavUser {...userMenu} />}
        </div>
      </div>
    </div>
  );
}
