'use client';

import * as React from 'react';
import {
  Breadcrumb as Root,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@contractspec/lib.ui-kit-web/ui/breadcrumb';

export interface BreadcrumbItemDef {
  href?: string;
  label: React.ReactNode;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItemDef[] }) {
  if (!items?.length) return null;
  return (
    <Root>
      <BreadcrumbList>
        {items.map((it, idx) => (
          <React.Fragment key={idx}>
            <BreadcrumbItem>
              {it.href ? (
                <BreadcrumbLink href={it.href}>{it.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{it.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {idx < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Root>
  );
}
