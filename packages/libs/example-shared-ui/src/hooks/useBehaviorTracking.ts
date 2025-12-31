'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TemplateId } from '../lib/types';

/**
 * Behavior event types
 */
export type BehaviorEventType =
  | 'template_view'
  | 'mode_change'
  | 'spec_edit'
  | 'canvas_interaction'
  | 'presentation_view'
  | 'feature_usage'
  | 'error'
  | 'navigation';

/**
 * Behavior event data
 */
export interface BehaviorEvent {
  type: BehaviorEventType;
  timestamp: Date;
  templateId: TemplateId;
  metadata?: Record<string, unknown>;
}

/**
 * Behavior summary for a session
 */
export interface BehaviorSummary {
  totalEvents: number;
  sessionDuration: number;
  mostUsedTemplates: { templateId: TemplateId; count: number }[];
  mostUsedModes: { mode: string; count: number }[];
  featuresUsed: string[];
  unusedFeatures: string[];
  errorCount: number;
  recommendations: string[];
}

/**
 * Hook return type
 */
export interface UseBehaviorTrackingReturn {
  /** Track a behavior event */
  trackEvent: (
    type: BehaviorEventType,
    metadata?: Record<string, unknown>
  ) => void;
  /** Get behavior summary */
  getSummary: () => BehaviorSummary;
  /** Get events for a specific type */
  getEventsByType: (type: BehaviorEventType) => BehaviorEvent[];
  /** Total event count */
  eventCount: number;
  /** Session start time */
  sessionStart: Date;
  /** Clear all tracked data */
  clear: () => void;
}

/**
 * Storage key for behavior data
 */
const BEHAVIOR_STORAGE_KEY = 'contractspec-behavior-data';

/**
 * All available features in the sandbox
 */
const ALL_FEATURES = [
  'playground',
  'specs',
  'builder',
  'markdown',
  'evolution',
  'canvas_add',
  'canvas_delete',
  'spec_save',
  'spec_validate',
  'ai_suggestions',
];

/**
 * Hook for tracking user behavior in the sandbox.
 * Provides insights into usage patterns and feature adoption.
 */
