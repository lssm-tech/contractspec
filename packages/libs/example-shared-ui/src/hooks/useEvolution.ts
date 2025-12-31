'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TemplateId } from '../lib/types';

/**
 * Types from @contractspec/lib.evolution (replicated to avoid SSR issues)
 */
export type AnomalySeverity = 'low' | 'medium' | 'high';
export type SuggestionStatus = 'pending' | 'approved' | 'rejected';

export interface OperationCoordinate {
  name: string;
  version: string;
  tenantId?: string;
}

export interface OperationMetricSample {
  operation: OperationCoordinate;
  durationMs: number;
  success: boolean;
  timestamp: Date;
  payloadSizeBytes?: number;
  errorCode?: string;
  errorMessage?: string;
}

export interface SpecUsageStats {
  operation: OperationCoordinate;
  totalCalls: number;
  successRate: number;
  errorRate: number;
  averageLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  maxLatencyMs: number;
  lastSeenAt: Date;
  windowStart: Date;
  windowEnd: Date;
  topErrors: Record<string, number>;
}

export interface SpecAnomaly {
  operation: OperationCoordinate;
  severity: AnomalySeverity;
  metric: 'latency' | 'error-rate' | 'throughput' | 'policy' | 'schema';
  description: string;
  detectedAt: Date;
  threshold?: number;
  observedValue?: number;
}

export interface IntentPattern {
  id: string;
  type:
    | 'latency-regression'
    | 'error-spike'
    | 'missing-operation'
    | 'chained-intent'
    | 'throughput-drop'
    | 'schema-mismatch';
  description: string;
  operation?: OperationCoordinate;
  confidence: { score: number; sampleSize: number };
}

export interface SpecSuggestion {
  id: string;
  intent: IntentPattern;
  target?: OperationCoordinate;
  proposal: {
    summary: string;
    rationale: string;
    changeType: 'new-spec' | 'revision' | 'policy-update' | 'schema-update';
    recommendedActions?: string[];
  };
  confidence: number;
  createdAt: Date;
  createdBy: string;
  status: SuggestionStatus;
  priority: 'low' | 'medium' | 'high';
}

export interface OptimizationHint {
  operation: OperationCoordinate;
  category: 'schema' | 'policy' | 'performance' | 'error-handling';
  summary: string;
  justification: string;
  recommendedActions: string[];
}

/**
 * Hook return type
 */
export interface UseEvolutionReturn {
  /** Usage statistics from analyzed metrics */
  usageStats: SpecUsageStats[];
  /** Detected anomalies */
  anomalies: SpecAnomaly[];
  /** AI-generated suggestions */
  suggestions: SpecSuggestion[];
  /** Optimization hints */
  hints: OptimizationHint[];
  /** Whether data is loading */
  loading: boolean;
  /** Track a new operation metric */
  trackOperation: (
    operationName: string,
    durationMs: number,
    success: boolean,
    errorCode?: string
  ) => void;
  /** Analyze tracked operations */
  analyzeUsage: () => void;
  /** Generate suggestions from anomalies */
  generateSuggestions: () => Promise<void>;
  /** Approve a suggestion */
  approveSuggestion: (id: string, notes?: string) => void;
  /** Reject a suggestion */
  rejectSuggestion: (id: string, notes?: string) => void;
  /** Clear all data */
  clear: () => void;
  /** Total tracked operations count */
  operationCount: number;
}

/**
 * Storage key for evolution data persistence
 */
const EVOLUTION_STORAGE_KEY = 'contractspec-evolution-data';

/**
 * Hook for AI-powered spec evolution analysis and suggestions.
 * Tracks sandbox operations, detects anomalies, and generates improvement suggestions.
 */
