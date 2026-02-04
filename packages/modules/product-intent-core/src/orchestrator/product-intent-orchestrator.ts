import {
  type ContractPatchIntent,
  type ContractSpecPatch,
  ContractSpecPatchModel,
  type EvidenceChunk,
  type ImpactReport,
  type InsightExtraction,
  type OpportunityBrief,
  type TaskPack,
} from '@contractspec/lib.contracts/product-intent/types';
import type { ProductIntentSpec } from '@contractspec/lib.contracts/product-intent/spec';
import { ProductIntentRegistry } from '@contractspec/lib.contracts/product-intent/registry';
import {
  formatEvidenceForModel,
  parseStrictJSON,
  promptExtractInsights,
  promptGenerateGenericSpecOverlay,
  promptGenerateImpactReport,
  promptGeneratePatchIntent,
  promptGenerateTaskPack,
  promptSynthesizeBrief,
  validateImpactReport,
  validateInsightExtraction,
  validateOpportunityBrief,
  validatePatchIntent,
  validateTaskPack,
} from '@contractspec/lib.product-intent-utils';
import type {
  ProductIntentOrchestratorOptions,
  ProductIntentOrchestratorParams,
} from '../types';

export class ProductIntentOrchestrator<Context = unknown> {
  private options: ProductIntentOrchestratorOptions<Context>;
  private registry: ProductIntentRegistry;

  constructor(
    options: ProductIntentOrchestratorOptions<Context>,
    registry?: ProductIntentRegistry
  ) {
    this.options = options;
    this.registry = registry ?? new ProductIntentRegistry();
  }

  getRegistry(): ProductIntentRegistry {
    return this.registry;
  }

  async runDiscovery(
    params: ProductIntentOrchestratorParams<Context>
  ): Promise<ProductIntentSpec<Context>> {
    const { id, meta, question, context } = params;
    const maxEvidenceChunks =
      params.maxEvidenceChunks ?? this.options.maxEvidenceChunks ?? 20;

    const spec: ProductIntentSpec<Context> = {
      id,
      meta,
      question,
      runtimeContext: context,
    };

    const evidence = await this.options.fetchEvidence({
      query: question,
      maxChunks: maxEvidenceChunks,
      context,
    });

    const insights = await this.extractInsights(question, evidence, context);
    spec.insights = insights;
    if (this.options.onInsightsGenerated) {
      await this.options.onInsightsGenerated(insights, context);
    }

    const brief = await this.synthesiseBrief(
      question,
      insights,
      evidence,
      context
    );
    spec.brief = brief;
    if (this.options.onBriefSynthesised) {
      await this.options.onBriefSynthesised(brief, context);
    }

    const intent = await this.generatePatchIntent(brief, context);
    spec.patchIntent = intent;
    if (this.options.onPatchIntentGenerated) {
      await this.options.onPatchIntentGenerated(intent, context);
    }

    const patch = await this.generatePatch(intent, params.baseSpecSnippet);
    spec.patch = patch;
    if (this.options.onPatchGenerated) {
      await this.options.onPatchGenerated(patch, context);
    }

    const impact = await this.generateImpactReport(
      intent,
      patch,
      params.compilerOutputText
    );
    spec.impact = impact;
    if (this.options.onImpactGenerated) {
      await this.options.onImpactGenerated(impact, context);
    }

    const tasks = await this.generateTasks(
      brief,
      intent,
      impact,
      params.repoContext
    );
    spec.tasks = tasks;
    if (this.options.onTasksGenerated) {
      await this.options.onTasksGenerated(tasks, context);
    }

    this.registry.set(spec);
    return spec;
  }

  protected async extractInsights(
    question: string,
    evidence: EvidenceChunk[],
    _context?: Context
  ): Promise<InsightExtraction> {
    const evidenceJSON = formatEvidenceForModel(evidence);
    const prompt = promptExtractInsights({ question, evidenceJSON });
    const raw = await this.runModel(prompt);
    return validateInsightExtraction(raw, evidence);
  }

  protected async synthesiseBrief(
    question: string,
    insights: InsightExtraction,
    evidence: EvidenceChunk[],
    _context?: Context
  ): Promise<OpportunityBrief> {
    const insightsJSON = JSON.stringify(insights, null, 2);
    const allowedChunkIds = evidence.map((chunk) => chunk.chunkId);
    const prompt = promptSynthesizeBrief({
      question,
      insightsJSON,
      allowedChunkIds,
    });
    const raw = await this.runModel(prompt);
    return validateOpportunityBrief(raw, evidence);
  }

  protected async generatePatchIntent(
    brief: OpportunityBrief,
    _context?: Context
  ): Promise<ContractPatchIntent> {
    const briefJSON = JSON.stringify(brief, null, 2);
    const prompt = promptGeneratePatchIntent({ briefJSON });
    const raw = await this.runModel(prompt);
    return validatePatchIntent(raw);
  }

  protected async generatePatch(
    intent: ContractPatchIntent,
    baseSpecSnippet?: string
  ): Promise<ContractSpecPatch> {
    const patchIntentJSON = JSON.stringify(intent, null, 2);
    const prompt = promptGenerateGenericSpecOverlay({
      baseSpecSnippet: baseSpecSnippet ?? '',
      patchIntentJSON,
    });
    const raw = await this.runModel(prompt);
    return parseStrictJSON<ContractSpecPatch>(ContractSpecPatchModel, raw);
  }

  protected async generateImpactReport(
    intent: ContractPatchIntent,
    patch: ContractSpecPatch,
    compilerOutputText?: string
  ): Promise<ImpactReport> {
    const patchIntentJSON = JSON.stringify(intent, null, 2);
    const overlayJSON = JSON.stringify(patch, null, 2);
    const prompt = promptGenerateImpactReport({
      patchIntentJSON,
      overlayJSON,
      compilerOutputText,
    });
    const raw = await this.runModel(prompt);
    return validateImpactReport(raw);
  }

  protected async generateTasks(
    brief: OpportunityBrief,
    intent: ContractPatchIntent,
    impact: ImpactReport,
    repoContext?: string
  ): Promise<TaskPack> {
    const briefJSON = JSON.stringify(brief, null, 2);
    const patchIntentJSON = JSON.stringify(intent, null, 2);
    const impactJSON = JSON.stringify(impact, null, 2);
    const prompt = promptGenerateTaskPack({
      briefJSON,
      patchIntentJSON,
      impactJSON,
      repoContext,
    });
    const raw = await this.runModel(prompt);
    return validateTaskPack(raw);
  }

  private async runModel(prompt: string): Promise<string> {
    return this.options.modelRunner.generateJson(prompt);
  }
}
