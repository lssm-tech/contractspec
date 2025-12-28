import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import { LegalHeading } from '../atoms/LegalHeading';
import { LegalMeta } from '../molecules/LegalMeta';
import { LegalTOC, type TocItem } from '../molecules/LegalTOC';

export function LegalPageLayout({
  title,
  meta,
  toc,
  children,
  className,
}: {
  title: React.ReactNode;
  meta?: { lastUpdated?: string | Date; version?: string };
  toc?: TocItem[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('mx-auto w-full max-w-6xl px-4 py-8 md:py-12', className)}
    >
      <div className="mb-6 space-y-2">
        <LegalHeading as="h1" level="h1" spacing="sm">
          {title}
        </LegalHeading>
        {meta && (
          <LegalMeta lastUpdated={meta.lastUpdated} version={meta.version} />
        )}
      </div>
      {toc && toc.length > 0 && (
        <div className="mb-6 md:hidden">
          <LegalTOC items={toc} variant="inline" />
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
        {toc && toc.length > 0 ? (
          <aside className="sticky top-24 hidden self-start md:block">
            <LegalTOC items={toc} variant="sidebar" />
          </aside>
        ) : (
          <div className="hidden md:block" />
        )}
        <article className="prose text-foreground max-w-none">
          {children}
        </article>
      </div>
    </div>
  );
}
