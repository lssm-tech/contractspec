'use client';

import { useCallback, useMemo } from 'react';
import { Button, LoaderBlock } from '@contractspec/lib.design-system';
import { Card } from '@contractspec/lib.ui-kit-web/ui/card';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import type { TemplateId } from '../../../lib/registry';
import {
  useEvolution,
  type SpecSuggestion,
  type SpecAnomaly,
  type SpecUsageStats,
  type OptimizationHint,
} from './hooks/useEvolution';

export interface EvolutionDashboardProps {
  templateId: TemplateId;
  onLog?: (message: string) => void;
}

/**
 * Dashboard for AI-powered spec evolution.
 * Shows usage statistics, anomalies, AI suggestions, and optimization hints.
 */
export function EvolutionDashboard({
  templateId,
  onLog,
}: EvolutionDashboardProps) {
  const {
    usageStats,
    anomalies,
    suggestions,
    hints,
    loading,
    trackOperation,
    analyzeUsage,
    generateSuggestions,
    approveSuggestion,
    rejectSuggestion,
    clear,
    operationCount,
  } = useEvolution(templateId);

  // Simulate operations for demo
  const handleSimulateOperations = useCallback(() => {
    // Simulate various operations with different outcomes
    const operations = [
      { name: `${templateId}.list`, duration: 150, success: true },
      { name: `${templateId}.list`, duration: 180, success: true },
      { name: `${templateId}.create`, duration: 350, success: true },
      {
        name: `${templateId}.create`,
        duration: 420,
        success: false,
        error: 'VALIDATION_ERROR',
      },
      { name: `${templateId}.list`, duration: 200, success: true },
      { name: `${templateId}.get`, duration: 80, success: true },
      { name: `${templateId}.update`, duration: 280, success: true },
      { name: `${templateId}.list`, duration: 950, success: true }, // Slow
      {
        name: `${templateId}.delete`,
        duration: 150,
        success: false,
        error: 'NOT_FOUND',
      },
      { name: `${templateId}.create`, duration: 380, success: true },
    ];

    for (const op of operations) {
      trackOperation(op.name, op.duration, op.success, op.error);
    }

    onLog?.(`Simulated ${operations.length} operations`);
    // Auto-analyze after simulation
    setTimeout(() => {
      analyzeUsage();
      onLog?.('Analysis complete');
    }, 100);
  }, [templateId, trackOperation, analyzeUsage, onLog]);

  const handleGenerateSuggestions = useCallback(async () => {
    await generateSuggestions();
    onLog?.('AI suggestions generated');
  }, [generateSuggestions, onLog]);

  const handleApproveSuggestion = useCallback(
    (id: string) => {
      approveSuggestion(id);
      onLog?.(`Suggestion ${id.slice(0, 8)} approved`);
    },
    [approveSuggestion, onLog]
  );

  const handleRejectSuggestion = useCallback(
    (id: string) => {
      rejectSuggestion(id);
      onLog?.(`Suggestion ${id.slice(0, 8)} rejected`);
    },
    [rejectSuggestion, onLog]
  );

  const handleClear = useCallback(() => {
    clear();
    onLog?.('Evolution data cleared');
  }, [clear, onLog]);

  const pendingSuggestions = useMemo(
    () => suggestions.filter((s) => s.status === 'pending'),
    [suggestions]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">AI Evolution Engine</h2>
          <p className="text-muted-foreground text-sm">
            Analyze usage patterns and get AI-powered suggestions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{operationCount} ops tracked</Badge>
          <Button variant="ghost" size="sm" onPress={handleClear}>
            Clear
          </Button>
        </div>
      </div>

      {/* Actions */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="default"
            size="sm"
            onPress={handleSimulateOperations}
          >
            Simulate Operations
          </Button>
          <Button
            variant="outline"
            size="sm"
            onPress={analyzeUsage}
            disabled={operationCount < 5}
          >
            Analyze Usage
          </Button>
          <Button
            variant="outline"
            size="sm"
            onPress={handleGenerateSuggestions}
            disabled={anomalies.length === 0 || loading}
          >
            {loading ? 'Generating...' : 'Generate AI Suggestions'}
          </Button>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          Simulate sandbox operations, analyze patterns, and generate AI
          improvement suggestions.
        </p>
      </Card>

      {loading && <LoaderBlock label="Generating AI suggestions..." />}

      {/* Usage Statistics */}
      {usageStats.length > 0 && (
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">Usage Statistics</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {usageStats.map((stat) => (
              <UsageStatCard key={stat.operation.name} stat={stat} />
            ))}
          </div>
        </Card>
      )}

      {/* Anomalies */}
      {anomalies.length > 0 && (
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Detected Anomalies</h3>
            <Badge
              variant="secondary"
              className="border-amber-500/30 bg-amber-500/20 text-amber-400"
            >
              {anomalies.length} issues
            </Badge>
          </div>
          <div className="space-y-2">
            {anomalies.map((anomaly, index) => (
              <AnomalyCard
                key={`${anomaly.operation.name}-${index}`}
                anomaly={anomaly}
              />
            ))}
          </div>
        </Card>
      )}

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">AI Suggestions</h3>
            <div className="flex items-center gap-2">
              {pendingSuggestions.length > 0 && (
                <Badge
                  variant="secondary"
                  className="border-amber-500/30 bg-amber-500/20 text-amber-400"
                >
                  {pendingSuggestions.length} pending
                </Badge>
              )}
            </div>
          </div>
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onApprove={handleApproveSuggestion}
                onReject={handleRejectSuggestion}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Optimization Hints */}
      {hints.length > 0 && (
        <Card className="p-4">
          <h3 className="mb-3 font-semibold">Optimization Hints</h3>
          <div className="space-y-2">
            {hints.map((hint, index) => (
              <HintCard key={`${hint.operation.name}-${index}`} hint={hint} />
            ))}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {usageStats.length === 0 &&
        anomalies.length === 0 &&
        suggestions.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              Click &quot;Simulate Operations&quot; to generate sample data for
              analysis.
            </p>
          </Card>
        )}
    </div>
  );
}