export function useEvolution(templateId: TemplateId): UseEvolutionReturn {
  const [usageStats, setUsageStats] = useState<SpecUsageStats[]>([]);
  const [anomalies, setAnomalies] = useState<SpecAnomaly[]>([]);
  const [suggestions, setSuggestions] = useState<SpecSuggestion[]>([]);
  const [hints, setHints] = useState<OptimizationHint[]>([]);
  const [loading, setLoading] = useState(false);

  // Use ref to avoid re-renders on every track
  const metricsRef = useRef<OperationMetricSample[]>([]);
  const [operationCount, setOperationCount] = useState(0);

  // Load persisted data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        `${EVOLUTION_STORAGE_KEY}-${templateId}`
      );
      if (stored) {
        const data = JSON.parse(stored) as {
          suggestions: (Omit<SpecSuggestion, 'createdAt'> & {
            createdAt: string;
          })[];
        };
        setSuggestions(
          data.suggestions.map((s) => ({
            ...s,
            createdAt: new Date(s.createdAt),
          }))
        );
      }
    } catch {
      // Ignore storage errors
    }
  }, [templateId]);

  // Persist suggestions when they change
  useEffect(() => {
    try {
      localStorage.setItem(
        `${EVOLUTION_STORAGE_KEY}-${templateId}`,
        JSON.stringify({ suggestions })
      );
    } catch {
      // Ignore storage errors
    }
  }, [suggestions, templateId]);

  /**
   * Track a new operation metric
   */
  const trackOperation = useCallback(
    (
      operationName: string,
      durationMs: number,
      success: boolean,
      errorCode?: string
    ) => {
      const sample: OperationMetricSample = {
        operation: {
          name: operationName,
          version: '1.0.0',
          tenantId: 'sandbox',
        },
        durationMs,
        success,
        timestamp: new Date(),
        errorCode,
      };
      metricsRef.current.push(sample);
      setOperationCount((prev) => prev + 1);
    },
    []
  );

  /**
   * Analyze tracked operations to generate usage stats and anomalies
   */
  const analyzeUsage = useCallback(() => {
    const samples = metricsRef.current;
    if (samples.length < 5) return;

    // Group samples by operation
    const groups = new Map<string, OperationMetricSample[]>();
    for (const sample of samples) {
      const key = `${sample.operation.name}.v${sample.operation.version}`;
      const arr = groups.get(key) ?? [];
      arr.push(sample);
      groups.set(key, arr);
    }

    // Calculate stats for each operation
    const stats: SpecUsageStats[] = [];
    const detectedAnomalies: SpecAnomaly[] = [];

    groups.forEach((opSamples) => {
      if (opSamples.length < 3) return;

      const durations = opSamples
        .map((s) => s.durationMs)
        .sort((a, b) => a - b);
      const errors = opSamples.filter((s) => !s.success);
      const totalCalls = opSamples.length;
      const errorRate = errors.length / totalCalls;
      const averageLatencyMs =
        durations.reduce((sum, value) => sum + value, 0) / totalCalls;

      const timestamps = opSamples.map((s) => s.timestamp.getTime());
      const firstSample = opSamples[0];
      if (!firstSample) return;

      const stat: SpecUsageStats = {
        operation: firstSample.operation,
        totalCalls,
        successRate: 1 - errorRate,
        errorRate,
        averageLatencyMs,
        p95LatencyMs: percentile(durations, 0.95),
        p99LatencyMs: percentile(durations, 0.99),
        maxLatencyMs: Math.max(...durations),
        lastSeenAt: new Date(Math.max(...timestamps)),
        windowStart: new Date(Math.min(...timestamps)),
        windowEnd: new Date(Math.max(...timestamps)),
        topErrors: errors.reduce<Record<string, number>>((acc, s) => {
          if (s.errorCode) {
            acc[s.errorCode] = (acc[s.errorCode] ?? 0) + 1;
          }
          return acc;
        }, {}),
      };
      stats.push(stat);

      // Detect anomalies
      if (errorRate > 0.1) {
        detectedAnomalies.push({
          operation: stat.operation,
          severity:
            errorRate > 0.3 ? 'high' : errorRate > 0.2 ? 'medium' : 'low',
          metric: 'error-rate',
          description: `Error rate ${(errorRate * 100).toFixed(1)}% exceeds threshold`,
          detectedAt: new Date(),
          threshold: 0.1,
          observedValue: errorRate,
        });
      }

      if (stat.p99LatencyMs > 500) {
        detectedAnomalies.push({
          operation: stat.operation,
          severity:
            stat.p99LatencyMs > 1000
              ? 'high'
              : stat.p99LatencyMs > 750
                ? 'medium'
                : 'low',
          metric: 'latency',
          description: `P99 latency ${stat.p99LatencyMs.toFixed(0)}ms exceeds threshold`,
          detectedAt: new Date(),
          threshold: 500,
          observedValue: stat.p99LatencyMs,
        });
      }
    });

    setUsageStats(stats);
    setAnomalies(detectedAnomalies);

    // Generate hints
    const newHints: OptimizationHint[] = detectedAnomalies.map((anomaly) => ({
      operation: anomaly.operation,
      category: anomaly.metric === 'latency' ? 'performance' : 'error-handling',
      summary:
        anomaly.metric === 'latency'
          ? 'Latency regression detected'
          : 'Error spike detected',
      justification: anomaly.description,
      recommendedActions:
        anomaly.metric === 'latency'
          ? [
              'Add caching layer',
              'Optimize database queries',
              'Consider pagination',
            ]
          : [
              'Add retry logic',
              'Improve error handling',
              'Add circuit breaker',
            ],
    }));
    setHints(newHints);
  }, []);

  /**
   * Generate AI suggestions from anomalies (mock for sandbox)
   */
  const generateSuggestions = useCallback(async () => {
    if (anomalies.length === 0) return;

    setLoading(true);
    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newSuggestions: SpecSuggestion[] = anomalies.map((anomaly) => ({
      id: `suggestion-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      intent: {
        id: `intent-${anomaly.operation.name}`,
        type:
          anomaly.metric === 'latency'
            ? 'latency-regression'
            : anomaly.metric === 'error-rate'
              ? 'error-spike'
              : 'throughput-drop',
        description: anomaly.description,
        operation: anomaly.operation,
        confidence: {
          score:
            anomaly.severity === 'high'
              ? 0.9
              : anomaly.severity === 'medium'
                ? 0.7
                : 0.5,
          sampleSize:
            usageStats.find((s) => s.operation.name === anomaly.operation.name)
              ?.totalCalls ?? 0,
        },
      },
      target: anomaly.operation,
      proposal: {
        summary: generateSuggestionSummary(anomaly),
        rationale: generateSuggestionRationale(anomaly),
        changeType:
          anomaly.metric === 'error-rate' ? 'policy-update' : 'revision',
        recommendedActions: generateRecommendedActions(anomaly),
      },
      confidence:
        anomaly.severity === 'high'
          ? 0.85
          : anomaly.severity === 'medium'
            ? 0.7
            : 0.55,
      createdAt: new Date(),
      createdBy: 'ai-evolution-agent',
      status: 'pending',
      priority: anomaly.severity,
    }));

    setSuggestions((prev) => [...prev, ...newSuggestions]);
    setLoading(false);
  }, [anomalies, usageStats]);

  /**
   * Approve a suggestion
   */
  const approveSuggestion = useCallback((id: string, _notes?: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved' as const } : s))
    );
  }, []);

  /**
   * Reject a suggestion
   */
  const rejectSuggestion = useCallback((id: string, _notes?: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected' as const } : s))
    );
  }, []);

  /**
   * Clear all evolution data
   */
  const clear = useCallback(() => {
    metricsRef.current = [];
    setOperationCount(0);
    setUsageStats([]);
    setAnomalies([]);
    setSuggestions([]);
    setHints([]);
    localStorage.removeItem(`${EVOLUTION_STORAGE_KEY}-${templateId}`);
  }, [templateId]);

  return useMemo(
    () => ({
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
    }),
    [
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
    ]
  );
}

/**
 * Utility functions for generating mock AI content
 */
function percentile(values: number[], p: number): number {
  if (!values.length) return 0;
  if (values.length === 1) return values[0] ?? 0;
  const idx = Math.min(values.length - 1, Math.floor(p * values.length));
  return values[idx] ?? 0;
}

function generateSuggestionSummary(anomaly: SpecAnomaly): string {
  if (anomaly.metric === 'latency') {
    return `Add caching and pagination to ${anomaly.operation.name} to reduce latency`;
  }
  if (anomaly.metric === 'error-rate') {
    return `Add retry policy and circuit breaker to ${anomaly.operation.name}`;
  }
  return `Optimize ${anomaly.operation.name} for improved throughput`;
}

function generateSuggestionRationale(anomaly: SpecAnomaly): string {
  if (anomaly.metric === 'latency') {
    return `The operation ${anomaly.operation.name} is experiencing P99 latency of ${anomaly.observedValue?.toFixed(0)}ms, which is above the recommended threshold of ${anomaly.threshold}ms. This can impact user experience and downstream operations.`;
  }
  if (anomaly.metric === 'error-rate') {
    return `The error rate for ${anomaly.operation.name} is ${((anomaly.observedValue ?? 0) * 100).toFixed(1)}%, indicating potential issues with input validation, external dependencies, or resource limits.`;
  }
  return `Throughput for ${anomaly.operation.name} has dropped significantly, suggesting potential bottlenecks or reduced demand that should be investigated.`;
}

function generateRecommendedActions(anomaly: SpecAnomaly): string[] {
  if (anomaly.metric === 'latency') {
    return [
      'Add response caching for frequently accessed data',
      'Implement pagination for large result sets',
      'Optimize database queries with proper indexing',
      'Consider adding a GraphQL DataLoader for batching',
    ];
  }
  if (anomaly.metric === 'error-rate') {
    return [
      'Add input validation at the contract level',
      'Implement retry policy with exponential backoff',
      'Add circuit breaker for external dependencies',
      'Enhance error logging for better debugging',
    ];
  }
  return [
    'Review resource allocation and scaling policies',
    'Check for upstream routing or load balancer issues',
    'Validate feature flag configurations',
    'Monitor dependency health metrics',
  ];
}
