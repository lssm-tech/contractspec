'use client';

import { useCallback, useMemo, useState } from 'react';
import { Button } from '@contractspec/lib.design-system';
import { Card } from '@contractspec/lib.ui-kit-web/ui/card';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import type { TemplateId } from './lib/types';
import {
  type BehaviorSummary,
  useBehaviorTracking,
} from './hooks/useBehaviorTracking';

export interface PersonalizationInsightsProps {
  templateId: TemplateId;
  /** Whether to show in collapsed mode */
  collapsed?: boolean;
  /** Toggle collapsed state */
  onToggle?: () => void;
}

/**
 * Component showing personalization insights based on user behavior.
 * Displays usage patterns, recommendations, and feature adoption.
 */
export function PersonalizationInsights({
  templateId,
  collapsed = false,
  onToggle,
}: PersonalizationInsightsProps) {
  const { getSummary, eventCount, clear, sessionStart } =
    useBehaviorTracking(templateId);

  const [showDetails, setShowDetails] = useState(false);

  const summary = useMemo(() => getSummary(), [getSummary]);

  const formatDuration = useCallback((ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }, []);

  const handleClear = useCallback(() => {
    clear();
  }, [clear]);

  // Collapsed view
  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm transition hover:bg-blue-500/20"
        type="button"
      >
        <span>📊</span>
        <span>Insights</span>
        <Badge variant="secondary">{eventCount}</Badge>
      </button>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-blue-500/20 bg-blue-500/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span>📊</span>
          <span className="font-semibold">Personalization Insights</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onPress={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
          {onToggle && (
            <button
              onClick={onToggle}
              className="text-muted-foreground hover:text-foreground p-1"
              type="button"
              title="Collapse"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Quick Stats */}
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="Session Time"
            value={formatDuration(summary.sessionDuration)}
            icon="⏱️"
          />
          <StatCard
            label="Events Tracked"
            value={summary.totalEvents.toString()}
            icon="📈"
          />
          <StatCard
            label="Features Used"
            value={`${summary.featuresUsed.length}/${summary.featuresUsed.length + summary.unusedFeatures.length}`}
            icon="✨"
          />
          <StatCard
            label="Errors"
            value={summary.errorCount.toString()}
            icon="⚠️"
            variant={summary.errorCount > 0 ? 'warning' : 'success'}
          />
        </div>

        {/* Recommendations */}
        {summary.recommendations.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-xs font-semibold text-blue-400 uppercase">
              Recommendations
            </h4>
            <ul className="space-y-1">
              {summary.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-400">💡</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Unused Features */}
        {summary.unusedFeatures.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-xs font-semibold text-blue-400 uppercase">
              Try These Features
            </h4>
            <div className="flex flex-wrap gap-2">
              {summary.unusedFeatures.slice(0, 5).map((feature) => (
                <Badge key={feature} variant="secondary">
                  {formatFeatureName(feature)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Detailed View */}
        {showDetails && (
          <DetailedInsights summary={summary} sessionStart={sessionStart} />
        )}

        {/* Footer Actions */}
        <div className="mt-4 flex justify-end border-t border-blue-500/10 pt-4">
          <Button variant="ghost" size="sm" onPress={handleClear}>
            Clear Data
          </Button>
        </div>
      </div>
    </Card>
  );
}

/**
 * Stat card component
 */
function StatCard({
  label,
  value,
  icon,
  variant = 'default',
}: {
  label: string;
  value: string;
  icon: string;
  variant?: 'default' | 'warning' | 'success';
}) {
  const bgColors = {
    default: 'bg-blue-500/5 border-blue-500/20',
    warning: 'bg-amber-500/5 border-amber-500/20',
    success: 'bg-green-500/5 border-green-500/20',
  };

  return (
    <div className={`rounded-lg border p-3 text-center ${bgColors[variant]}`}>
      <div className="mb-1 text-lg">{icon}</div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-muted-foreground text-xs">{label}</div>
    </div>
  );
}

/**
 * Detailed insights section
 */
function DetailedInsights({
  summary,
  sessionStart,
}: {
  summary: BehaviorSummary;
  sessionStart: Date;
}) {
  return (
    <div className="mt-4 space-y-4 border-t border-blue-500/10 pt-4">
      {/* Most Used Templates */}
      {summary.mostUsedTemplates.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold text-blue-400 uppercase">
            Most Used Templates
          </h4>
          <div className="space-y-1">
            {summary.mostUsedTemplates.map(({ templateId, count }) => (
              <div
                key={templateId}
                className="flex items-center justify-between text-sm"
              >
                <span>{formatTemplateId(templateId)}</span>
                <span className="text-muted-foreground">{count} events</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Most Used Modes */}
      {summary.mostUsedModes.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold text-blue-400 uppercase">
            Mode Usage
          </h4>
          <div className="space-y-1">
            {summary.mostUsedModes.map(({ mode, count }) => (
              <div
                key={mode}
                className="flex items-center justify-between text-sm"
              >
                <span>{formatFeatureName(mode)}</span>
                <span className="text-muted-foreground">{count} switches</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Used */}
      <div>
        <h4 className="mb-2 text-xs font-semibold text-blue-400 uppercase">
          Features Used
        </h4>
        <div className="flex flex-wrap gap-2">
          {summary.featuresUsed.map((feature) => (
            <Badge
              key={feature}
              variant="default"
              className="border-green-500/30 bg-green-500/20 text-green-400"
            >
              ✓ {formatFeatureName(feature)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Session Info */}
      <div className="text-muted-foreground text-xs">
        Session started: {sessionStart.toLocaleString()}
      </div>
    </div>
  );
}

/**
 * Format feature name for display
 */
function formatFeatureName(feature: string): string {
  return feature.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Format template ID for display
 */
function formatTemplateId(id: string): string {
  return id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
