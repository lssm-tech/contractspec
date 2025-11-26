import type { HandlerCtx, SpecVariantResolver } from '@lssm/lib.contracts';
import type { SpecExperimentRegistry } from './registry';
import type {
  SpecAssignment,
  SpecExperimentConfig,
  SpecExperimentMetricSample,
} from './types';
import { SpecExperimentRunner } from './runner';
import { ExperimentTracker } from '../tracker/tracker';

export interface SpecExperimentAdapterOptions {
  registry: SpecExperimentRegistry;
  runner?: SpecExperimentRunner;
  tracker?: ExperimentTracker;
}

export class SpecExperimentAdapter {
  private readonly registry: SpecExperimentRegistry;
  private readonly runner: SpecExperimentRunner;
  private readonly tracker?: ExperimentTracker;

  constructor(options: SpecExperimentAdapterOptions) {
    this.registry = options.registry;
    this.runner = options.runner ?? new SpecExperimentRunner();
    this.tracker = options.tracker;
  }

  getBucketedSpec(
    target: SpecExperimentConfig['target'],
    userId: string,
    context?: Record<string, string>
  ): SpecAssignment | undefined {
    const config = this.registry.get(target);
    if (!config) return undefined;
    const assignment = this.runner.assign(config, userId, context);
    void this.tracker?.recordAssignment(assignment.assignment);
    return assignment;
  }

  async trackOutcome(sample: SpecExperimentMetricSample) {
    if (!this.tracker) return;
    await this.tracker.recordSample({
      experimentKey: sample.experimentKey,
      variantId: sample.variantId,
      metric: 'latency_ms',
      value: sample.latencyMs,
      timestamp: sample.timestamp,
    });
    await this.tracker.recordSample({
      experimentKey: sample.experimentKey,
      variantId: sample.variantId,
      metric: 'error_rate',
      value: sample.success ? 0 : 1,
      timestamp: sample.timestamp,
    });
  }
}

export interface SpecVariantResolverOptions {
  adapter: SpecExperimentAdapter;
  resolveUserId?: (ctx: HandlerCtx) => string | undefined;
  resolveContext?: (ctx: HandlerCtx) => Record<string, string | undefined>;
}

export function createSpecVariantResolver(
  options: SpecVariantResolverOptions
): SpecVariantResolver {
  return {
    async resolve(target, ctx) {
      const userId =
        options.resolveUserId?.(ctx) ??
        ctx.userId ??
        ctx.organizationId ??
        ctx.actor ??
        undefined;
      if (!userId) return undefined;
      const rawContext = options.resolveContext?.(ctx);
      const context = rawContext
        ? (Object.fromEntries(
            Object.entries(rawContext).filter(
              (entry): entry is [string, string] =>
                entry[1] !== undefined && entry[1] !== null
            )
          ) as Record<string, string>)
        : undefined;
      const assignment = options.adapter.getBucketedSpec(
        target,
        userId,
        context
      );
      return assignment?.spec;
    },
  };
}










