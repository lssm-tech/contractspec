import type { LanguageModel } from 'ai';
import type { ModelCapabilities, ProviderName } from './types';
import type {
  BenchmarkDimension,
  DimensionWeightConfig,
} from '@contractspec/lib.provider-ranking';

export interface ModelConstraints {
  maxCostPerMillionInput?: number;
  maxCostPerMillionOutput?: number;
  minContextWindow?: number;
  requiredCapabilities?: (keyof ModelCapabilities)[];
  allowedProviders?: ProviderName[];
  excludeModels?: string[];
}

export interface ModelSelectionContext {
  /** Simple path: pick the top model for this dimension. */
  taskDimension?: BenchmarkDimension;
  /** Advanced path: weighted priorities across dimensions. */
  priorities?: DimensionWeightConfig[];
  /** Hard constraints that filter out ineligible models. */
  constraints?: ModelConstraints;
  /** Opaque metadata forwarded to telemetry/observability. */
  metadata?: Record<string, unknown>;
  /** Required transport mode. */
  requiredTransport?: 'rest' | 'mcp' | 'sdk';
  /** Required auth method. */
  requiredAuthMethod?: 'api-key' | 'oauth2' | 'bearer';
}

export interface ModelSelectionResult {
  modelId: string;
  providerKey: string;
  score: number;
  reason: string;
  alternatives: { modelId: string; providerKey: string; score: number }[];
}

export interface ModelSelector {
  /**
   * Select the best model for the given context.
   * Returns selection metadata without creating a LanguageModel instance.
   */
  select(context: ModelSelectionContext): Promise<ModelSelectionResult>;

  /**
   * Select the best model and create a ready-to-use LanguageModel.
   */
  selectAndCreate(context: ModelSelectionContext): Promise<{
    model: LanguageModel;
    selection: ModelSelectionResult;
  }>;
}
