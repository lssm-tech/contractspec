import * as React from 'react';
import { PlugZap, ToggleRight } from 'lucide-react';

export interface IntegrationCardProps {
  id: string;
  provider: string;
  name: string;
  category?: string;
  enabled?: boolean;
  lastSyncAt?: string | null;
  status?: 'connected' | 'disconnected' | 'error';
  onToggle?: (id: string, enabled: boolean) => void;
  onConfigure?: (id: string) => void;
}

export function IntegrationCard({
  id,
  provider,
  name,
  category,
  enabled = true,
  lastSyncAt,
  status = 'connected',
  onToggle,
  onConfigure,
}: IntegrationCardProps) {
  const tone =
    status === 'connected'
      ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
      : status === 'error'
        ? 'text-red-500 bg-red-500/10 border-red-500/30'
        : 'text-gray-500 bg-gray-500/10 border-gray-500/30';

  return (
    <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-4 shadow-sm">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xl font-semibold">{name}</p>
          <p className="text-muted-foreground text-sm">{provider}</p>
        </div>
        <button
          type="button"
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase ${tone}`}
          onClick={() => onToggle?.(id, !enabled)}
        >
          <ToggleRight className="h-3.5 w-3.5" />
          {enabled ? 'Enabled' : 'Disabled'}
        </button>
      </header>
      <div className="text-muted-foreground text-sm">
        {category && <span className="font-medium">{category}</span>}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs tracking-wide uppercase">
          <span className="inline-flex items-center gap-1">
            <PlugZap className="h-3 w-3" />
            {status}
          </span>
          <span>
            Last sync:{' '}
            {lastSyncAt
              ? new Date(lastSyncAt).toLocaleString()
              : 'Not synced yet'}
          </span>
        </div>
      </div>
      <footer className="flex items-center gap-2">
        <button
          type="button"
          className="btn-primary flex-1"
          onClick={() => onConfigure?.(id)}
        >
          Configure
        </button>
        <button
          type="button"
          className="btn-ghost flex-1"
          onClick={() => onToggle?.(id, !enabled)}
        >
          {enabled ? 'Disconnect' : 'Connect'}
        </button>
      </footer>
    </div>
  );
}










