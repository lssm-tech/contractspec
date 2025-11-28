'use client';

import { useCallback, useState, useMemo } from 'react';
import { Button } from '@lssm/lib.design-system';
import { Card } from '@lssm/lib.ui-kit-web/ui/card';
import { Badge } from '@lssm/lib.ui-kit-web/ui/badge';
import type { TemplateId } from '../../../../templates/registry';
import { useEvolution, type SpecSuggestion } from './hooks/useEvolution';

export interface EvolutionSidebarProps {
  templateId: TemplateId;
  /** Whether sidebar is expanded */
  expanded?: boolean;
  /** Toggle expanded state */
  onToggle?: () => void;
  /** Callback for logging actions */
  onLog?: (message: string) => void;
  /** Navigate to full evolution mode */
  onOpenEvolution?: () => void;
}

/**
 * Compact sidebar for Evolution Engine.
 * Shows top anomalies, pending suggestions, and quick actions.
 * Collapsible by default.
 */
export function EvolutionSidebar({
  templateId,
  expanded = false,
  onToggle,
  onLog,
  onOpenEvolution,
}: EvolutionSidebarProps) {
  const {
    anomalies,
    suggestions,
    loading,
    approveSuggestion,
    rejectSuggestion,
    operationCount,
  } = useEvolution(templateId);

  const pendingSuggestions = useMemo(
    () => suggestions.filter((s) => s.status === 'pending'),
    [suggestions]
  );

  const topAnomalies = useMemo(
    () =>
      anomalies
        .sort((a, b) => {
          const severityOrder = { high: 0, medium: 1, low: 2 };
          return severityOrder[a.severity] - severityOrder[b.severity];
        })
        .slice(0, 3),
    [anomalies]
  );

  const handleApprove = useCallback(
    (id: string) => {
      approveSuggestion(id);
      onLog?.(`Approved suggestion ${id.slice(0, 8)}`);
    },
    [approveSuggestion, onLog]
  );

  const handleReject = useCallback(
    (id: string) => {
      rejectSuggestion(id);
      onLog?.(`Rejected suggestion ${id.slice(0, 8)}`);
    },
    [rejectSuggestion, onLog]
  );

  // Collapsed view - just show badge
  if (!expanded) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm transition hover:bg-violet-500/20"
        type="button"
      >
        <span>🤖</span>
        <span>Evolution</span>
        {pendingSuggestions.length > 0 && (
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            {pendingSuggestions.length}
          </Badge>
        )}
        {anomalies.length > 0 && pendingSuggestions.length === 0 && (
          <Badge variant="destructive">
            {anomalies.length}
          </Badge>
        )}
      </button>
    );
  }

  // Expanded view
  return (
    <Card className="w-80 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-violet-500/20 bg-violet-500/5 px-3 py-2">
        <div className="flex items-center gap-2">
          <span>🤖</span>
          <span className="text-sm font-semibold">Evolution</span>
        </div>
        <div className="flex items-center gap-1">
          {onOpenEvolution && (
            <Button variant="ghost" size="sm" onPress={onOpenEvolution}>
              Expand
            </Button>
          )}
          <button
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground p-1"
            type="button"
            title="Collapse"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto p-3">
        {/* Stats */}
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{operationCount} ops tracked</span>
          <div className="flex items-center gap-2">
            {anomalies.length > 0 && (
              <Badge variant="destructive">
                {anomalies.length} anomalies
              </Badge>
            )}
            {pendingSuggestions.length > 0 && (
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                {pendingSuggestions.length} pending
              </Badge>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-muted-foreground py-4 text-center text-sm">
            Generating suggestions...
          </div>
        )}

        {/* Top Anomalies */}
        {topAnomalies.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase text-violet-400">
              Top Issues
            </p>
            <div className="space-y-2">
              {topAnomalies.map((anomaly, index) => (
                <div
                  key={`${anomaly.operation.name}-${index}`}
                  className="rounded border border-amber-500/20 bg-amber-500/5 p-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span>
                      {anomaly.severity === 'high'
                        ? '🔴'
                        : anomaly.severity === 'medium'
                          ? '🟠'
                          : '🟡'}
                    </span>
                    <span className="truncate font-medium">
                      {anomaly.operation.name}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 truncate">
                    {anomaly.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Suggestions */}
        {pendingSuggestions.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-violet-400">
              Pending Suggestions
            </p>
            <div className="space-y-2">
              {pendingSuggestions.slice(0, 3).map((suggestion) => (
                <CompactSuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
              {pendingSuggestions.length > 3 && (
                <p className="text-muted-foreground text-center text-xs">
                  +{pendingSuggestions.length - 3} more suggestions
                </p>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {anomalies.length === 0 &&
          pendingSuggestions.length === 0 &&
          !loading && (
            <div className="text-muted-foreground py-4 text-center text-xs">
              No issues detected. Keep coding!
            </div>
          )}
      </div>

      {/* Footer */}
      {onOpenEvolution && (
        <div className="border-t border-violet-500/20 p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onPress={onOpenEvolution}
          >
            Open Evolution Dashboard →
          </Button>
        </div>
      )}
    </Card>
  );
}

/**
 * Compact suggestion card for sidebar
 */
function CompactSuggestionCard({
  suggestion,
  onApprove,
  onReject,
}: {
  suggestion: SpecSuggestion;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div className="rounded border border-violet-500/20 bg-violet-500/5 p-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">
            {suggestion.proposal.summary}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <Badge variant="secondary">
              {suggestion.priority}
            </Badge>
            <span className="text-muted-foreground">
              {(suggestion.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-end gap-1">
        <button
          onClick={() => onReject(suggestion.id)}
          className="rounded px-2 py-0.5 text-xs text-red-400 hover:bg-red-400/10"
          type="button"
        >
          Reject
        </button>
        <button
          onClick={() => onApprove(suggestion.id)}
          className="rounded bg-violet-500/20 px-2 py-0.5 text-xs text-violet-400 hover:bg-violet-500/30"
          type="button"
        >
          Approve
        </button>
      </div>
    </div>
  );
}

