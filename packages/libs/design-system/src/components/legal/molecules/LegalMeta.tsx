import * as React from 'react';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';

export function LegalMeta({
  lastUpdated,
  version,
  className,
}: {
  lastUpdated?: string | Date;
  version?: string;
  className?: string;
}) {
  const fmtDate = (d?: string | Date) => {
    if (!d) return null;
    try {
      const date = typeof d === 'string' ? new Date(d) : d;
      return date.toLocaleDateString();
    } catch {
      return String(d);
    }
  };
  return (
    <div className={cn('text-muted-foreground text-base', className)}>
      {version && <span>Version {version}</span>}
      {version && lastUpdated && <span className="mx-2">•</span>}
      {lastUpdated && <span>Dernière mise à jour: {fmtDate(lastUpdated)}</span>}
    </div>
  );
}
