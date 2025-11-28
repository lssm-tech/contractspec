/**
 * Feature flag evaluation engine.
 * 
 * Provides deterministic evaluation of feature flags based on targeting rules
 * and experiment assignments.
 */

// ============ Types ============

export interface EvaluationContext {
  /** User identifier */
  userId?: string;
  /** Organization identifier */
  orgId?: string;
  /** User's plan (free, pro, enterprise, etc.) */
  plan?: string;
  /** User segment or cohort */
  segment?: string;
  /** Session identifier for anonymous users */
  sessionId?: string;
  /** Additional custom attributes */
  attributes?: Record<string, unknown>;
}

export interface FeatureFlag {
  id: string;
  key: string;
  status: 'OFF' | 'ON' | 'GRADUAL';
  defaultValue: boolean;
  variants?: VariantConfig[];
}

export interface TargetingRule {
  id: string;
  priority: number;
  enabled: boolean;
  attribute: string;
  operator: RuleOperator;
  value: unknown;
  rolloutPercentage?: number;
  serveValue?: boolean;
  serveVariant?: string;
}

export interface Experiment {
  id: string;
  key: string;
  status: 'DRAFT' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
  variants: ExperimentVariant[];
  audiencePercentage: number;
  audienceFilter?: Record<string, unknown>;
}

export interface VariantConfig {
  key: string;
  name: string;
  description?: string;
  weight?: number;
}

export interface ExperimentVariant {
  key: string;
  name: string;
  percentage: number;
}

export interface EvaluationResult {
  enabled: boolean;
  variant?: string;
  reason: EvaluationReason;
  ruleId?: string;
  experimentId?: string;
}

export type EvaluationReason = 
  | 'FLAG_OFF'
  | 'FLAG_ON'
  | 'DEFAULT_VALUE'
  | 'RULE_MATCH'
  | 'PERCENTAGE_ROLLOUT'
  | 'EXPERIMENT_VARIANT'
  | 'FLAG_NOT_FOUND';

export type RuleOperator = 
  | 'EQ' 
  | 'NEQ' 
  | 'IN' 
  | 'NIN' 
  | 'CONTAINS' 
  | 'NOT_CONTAINS' 
  | 'GT' 
  | 'GTE' 
  | 'LT' 
  | 'LTE' 
  | 'PERCENTAGE';

// ============ Hashing ============

/**
 * Simple hash function for consistent bucketing.
 * Uses a deterministic algorithm so the same input always produces the same bucket.
 */
