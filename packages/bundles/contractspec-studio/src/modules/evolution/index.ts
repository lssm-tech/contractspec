import type { Logger } from '@lssm/lib.logger';
import type { LifecycleStage } from '@lssm/lib.lifecycle';
import {
  prisma,
  EvolutionStatus,
  EvolutionTrigger,
} from '@lssm/lib.database-contractspec-studio';
import {
  SpecAnalyzer,
  SpecGenerator,
  type OperationMetricSample,
  type SpecSuggestion,
  type SpecUsageStats,
  type SpecAnomaly,
} from '@lssm/lib.evolution';
import {
  toInputJson,
  toJsonNullValue,
  toNullableJsonValue,
} from '../../utils/prisma-json';

export interface AnalyzeProjectOptions {
  samples: OperationMetricSample[];
  baselineSamples?: OperationMetricSample[];
  lifecycleStage?: LifecycleStage;
  trigger?: EvolutionTrigger;
  signals?: Record<string, unknown>[];
  context?: Record<string, unknown>;
}

export interface EvolutionAnalysisResult {
  sessionId: string;
  stats: SpecUsageStats[];
  anomalies: SpecAnomaly[];
  suggestions: SpecSuggestion[];
}

export interface AppliedChange {
  suggestionId: string;
  summary: string;
  status: 'queued' | 'applied';
  appliedAt: Date;
  notes?: string;
}

export interface ApplyEvolutionResult {
  sessionId: string;
  applied: AppliedChange[];
}

export interface StudioEvolutionModuleOptions {
  analyzer?: SpecAnalyzer;
  generator?: SpecGenerator;
  logger?: Logger;
}

export class StudioEvolutionModule {
  private readonly analyzer: SpecAnalyzer;
  private readonly generator: SpecGenerator;
  private readonly logger?: Logger;

  constructor(options: StudioEvolutionModuleOptions = {}) {
    this.analyzer = options.analyzer ?? new SpecAnalyzer();
    this.generator = options.generator ?? new SpecGenerator();
    this.logger = options.logger;
  }

  async analyzeProject(
    projectId: string,
    options: AnalyzeProjectOptions
  ): Promise<EvolutionAnalysisResult> {
    if (!options.samples.length) {
      throw new Error('analyzeProject requires at least one metric sample');
    }

    const baselineStats = options.baselineSamples
      ? this.analyzer.analyzeSpecUsage(options.baselineSamples)
      : undefined;

    const stats = this.analyzer.analyzeSpecUsage(options.samples);
    const anomalies = this.analyzer.detectAnomalies(stats, baselineStats);
    const intents = this.analyzer.toIntentPatterns(anomalies, stats);
    const suggestions = intents.map((intent) =>
      this.generator.generateFromIntent(intent, {
        metadata: { projectId },
        tags: ['studio', projectId],
      })
    );

    const session = await prisma.evolutionSession.create({
      data: {
        projectId,
        trigger: options.trigger ?? EvolutionTrigger.MANUAL,
        status: EvolutionStatus.SUGGESTIONS_READY,
        signals: toInputJson(options.signals ?? []),
        context: toInputJson(options.context ?? {}),
        suggestions: toInputJson(suggestions),
        startedAt: new Date(),
        completedAt: suggestions.length ? null : new Date(),
      },
    });

    this.logger?.info?.('studio.evolution.analyzed', {
      projectId,
      sessionId: session.id,
      suggestionCount: suggestions.length,
    });

    return {
      sessionId: session.id,
      stats,
      anomalies,
      suggestions,
    };
  }

  async applyEvolution(
    projectId: string,
    sessionId: string,
    suggestions: SpecSuggestion[]
  ): Promise<ApplyEvolutionResult> {
    if (!suggestions.length) {
      throw new Error('applyEvolution requires at least one suggestion');
    }

    const applied: AppliedChange[] = suggestions.map((suggestion) => ({
      suggestionId: suggestion.id,
      summary: suggestion.proposal.summary ?? 'auto-evolution suggestion',
      status: 'queued',
      appliedAt: new Date(),
    }));

    await prisma.evolutionSession.update({
      where: { id: sessionId },
      data: {
        status: EvolutionStatus.APPLYING,
        appliedChanges: toJsonNullValue(applied),
      },
    });

    // Placeholder for actual spec mutation + deployment hook.
    for (const change of applied) {
      change.status = 'applied';
      change.appliedAt = new Date();
    }

    await prisma.evolutionSession.update({
      where: { id: sessionId },
      data: {
        status: EvolutionStatus.COMPLETED,
        appliedChanges: toNullableJsonValue(applied),
        completedAt: new Date(),
      },
    });

    this.logger?.info?.('studio.evolution.applied', {
      projectId,
      sessionId,
      applied: applied.length,
    });

    return { sessionId, applied };
  }
}