/**
 * Usage statistics card component
 */
function UsageStatCard({ stat }: { stat: SpecUsageStats }) {
  return (
    <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-sm font-medium">
          {stat.operation.name}
        </span>
        <Badge
          variant={stat.errorRate > 0.1 ? 'destructive' : 'default'}
          className={
            stat.errorRate > 0.1
              ? ''
              : 'border-green-500/30 bg-green-500/20 text-green-400'
          }
        >
          {((1 - stat.errorRate) * 100).toFixed(0)}% success
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Total Calls:</span>{' '}
          <span className="font-medium">{stat.totalCalls}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Avg Latency:</span>{' '}
          <span className="font-medium">
            {stat.averageLatencyMs.toFixed(0)}ms
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">P95:</span>{' '}
          <span className="font-medium">{stat.p95LatencyMs.toFixed(0)}ms</span>
        </div>
        <div>
          <span className="text-muted-foreground">P99:</span>{' '}
          <span className="font-medium">{stat.p99LatencyMs.toFixed(0)}ms</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Anomaly card component
 */
function AnomalyCard({ anomaly }: { anomaly: SpecAnomaly }) {
  const severityColors = {
    low: 'text-amber-400',
    medium: 'text-orange-400',
    high: 'text-red-400',
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
      <div className="flex items-center gap-3">
        <span
          className={`text-lg ${severityColors[anomaly.severity]}`}
          title={`${anomaly.severity} severity`}
        >
          {anomaly.severity === 'high'
            ? '🔴'
            : anomaly.severity === 'medium'
              ? '🟠'
              : '🟡'}
        </span>
        <div>
          <p className="text-sm font-medium">{anomaly.description}</p>
          <p className="text-muted-foreground text-xs">
            {anomaly.operation.name} • {anomaly.metric}
          </p>
        </div>
      </div>
      <Badge
        variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'}
        className={
          anomaly.severity === 'medium'
            ? 'border-amber-500/30 bg-amber-500/20 text-amber-400'
            : ''
        }
      >
        {anomaly.severity}
      </Badge>
    </div>
  );
}

/**
 * Suggestion card component
 */
function SuggestionCard({
  suggestion,
  onApprove,
  onReject,
}: {
  suggestion: SpecSuggestion;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          variant: 'secondary' as const,
          className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        };
      case 'approved':
        return {
          variant: 'default' as const,
          className: 'bg-green-500/20 text-green-400 border-green-500/30',
        };
      case 'rejected':
        return { variant: 'destructive' as const, className: '' };
      default:
        return { variant: 'secondary' as const, className: '' };
    }
  };

  const statusStyle = getStatusStyles(suggestion.status);

  return (
    <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-4">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {suggestion.intent.type === 'latency-regression'
                ? '⚡'
                : suggestion.intent.type === 'error-spike'
                  ? '🔥'
                  : '📉'}
            </span>
            <h4 className="font-medium">{suggestion.proposal.summary}</h4>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {suggestion.proposal.rationale}
          </p>
        </div>
        <Badge variant={statusStyle.variant} className={statusStyle.className}>
          {suggestion.status}
        </Badge>
      </div>

      {suggestion.proposal.recommendedActions &&
        suggestion.proposal.recommendedActions.length > 0 && (
          <div className="mt-3">
            <p className="mb-1 text-xs font-semibold text-violet-400 uppercase">
              Recommended Actions
            </p>
            <ul className="list-inside list-disc space-y-1 text-xs">
              {suggestion.proposal.recommendedActions
                .slice(0, 3)
                .map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
            </ul>
          </div>
        )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">
            Confidence: {(suggestion.confidence * 100).toFixed(0)}%
          </span>
          <span className="text-muted-foreground">•</span>
          <Badge variant="secondary">{suggestion.priority}</Badge>
        </div>
        {suggestion.status === 'pending' && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onPress={() => onReject(suggestion.id)}
            >
              Reject
            </Button>
            <Button
              variant="default"
              size="sm"
              onPress={() => onApprove(suggestion.id)}
            >
              Approve
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Optimization hint card component
 */
function HintCard({ hint }: { hint: OptimizationHint }) {
  const categoryIcons = {
    schema: '📐',
    policy: '🔒',
    performance: '⚡',
    'error-handling': '🛡️',
  };

  return (
    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
      <div className="flex items-start gap-3">
        <span className="text-lg">{categoryIcons[hint.category]}</span>
        <div className="flex-1">
          <p className="font-medium">{hint.summary}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            {hint.justification}
          </p>
          {hint.recommendedActions.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-xs">
              {hint.recommendedActions.slice(0, 2).map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
