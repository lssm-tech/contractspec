'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';

export interface MarketingLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function MarketingLayout({
  header,
  children,
  footer,
  className,
}: MarketingLayoutProps) {
  return (
    <VStack gap="none" className={cn('bg-background min-h-svh', className)}>
      {header}

      {/* <main id="main" className="mx-auto w-full max-w-7xl px-4 py-8"> */}
      <main id="main" className="flex-1">
        {children}
      </main>

      {footer}
    </VStack>
  );
}
