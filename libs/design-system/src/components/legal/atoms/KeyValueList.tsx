import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export function KeyValueList({
  items,
  className,
}: {
  items: { key: React.ReactNode; value: React.ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-2', className)}>
      {items.map((it, idx) => (
        <div key={idx} className="flex items-start gap-3">
          <div className="text-foreground w-40 shrink-0 text-base font-medium">
            {it.key}
          </div>
          <div className="text-muted-foreground flex-1 text-base">
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}
