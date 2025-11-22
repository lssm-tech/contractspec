import type {
  OverlayModification,
  OverlaySpec,
} from '@contractspec/lib.overlay-engine';
import type { BehaviorInsights } from './types';

export interface OverlaySuggestionOptions {
  overlayId: string;
  tenantId: string;
  capability: string;
  userId?: string;
  role?: string;
  version?: string;
}

export interface WorkflowAdaptation {
  workflow: string;
  step: string;
  note: string;
}

export function insightsToOverlaySuggestion(
  insights: BehaviorInsights,
  options: OverlaySuggestionOptions
): OverlaySpec | null {
  const modifications: OverlayModification[] = [];

  insights.suggestedHiddenFields.forEach((field) => {
    modifications.push({
      type: 'hideField',
      field,
      reason: 'Automatically hidden because usage is near zero',
    });
  });

  if (insights.frequentlyUsedFields.length) {
    modifications.push({
      type: 'reorderFields',
      fields: insights.frequentlyUsedFields,
    });
  }

  if (!modifications.length) {
    return null;
  }

  return {
    overlayId: options.overlayId,
    version: options.version ?? '1.0.0',
    appliesTo: {
      tenantId: options.tenantId,
      capability: options.capability,
      userId: options.userId,
      role: options.role,
    },
    modifications,
    metadata: {
      generatedAt: new Date().toISOString(),
      automated: true,
    },
  };
}

export function insightsToWorkflowAdaptations(
  insights: BehaviorInsights
): WorkflowAdaptation[] {
  return insights.workflowBottlenecks.map((bottleneck) => ({
    workflow: bottleneck.workflow,
    step: bottleneck.step,
    note: `High drop rate (${Math.round(bottleneck.dropRate * 100)}%) detected`,
  }));
}
