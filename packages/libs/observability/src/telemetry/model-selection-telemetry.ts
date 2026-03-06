import type { AnalyticsProvider } from '@contractspec/lib.contracts-integrations';

export interface ModelSelectionEventProperties {
  modelId: string;
  providerKey: string;
  score: number;
  dimension?: string;
  reason: string;
  alternativesCount: number;
  costEstimateInput?: number;
  costEstimateOutput?: number;
  selectionDurationMs?: number;
}

/**
 * Track model selection decisions via PostHog analytics.
 *
 * Captures a `$model_selection` event with the selection result properties,
 * enabling analytics dashboards for model usage patterns and cost tracking.
 */
export class ModelSelectionTelemetry {
  private readonly provider: AnalyticsProvider;
  private readonly eventName: string;

  constructor(
    provider: AnalyticsProvider,
    options?: { eventName?: string },
  ) {
    this.provider = provider;
    this.eventName = options?.eventName ?? '$model_selection';
  }

  async trackSelection(
    distinctId: string,
    properties: ModelSelectionEventProperties,
  ): Promise<void> {
    await this.provider.capture({
      distinctId,
      event: this.eventName,
      timestamp: new Date(),
      properties: {
        $model_id: properties.modelId,
        $model_provider: properties.providerKey,
        $model_score: properties.score,
        $model_dimension: properties.dimension ?? null,
        $model_reason: properties.reason,
        $model_alternatives_count: properties.alternativesCount,
        $model_cost_estimate_input: properties.costEstimateInput ?? null,
        $model_cost_estimate_output: properties.costEstimateOutput ?? null,
        $model_selection_duration_ms: properties.selectionDurationMs ?? null,
      },
    });
  }
}
