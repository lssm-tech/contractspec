'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { Separator } from '@contractspec/lib.ui-kit-web/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@contractspec/lib.ui-kit-web/ui/breadcrumb';
import { AppSidebar } from './AppSidebar';

export interface AppLayoutProps {
  header: React.ReactNode;
  sidebar?: React.ComponentProps<typeof AppSidebar>;
  breadcrumb?: { items: { href?: string; label: React.ReactNode }[] };
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AppLayout({
  header,
  sidebar,
  breadcrumb,
  children,
  footer,
  className,
}: AppLayoutProps) {
  return (
    <div className={cn('bg-background min-h-svh', className)}>
      {header}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden md:block">
          {sidebar ? (
            <AppSidebar
              sections={sidebar.sections}
              top={sidebar.top}
              bottom={sidebar.bottom}
              className={sidebar.className}
              density={sidebar.density}
            />
          ) : (
            <div />
          )}
        </aside>

        <main className="min-w-0">
          {breadcrumb && breadcrumb.items?.length ? (
            <div className="mb-2">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumb.items.map((it, idx) => (
                    <React.Fragment key={idx}>
                      <BreadcrumbItem>
                        {it.href ? (
                          <BreadcrumbLink href={it.href}>
                            {it.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{it.label}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {idx < breadcrumb.items.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          ) : null}

          {children}
        </main>
      </div>
      {footer && (
        <>
          <Separator className="mt-4" />
          {footer}
        </>
      )}
    </div>
  );
}