export function useBehaviorTracking(
  templateId: TemplateId
): UseBehaviorTrackingReturn {
  const [events, setEvents] = useState<BehaviorEvent[]>([]);
  const sessionStartRef = useRef<Date>(new Date());
  const [eventCount, setEventCount] = useState(0);

  // Load persisted events on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BEHAVIOR_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as {
          events: (Omit<BehaviorEvent, 'timestamp'> & { timestamp: string })[];
          sessionStart: string;
        };
        setEvents(
          data.events.map((e) => ({
            ...e,
            timestamp: new Date(e.timestamp),
          }))
        );
        sessionStartRef.current = new Date(data.sessionStart);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Persist events when they change
  useEffect(() => {
    if (events.length > 0) {
      try {
        localStorage.setItem(
          BEHAVIOR_STORAGE_KEY,
          JSON.stringify({
            events: events.map((e) => ({
              ...e,
              timestamp: e.timestamp.toISOString(),
            })),
            sessionStart: sessionStartRef.current.toISOString(),
          })
        );
      } catch {
        // Ignore storage errors
      }
    }
  }, [events]);

  /**
   * Track a behavior event
   */
  const trackEvent = useCallback(
    (type: BehaviorEventType, metadata?: Record<string, unknown>) => {
      const event: BehaviorEvent = {
        type,
        timestamp: new Date(),
        templateId,
        metadata,
      };
      setEvents((prev) => [...prev, event]);
      setEventCount((prev) => prev + 1);
    },
    [templateId]
  );

  /**
   * Get events by type
   */
  const getEventsByType = useCallback(
    (type: BehaviorEventType): BehaviorEvent[] => {
      return events.filter((e) => e.type === type);
    },
    [events]
  );

  /**
   * Get behavior summary
   */
  const getSummary = useCallback((): BehaviorSummary => {
    const now = new Date();
    const sessionDuration = now.getTime() - sessionStartRef.current.getTime();

    // Count templates
    const templateCounts = new Map<TemplateId, number>();
    for (const event of events) {
      const count = templateCounts.get(event.templateId) ?? 0;
      templateCounts.set(event.templateId, count + 1);
    }
    const mostUsedTemplates = Array.from(templateCounts.entries())
      .map(([templateId, count]) => ({ templateId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Count modes from mode_change events
    const modeCounts = new Map<string, number>();
    for (const event of events) {
      if (event.type === 'mode_change' && event.metadata?.mode) {
        const mode = event.metadata.mode as string;
        const count = modeCounts.get(mode) ?? 0;
        modeCounts.set(mode, count + 1);
      }
    }
    const mostUsedModes = Array.from(modeCounts.entries())
      .map(([mode, count]) => ({ mode, count }))
      .sort((a, b) => b.count - a.count);

    // Track features used
    const featuresUsed = new Set<string>();
    for (const event of events) {
      if (event.type === 'mode_change' && event.metadata?.mode) {
        featuresUsed.add(event.metadata.mode as string);
      }
      if (event.type === 'feature_usage' && event.metadata?.feature) {
        featuresUsed.add(event.metadata.feature as string);
      }
      if (event.type === 'canvas_interaction') {
        const action = event.metadata?.action as string;
        if (action === 'add') featuresUsed.add('canvas_add');
        if (action === 'delete') featuresUsed.add('canvas_delete');
      }
      if (event.type === 'spec_edit') {
        const action = event.metadata?.action as string;
        if (action === 'save') featuresUsed.add('spec_save');
        if (action === 'validate') featuresUsed.add('spec_validate');
      }
    }

    // Find unused features
    const unusedFeatures = ALL_FEATURES.filter((f) => !featuresUsed.has(f));

    // Count errors
    const errorCount = events.filter((e) => e.type === 'error').length;

    // Generate recommendations
    const recommendations = generateRecommendations(
      Array.from(featuresUsed),
      unusedFeatures,
      mostUsedModes,
      events.length
    );

    return {
      totalEvents: events.length,
      sessionDuration,
      mostUsedTemplates,
      mostUsedModes,
      featuresUsed: Array.from(featuresUsed),
      unusedFeatures,
      errorCount,
      recommendations,
    };
  }, [events]);

  /**
   * Clear all tracking data
   */
  const clear = useCallback(() => {
    setEvents([]);
    setEventCount(0);
    sessionStartRef.current = new Date();
    localStorage.removeItem(BEHAVIOR_STORAGE_KEY);
  }, []);

  return useMemo(
    () => ({
      trackEvent,
      getSummary,
      getEventsByType,
      eventCount,
      sessionStart: sessionStartRef.current,
      clear,
    }),
    [trackEvent, getSummary, getEventsByType, eventCount, clear]
  );
}

/**
 * Generate recommendations based on behavior
 */
function generateRecommendations(
  featuresUsed: string[],
  unusedFeatures: string[],
  mostUsedModes: { mode: string; count: number }[],
  totalEvents: number
): string[] {
  const recommendations: string[] = [];

  // Recommend unused features
  if (unusedFeatures.includes('evolution')) {
    recommendations.push(
      'Try the AI Evolution mode to get automated improvement suggestions'
    );
  }

  if (unusedFeatures.includes('markdown')) {
    recommendations.push(
      'Use Markdown preview to see documentation for your specs'
    );
  }

  if (unusedFeatures.includes('builder')) {
    recommendations.push(
      'Explore the Visual Builder to design your UI components'
    );
  }

  if (
    !featuresUsed.includes('spec_validate') &&
    featuresUsed.includes('specs')
  ) {
    recommendations.push("Don't forget to validate your specs before saving");
  }

  if (
    featuresUsed.includes('evolution') &&
    !featuresUsed.includes('ai_suggestions')
  ) {
    recommendations.push(
      'Generate AI suggestions to get actionable improvement recommendations'
    );
  }

  // Time-based recommendations
  if (totalEvents > 50) {
    recommendations.push(
      'Great engagement! Consider saving your work regularly'
    );
  }

  // Mode variety recommendations
  if (mostUsedModes.length === 1) {
    recommendations.push(
      'Try different modes to explore all sandbox capabilities'
    );
  }

  return recommendations;
}