export function hashToBucket(value: string, seed: string = ''): number {
  const input = `${seed}:${value}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Return a number between 0 and 99
  return Math.abs(hash % 100);
}

/**
 * Get subject identifier from context for consistent hashing.
 */
export function getSubjectId(context: EvaluationContext): string {
  return context.userId || context.sessionId || context.orgId || 'anonymous';
}

// ============ Rule Evaluation ============

/**
 * Evaluate a single targeting rule condition.
 */
export function evaluateRuleCondition(
  rule: TargetingRule,
  context: EvaluationContext
): boolean {
  const attributeValue = getAttributeValue(rule.attribute, context);
  
  switch (rule.operator) {
    case 'EQ':
      return attributeValue === rule.value;
    
    case 'NEQ':
      return attributeValue !== rule.value;
    
    case 'IN':
      if (!Array.isArray(rule.value)) return false;
      return rule.value.includes(attributeValue);
    
    case 'NIN':
      if (!Array.isArray(rule.value)) return true;
      return !rule.value.includes(attributeValue);
    
    case 'CONTAINS':
      if (typeof attributeValue !== 'string' || typeof rule.value !== 'string') return false;
      return attributeValue.includes(rule.value);
    
    case 'NOT_CONTAINS':
      if (typeof attributeValue !== 'string' || typeof rule.value !== 'string') return true;
      return !attributeValue.includes(rule.value);
    
    case 'GT':
      if (typeof attributeValue !== 'number' || typeof rule.value !== 'number') return false;
      return attributeValue > rule.value;
    
    case 'GTE':
      if (typeof attributeValue !== 'number' || typeof rule.value !== 'number') return false;
      return attributeValue >= rule.value;
    
    case 'LT':
      if (typeof attributeValue !== 'number' || typeof rule.value !== 'number') return false;
      return attributeValue < rule.value;
    
    case 'LTE':
      if (typeof attributeValue !== 'number' || typeof rule.value !== 'number') return false;
      return attributeValue <= rule.value;
    
    case 'PERCENTAGE':
      // Percentage-based targeting uses consistent hashing
      const bucket = hashToBucket(getSubjectId(context), rule.attribute);
      const percentage = typeof rule.value === 'number' ? rule.value : 0;
      return bucket < percentage;
    
    default:
      return false;
  }
}

/**
 * Get attribute value from context.
 */
function getAttributeValue(attribute: string, context: EvaluationContext): unknown {
  switch (attribute) {
    case 'userId':
      return context.userId;
    case 'orgId':
      return context.orgId;
    case 'plan':
      return context.plan;
    case 'segment':
      return context.segment;
    case 'sessionId':
      return context.sessionId;
    default:
      return context.attributes?.[attribute];
  }
}

// ============ Flag Evaluator ============

export interface FlagRepository {
  getFlag(key: string, orgId?: string): Promise<FeatureFlag | null>;
  getRules(flagId: string): Promise<TargetingRule[]>;
  getActiveExperiment(flagId: string): Promise<Experiment | null>;
  getExperimentAssignment(experimentId: string, subjectType: string, subjectId: string): Promise<string | null>;
  saveExperimentAssignment(experimentId: string, subjectType: string, subjectId: string, variant: string, bucket: number): Promise<void>;
}

export interface EvaluationLogger {
  log(evaluation: {
    flagId: string;
    flagKey: string;
    subjectType: string;
    subjectId: string;
    result: boolean;
    variant?: string;
    reason: string;
    ruleId?: string;
    experimentId?: string;
    context?: EvaluationContext;
  }): void;
}

export interface FlagEvaluatorOptions {
  repository: FlagRepository;
  logger?: EvaluationLogger;
  /** Whether to log evaluations (default: false for performance) */
  logEvaluations?: boolean;
}

/**
 * Feature flag evaluator.
 * 
 * Evaluates flags based on:
 * 1. Flag status (OFF/ON/GRADUAL)
 * 2. Targeting rules (in priority order)
 * 3. Experiments (if running)
 * 4. Default value (fallback)
 */
export class FlagEvaluator {
  private repository: FlagRepository;
  private logger?: EvaluationLogger;
  private logEvaluations: boolean;

  constructor(options: FlagEvaluatorOptions) {
    this.repository = options.repository;
    this.logger = options.logger;
    this.logEvaluations = options.logEvaluations ?? false;
  }

  /**
   * Evaluate a feature flag.
   */
  async evaluate(key: string, context: EvaluationContext): Promise<EvaluationResult> {
    const orgId = context.orgId;
    const flag = await this.repository.getFlag(key, orgId);

    if (!flag) {
      return this.makeResult(false, 'FLAG_NOT_FOUND');
    }

    // Check flag status
    if (flag.status === 'OFF') {
      return this.logAndReturn(flag, context, this.makeResult(false, 'FLAG_OFF'));
    }

    if (flag.status === 'ON') {
      return this.logAndReturn(flag, context, this.makeResult(true, 'FLAG_ON'));
    }

    // Status is GRADUAL - evaluate rules and experiments
    const rules = await this.repository.getRules(flag.id);
    
    // Sort rules by priority (lower = higher priority)
    const sortedRules = [...rules]
      .filter(r => r.enabled)
      .sort((a, b) => a.priority - b.priority);

    // Evaluate rules in order
    for (const rule of sortedRules) {
      if (evaluateRuleCondition(rule, context)) {
        // Rule matched - check for percentage rollout
        if (rule.rolloutPercentage !== undefined && rule.rolloutPercentage !== null) {
          const bucket = hashToBucket(getSubjectId(context), flag.key);
          if (bucket >= rule.rolloutPercentage) {
            continue; // User not in rollout percentage, try next rule
          }
        }

        const enabled = rule.serveValue ?? true;
        return this.logAndReturn(flag, context, this.makeResult(
          enabled,
          'RULE_MATCH',
          rule.serveVariant,
          rule.id
        ));
      }
    }

    // Check for active experiment
    const experiment = await this.repository.getActiveExperiment(flag.id);
    if (experiment && experiment.status === 'RUNNING') {
      const result = await this.evaluateExperiment(experiment, context);
      if (result) {
        return this.logAndReturn(flag, context, result);
      }
    }

    // Fall back to default value
    return this.logAndReturn(flag, context, this.makeResult(
      flag.defaultValue,
      'DEFAULT_VALUE'
    ));
  }

  /**
   * Evaluate experiment and assign variant.
   */
  private async evaluateExperiment(
    experiment: Experiment,
    context: EvaluationContext
  ): Promise<EvaluationResult | null> {
    const subjectId = getSubjectId(context);
    const subjectType = context.userId ? 'user' : (context.orgId ? 'org' : 'session');

    // Check audience percentage
    const audienceBucket = hashToBucket(subjectId, `${experiment.key}:audience`);
    if (audienceBucket >= experiment.audiencePercentage) {
      return null; // User not in experiment audience
    }

    // Check for existing assignment
    let variant = await this.repository.getExperimentAssignment(
      experiment.id,
      subjectType,
      subjectId
    );

    if (!variant) {
      // Assign to variant based on consistent hashing
      const variantBucket = hashToBucket(subjectId, experiment.key);
      variant = this.assignVariant(experiment.variants, variantBucket);

      // Save assignment
      await this.repository.saveExperimentAssignment(
        experiment.id,
        subjectType,
        subjectId,
        variant,
        variantBucket
      );
    }

    // Control variant typically means feature is off
    const enabled = variant !== 'control';
    
    return this.makeResult(
      enabled,
      'EXPERIMENT_VARIANT',
      variant,
      undefined,
      experiment.id
    );
  }

  /**
   * Assign a variant based on bucket and variant percentages.
   */
  private assignVariant(variants: ExperimentVariant[], bucket: number): string {
    let cumulative = 0;
    for (const variant of variants) {
      cumulative += variant.percentage;
      if (bucket < cumulative) {
        return variant.key;
      }
    }
    // Fallback to last variant (shouldn't happen if percentages sum to 100)
    return variants[variants.length - 1]?.key ?? 'control';
  }

  /**
   * Create evaluation result.
   */
  private makeResult(
    enabled: boolean,
    reason: EvaluationReason,
    variant?: string,
    ruleId?: string,
    experimentId?: string
  ): EvaluationResult {
    return {
      enabled,
      variant,
      reason,
      ruleId,
      experimentId,
    };
  }

  /**
   * Log evaluation and return result.
   */
  private logAndReturn(
    flag: FeatureFlag,
    context: EvaluationContext,
    result: EvaluationResult
  ): EvaluationResult {
    if (this.logEvaluations && this.logger) {
      const subjectId = getSubjectId(context);
      const subjectType = context.userId ? 'user' : (context.orgId ? 'org' : 'session');
      
      this.logger.log({
        flagId: flag.id,
        flagKey: flag.key,
        subjectType,
        subjectId,
        result: result.enabled,
        variant: result.variant,
        reason: result.reason,
        ruleId: result.ruleId,
        experimentId: result.experimentId,
        context,
      });
    }
    return result;
  }
}

// ============ In-Memory Repository ============

/**
 * In-memory flag repository for testing and development.
 */
export class InMemoryFlagRepository implements FlagRepository {
  private flags: Map<string, FeatureFlag> = new Map();
  private rules: Map<string, TargetingRule[]> = new Map();
  private experiments: Map<string, Experiment> = new Map();
  private assignments: Map<string, string> = new Map();

  addFlag(flag: FeatureFlag): void {
    this.flags.set(flag.key, flag);
  }

  addRule(flagId: string, rule: TargetingRule): void {
    const existing = this.rules.get(flagId) || [];
    existing.push(rule);
    this.rules.set(flagId, existing);
  }

  addExperiment(experiment: Experiment, flagId: string): void {
    this.experiments.set(flagId, experiment);
  }

  async getFlag(key: string): Promise<FeatureFlag | null> {
    return this.flags.get(key) || null;
  }

  async getRules(flagId: string): Promise<TargetingRule[]> {
    return this.rules.get(flagId) || [];
  }

  async getActiveExperiment(flagId: string): Promise<Experiment | null> {
    return this.experiments.get(flagId) || null;
  }

  async getExperimentAssignment(
    experimentId: string,
    subjectType: string,
    subjectId: string
  ): Promise<string | null> {
    const key = `${experimentId}:${subjectType}:${subjectId}`;
    return this.assignments.get(key) || null;
  }

  async saveExperimentAssignment(
    experimentId: string,
    subjectType: string,
    subjectId: string,
    variant: string
  ): Promise<void> {
    const key = `${experimentId}:${subjectType}:${subjectId}`;
    this.assignments.set(key, variant);
  }

  clear(): void {
    this.flags.clear();
    this.rules.clear();
    this.experiments.clear();
    this.assignments.clear();
  }
}

