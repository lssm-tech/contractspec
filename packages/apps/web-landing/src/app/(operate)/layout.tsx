/**
 * Operate layout — minimal full-height container for PM workbench and other operate surfaces.
 * Route group (operate) does not add to URL path.
 */

import type { ReactNode } from 'react';

export default function OperateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background flex h-screen w-full flex-col">
      <header className="flex shrink-0 items-center gap-4 border-b px-4 py-2">
        <a
          href="/"
          className="text-muted-foreground hover:text-foreground text-sm font-medium"
        >
          ContractSpec
        </a>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">Operate</span>
      </header>
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
