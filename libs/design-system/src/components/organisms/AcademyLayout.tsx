'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@contractspec/lib.ui-kit-web/ui/breadcrumb';

export interface AcademyLayoutProps {
  header: React.ReactNode;
  toc?: React.ReactNode; // sidebar TOC on desktop
  breadcrumb?: { items: { href?: string; label: React.ReactNode }[] };
  children: React.ReactNode; // article/content
  rightPanel?: React.ReactNode; // optional exercises/progress
  footer?: React.ReactNode;
  className?: string;
}

export function AcademyLayout({
  header,
  toc,
  breadcrumb,
  children,
  rightPanel,
  footer,
  className,
}: AcademyLayoutProps) {
  return (
    <div className={cn('bg-background min-h-svh', className)}>
      {header}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_minmax(0,1fr)_240px]">
        <aside className="sticky top-24 hidden self-start md:block">
          {toc}
        </aside>
        <main className="min-w-0">
          {breadcrumb && breadcrumb.items?.length ? (
            <div className="mb-4">
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
          <article className="prose text-foreground max-w-none">
            {children}
          </article>
        </main>
        <aside className="sticky top-24 hidden self-start lg:block">
          {rightPanel}
        </aside>
      </div>
      {footer}
    </div>
  );
}
