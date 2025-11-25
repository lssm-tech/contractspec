import type {
  AnyOperationSpec,
  OperationSpec,
  ResourceRefDescriptor,
} from '@contractspec/lib.contracts-spec';
import type { AnySchemaModel } from '@contractspec/lib.schema';
import { Logger } from '@contractspec/lib.observability';
import { randomUUID } from 'node:crypto';
import {
  type EvolutionConfig,
  type IntentPattern,
  type OperationCoordinate,
  type SpecSuggestion,
  type SpecSuggestionProposal,
  type SuggestionStatus,
} from '../types';

export interface SpecGeneratorOptions {
  config?: EvolutionConfig;
  logger?: Logger;
  clock?: () => Date;
  getSpec?: (key: string, version?: string) => AnyOperationSpec | undefined;
}

export interface GenerateSpecOptions {
  summary?: string;
  rationale?: string;
  changeType?: SpecSuggestionProposal['changeType'];
  kind?: SpecSuggestionProposal['kind'];
  spec?: AnyOperationSpec;
  diff?: string;
  metadata?: Record<string, unknown>;
  status?: SuggestionStatus;
  tags?: string[];
  createdBy?: string;
}

export type SpecPatch = Partial<
  OperationSpec<AnySchemaModel, AnySchemaModel | ResourceRefDescriptor<boolean>>
> & { meta?: Partial<AnyOperationSpec['meta']> };

export class SpecGenerator {
  private readonly config: EvolutionConfig;
  private readonly logger?: Logger;
  private readonly clock: () => Date;
  private readonly getSpec?: SpecGeneratorOptions['getSpec'];

  constructor(options: SpecGeneratorOptions = {}) {
    this.config = options.config ?? {};
    this.logger = options.logger;
    this.clock = options.clock ?? (() => new Date());
    this.getSpec = options.getSpec;
  }

  generateFromIntent(
    intent: IntentPattern,
    options: GenerateSpecOptions = {}
  ): SpecSuggestion {
    const now = this.clock();
    const summary =
      options.summary ??
      `${this.intentToVerb(intent.type)} ${intent.operation?.key ?? 'operation'}`;
    const rationale =
      options.rationale ??
      [
        intent.description,
        intent.metadata?.observedValue
          ? `Observed ${intent.metadata.observedValue}`
          : undefined,
      ]
        .filter(Boolean)
        .join(' — ');

    const suggestion: SpecSuggestion = {
      id: randomUUID(),
      intent,
      target: intent.operation,
      proposal: {
        summary,
        rationale,
        changeType: options.changeType ?? this.inferChangeType(intent),
        kind: options.kind,
        spec: options.spec,
        diff: options.diff,
        metadata: options.metadata,
      },
      confidence: intent.confidence.score,
      priority: this.intentToPriority(intent),
      createdAt: now,
      createdBy: options.createdBy ?? 'auto-evolution',
      status: options.status ?? 'pending',
      evidence: intent.evidence,
      tags: options.tags,
    };
    return suggestion;
  }

  generateVariant(
    operation: OperationCoordinate,
    patch: SpecPatch,
    intent: IntentPattern,
    options: Omit<GenerateSpecOptions, 'spec'> = {}
  ) {
    if (!this.getSpec) {
      throw new Error('SpecGenerator requires getSpec() to generate variants');
    }
    const base = this.getSpec(operation.key, operation.version);
    if (!base) {
      throw new Error(
        `Cannot generate variant; spec ${operation.key}.v${operation.version} not found`
      );
    }
    const merged = mergeContract(base, patch);
    return this.generateFromIntent(intent, { ...options, spec: merged });
  }

  validateSuggestion(
    suggestion: SpecSuggestion,
    config: EvolutionConfig = this.config
  ) {
    const reasons: string[] = [];
    if (
      config.minConfidence != null &&
      suggestion.confidence < config.minConfidence
    ) {
      reasons.push(
        `Confidence ${suggestion.confidence.toFixed(2)} below minimum ${config.minConfidence}`
      );
    }
    if (config.requireApproval && suggestion.status === 'approved') {
      reasons.push(
        'Suggestion cannot be auto-approved when approval is required'
      );
    }
    if (suggestion.proposal.spec && !suggestion.proposal.spec.meta?.key) {
      reasons.push('Proposal spec must include meta.key');
    }
    if (!suggestion.proposal.summary) {
      reasons.push('Proposal summary is required');
    }
    const ok = reasons.length === 0;
    if (!ok) {
      this.logger?.warn('SpecGenerator.validateSuggestion.failed', {
        suggestionId: suggestion.id,
        reasons,
      });
    }
    return { ok, reasons };
  }

  private intentToVerb(intent: IntentPattern['type']) {
    switch (intent) {
      case 'error-spike':
        return 'Stabilize';
      case 'latency-regression':
        return 'Optimize';
      case 'missing-operation':
        return 'Introduce';
      case 'throughput-drop':
        return 'Rebalance';
      default:
        return 'Adjust';
    }
  }

  private intentToPriority(intent: IntentPattern) {
    const severity = intent.confidence.score;
    if (intent.type === 'error-spike' || severity >= 0.8) return 'high';
    if (severity >= 0.5) return 'medium';
    return 'low';
  }

  private inferChangeType(
    intent: IntentPattern
  ): SpecSuggestionProposal['changeType'] {
    switch (intent.type) {
      case 'missing-operation':
        return 'new-spec';
      case 'schema-mismatch':
        return 'schema-update';
      case 'error-spike':
        return 'policy-update';
      default:
        return 'revision';
    }
  }
}

function mergeContract(
  base: AnyOperationSpec,
  patch: SpecPatch
): AnyOperationSpec {
  return {
    ...base,
    ...patch,
    meta: { ...base.meta, ...patch.meta },
    io: {
      ...base.io,
      ...patch.io,
    },
    policy: {
      ...base.policy,
      ...patch.policy,
    },
    telemetry: {
      ...base.telemetry,
      ...patch.telemetry,
    },
    sideEffects: {
      ...base.sideEffects,
      ...patch.sideEffects,
    },
  } as AnyOperationSpec;
}







