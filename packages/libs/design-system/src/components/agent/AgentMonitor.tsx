'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@contractspec/lib.ui-kit-web/ui/card';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';

export interface AgentSessionSnapshot {
  sessionId: string;
  agent: string;
  status: string;
  tenantId?: string;
  confidence?: number;
  iterations?: number;
  updatedAt: Date;
}

export interface AgentMonitorProps {
  title?: string;
  sessions: AgentSessionSnapshot[];
  highlightStatus?: string;
  onSelectSession?: (session: AgentSessionSnapshot) => void;
  className?: string;
}

export function AgentMonitor({
  title = 'Agent Activity',
  sessions,
  highlightStatus = 'escalated',
  onSelectSession,
  className,
}: AgentMonitorProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No active sessions in the last hour.
          </p>
        ) : (
          <div className="divide-border divide-y rounded-md border">
            {sessions.map((session) => (
              <button
                key={session.sessionId}
                type="button"
                onClick={() => onSelectSession?.(session)}
                className={cn(
                  'hover:bg-muted/40 flex w-full items-center gap-4 px-4 py-3 text-left transition',
                  !onSelectSession && 'cursor-default'
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {session.agent}{' '}
                    <span className="text-muted-foreground text-sm">
                      · {session.tenantId ?? 'global'}
                    </span>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {session.iterations ?? 0} turns · Updated{' '}
                    {formatRelative(session.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {typeof session.confidence === 'number' && (
                    <ConfidencePill value={session.confidence} />
                  )}
                  <Badge
                    variant={
                      session.status === highlightStatus
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {session.status}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ConfidencePill({ value }: { value: number }) {
  const percent = Math.round(value * 100);
  return (
    <div
      className={cn(
        'rounded-full px-3 py-1 text-sm font-medium',
        percent >= 75
          ? 'bg-emerald-500/15 text-emerald-500'
          : 'bg-amber-500/15 text-amber-600'
      )}
    >
      {percent}%
    </div>
  );
}

function formatRelative(date: Date) {
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  const deltaMinutes = Math.round(
    (Date.now() - new Date(date).getTime()) / 60000
  );
  if (Math.abs(deltaMinutes) < 60) {
    return formatter.format(-deltaMinutes, 'minute');
  }
  const deltaHours = Math.round(deltaMinutes / 60);
  if (Math.abs(deltaHours) < 24) {
    return formatter.format(-deltaHours, 'hour');
  }
  const deltaDays = Math.round(deltaHours / 24);
  return formatter.format(-deltaDays, 'day');
}
