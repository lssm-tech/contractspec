'use client';

import * as React from 'react';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';
import { Button } from '../atoms/Button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
  SheetFooter,
  SheetDescription,
} from '@lssm/lib.ui-kit-web/ui/sheet';
import { Menu } from 'lucide-react';
import type { MarketingHeaderProps } from './MarketingHeader';
import { MobileNavMenu } from '../molecules/MobileNavMenu';
import { CommandSearchTrigger } from '../molecules/CommandSearchTrigger';
import { LangSwitchDropdown } from '../molecules/LangSwitchDropdown';
import { VStack } from '@lssm/lib.ui-kit-web/ui/stack';

export function MarketingHeaderMobile({
  logo,
  nav = [],
  className,
  right,
}: MarketingHeaderProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className={cn(
        'bg-background/95 supports-backdrop-filter:bg-background/60 w-full border-b backdrop-blur-xs md:hidden',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] p-4">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  <div className="mb-3">
                    <CommandSearchTrigger groups={[]} compact />
                  </div>
                  <MobileNavMenu items={nav} />
                </SheetDescription>
              </SheetHeader>
              <VStack>
                <MobileNavMenu items={nav} />
              </VStack>
              <SheetFooter>
                {right}
                {/* todo */}
              </SheetFooter>
            </SheetContent>
          </Sheet>
          {logo}
        </div>
        <div className="flex items-center gap-2">
          <LangSwitchDropdown
            value={'en'}
            options={[
              { code: 'fr', label: 'FR' },
              { code: 'en', label: 'EN' },
            ]}
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
