import { createHash } from 'node:crypto';
import type { PolicyRef } from '../policy/spec';
import type {
  ExperimentRegistry,
  ExperimentSpec,
  ExperimentVariant,
  TargetingRule,
} from './spec';

export interface ExperimentContext {
  experiment: string;
  version?: string;
  userId?: string | null;
  organizationId?: string | null;
  sessionId?: string | null;
  attributes?: Record<string, unknown>;
  flags?: string[];
}

export interface ExperimentEvaluation {
  variant: ExperimentVariant;
  reason: 'control' | 'random' | 'sticky' | 'targeted';
}

export interface ExperimentEvaluatorConfig {
  registry: ExperimentRegistry;
  policyChecker?: (
    policy: PolicyRef,
    context: ExperimentContext
  ) => Promise<boolean> | boolean;
  expressionEvaluator?: (
    expression: string,
    context: ExperimentContext
  ) => boolean;
}

export class ExperimentEvaluator {
  private readonly registry: ExperimentRegistry;
  private readonly policyChecker?: ExperimentEvaluatorConfig['policyChecker'];
  private readonly expressionEvaluator?: ExperimentEvaluatorConfig['expressionEvaluator'];

  constructor(config: ExperimentEvaluatorConfig) {
    this.registry = config.registry;
    this.policyChecker = config.policyChecker;
    this.expressionEvaluator = config.expressionEvaluator;
  }

  async chooseVariant(
    context: ExperimentContext
  ): Promise<ExperimentEvaluation | null> {
    const experiment = this.registry.get(context.experiment, context.version);
    if (!experiment) return null;

    const control = experiment.variants.find(
      (variant) => variant.id === experiment.controlVariant
    );
    if (!control)
      throw new Error(
        `Experiment ${experiment.meta.key} missing control variant ${experiment.controlVariant}`
      );

    switch (experiment.allocation.type) {
      case 'random':
        return {
          variant: this.pickByWeight(
            experiment,
            this.randomSeed(context, experiment.allocation.salt)
          ),
          reason: 'random',
        };
      case 'sticky':
        return {
          variant: this.pickByWeight(
            experiment,
            this.stickySeed(
              context,
              experiment.allocation.attribute,
              experiment.allocation.salt
            )
          ),
          reason: 'sticky',
        };
      case 'targeted': {
        const targeted = await this.evaluateTargeting(
          experiment,
          context,
          experiment.allocation.rules
        );
        if (targeted) {
          return {
            variant: targeted,
            reason: 'targeted',
          };
        }
        if (experiment.allocation.fallback === 'random') {
          return {
            variant: this.pickByWeight(experiment, this.randomSeed(context)),
            reason: 'random',
          };
        }
        return {
          variant: control,
          reason: 'control',
        };
      }
      default:
        return {
          variant: control,
          reason: 'control',
        };
    }
  }

  private pickByWeight(
    experiment: ExperimentSpec,
    seed: number
  ): ExperimentVariant {
    const variants = experiment.variants;
    const totalWeight = variants.reduce(
      (sum, variant) => sum + (variant.weight ?? 1),
      0
    );
    const target = seed * totalWeight;
    let cumulative = 0;
    for (const variant of variants) {
      cumulative += variant.weight ?? 1;
      if (target <= cumulative) {
        return variant;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return variants[variants.length - 1]!;
  }

  private randomSeed(context: ExperimentContext, salt = ''): number {
    const base =
      context.sessionId ??
      context.userId ??
      context.organizationId ??
      `${Date.now()}-${Math.random()}`;
    return this.hashToUnitInterval(base + salt);
  }

  private stickySeed(
    context: ExperimentContext,
    attribute: 'userId' | 'organizationId' | 'sessionId',
    salt = ''
  ): number {
    const value = context[attribute];
    if (!value) return this.randomSeed(context, salt);
    return this.hashToUnitInterval(`${value}-${salt}`);
  }

  private hashToUnitInterval(value: string): number {
    const hash = createHash('sha256').update(value).digest('hex').slice(0, 15);
    const intValue = parseInt(hash, 16);
    return (intValue % 1_000_000) / 1_000_000;
  }

  private async evaluateTargeting(
    experiment: ExperimentSpec,
    context: ExperimentContext,
    rules: TargetingRule[]
  ): Promise<ExperimentVariant | null> {
    for (const rule of rules) {
      if (!(await this.matchesRule(rule, context))) continue;
      const variant = experiment.variants.find((v) => v.id === rule.variantId);
      if (!variant) continue;
      if (typeof rule.percentage === 'number') {
        const seed = this.randomSeed(context, `rule-${rule.variantId}`);
        if (seed > rule.percentage) {
          continue;
        }
      }
      return variant;
    }
    return null;
  }

  private async matchesRule(
    rule: TargetingRule,
    context: ExperimentContext
  ): Promise<boolean> {
    if (rule.policy && this.policyChecker) {
      const allowed = await this.policyChecker(rule.policy, context);
      if (!allowed) return false;
    }
    if (rule.expression) {
      if (this.expressionEvaluator) {
        return Boolean(this.expressionEvaluator(rule.expression, context));
      }
      try {
        const fn = new Function('context', `return (${rule.expression});`);
        return Boolean(fn(context));
      } catch (_error) {
        return false;
      }
    }
    return true;
  }
}
