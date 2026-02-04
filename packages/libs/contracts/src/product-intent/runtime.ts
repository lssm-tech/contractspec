import type { EvidenceChunk, InsightExtraction, OpportunityBrief, ContractPatchIntent, ContractSpecPatch, ImpactReport, TaskPack } from "./types";
import type { ProductIntentSpec } from "./spec";
import { ProductIntentRegistry } from "./registry";

/**
 * Options for constructing a ProductIntentRuntime. The runtime
 * requires an evidence fetcher to retrieve evidence chunks from a
 * backing store (e.g. vector database, local files) and may be
 * extended with additional hooks for custom behaviour. All hooks are
 * optional to facilitate rapid prototyping.
 */
export interface ProductIntentRuntimeOptions<Context = unknown> {
  /**
   * Fetch evidence relevant to a discovery question. The implementation
   * should perform retrieval against whatever store you choose
   * (vector search, keyword search, etc.) and return the top K
   * EvidenceChunk objects.
   */
  fetchEvidence: (params: { query: string; maxChunks?: number; context?: Context }) => Promise<EvidenceChunk[]>;

  /**
   * Optional callback invoked after insight extraction. Allows
   * consumers to inspect or transform insights before synthesis.
   */
  onInsightsGenerated?: (insights: InsightExtraction, ctx?: Context) => Promise<void>;

  /**
   * Optional callback invoked after brief synthesis. Allows
   * consumers to adjust the brief or perform side effects (e.g.
   * persistence) before patch generation.
   */
  onBriefSynthesised?: (brief: OpportunityBrief, ctx?: Context) => Promise<void>;

  /**
   * Optional callback invoked after patch intent generation.
   */
  onPatchIntentGenerated?: (intent: ContractPatchIntent, ctx?: Context) => Promise<void>;

  /**
   * Optional callback invoked after concrete patch generation.
   */
  onPatchGenerated?: (patch: ContractSpecPatch, ctx?: Context) => Promise<void>;

  /**
   * Optional callback invoked after impact report generation.
   */
  onImpactGenerated?: (impact: ImpactReport, ctx?: Context) => Promise<void>;

  /**
   * Optional callback invoked after task pack generation.
   */
  onTasksGenerated?: (tasks: TaskPack, ctx?: Context) => Promise<void>;
}

/**
 * A ProductIntentRuntime orchestrates the multi‑step pipeline of
 * evidence retrieval, insight extraction, brief synthesis, patch
 * generation and task generation. It is intentionally kept
 * lightweight: it delegates heavy lifting (LLM calls, patch
 * translation) to user‑provided functions or leaves them unimplemented.
 *
 * Consumers should extend this class and override methods such as
 * `extractInsights`, `synthesiseBrief`, `generatePatchIntent`, etc.
 */
export class ProductIntentRuntime<Context = unknown> {
  private registry: ProductIntentRegistry;
  private opts: ProductIntentRuntimeOptions<Context>;

  constructor(opts: ProductIntentRuntimeOptions<Context>, registry?: ProductIntentRegistry) {
    this.opts = opts;
    this.registry = registry ?? new ProductIntentRegistry();
  }

  /**
   * Register an intent spec with this runtime. Convenience wrapper
   * around ProductIntentRegistry.register.
   */
  registerIntent<Meta = unknown>(spec: ProductIntentSpec<Meta>): void {
    this.registry.register(spec);
  }

  /**
   * Main entrypoint for running the discovery loop. Given a
   * question, this method performs evidence retrieval, insight
   * extraction, brief synthesis, patch generation, impact analysis and
   * task generation, wiring together any user‑provided hooks along
   * the way. It returns a populated ProductIntentSpec.
   */
  async runDiscovery(question: string, context?: Context): Promise<ProductIntentSpec<Context>> {
    const spec: ProductIntentSpec<Context> = {
      id: Math.random().toString(36).slice(2),
      question,
      meta: context,
    };

    // 1. Retrieve evidence
    const evidence = await this.opts.fetchEvidence({ query: question, maxChunks: 20, context });

    // 2. Extract insights (must be implemented by subclass)
    const insights = await this.extractInsights(question, evidence, context);
    if (this.opts.onInsightsGenerated) await this.opts.onInsightsGenerated(insights, context);

    // 3. Synthesise brief
    const brief = await this.synthesiseBrief(question, insights, context);
    spec.brief = brief;
    if (this.opts.onBriefSynthesised) await this.opts.onBriefSynthesised(brief, context);

    // 4. Generate patch intent
    const intent = await this.generatePatchIntent(brief, context);
    spec.patchIntent = intent;
    if (this.opts.onPatchIntentGenerated) await this.opts.onPatchIntentGenerated(intent, context);

    // 5. Translate patch intent into concrete patch
    const patch = await this.generatePatch(intent, context);
    spec.patch = patch;
    if (this.opts.onPatchGenerated) await this.opts.onPatchGenerated(patch, context);

    // 6. Analyse impact
    const impact = await this.generateImpactReport(intent, patch, context);
    spec.impact = impact;
    if (this.opts.onImpactGenerated) await this.opts.onImpactGenerated(impact, context);

    // 7. Create tasks
    const tasks = await this.generateTasks(brief, intent, impact, context);
    spec.tasks = tasks;
    if (this.opts.onTasksGenerated) await this.opts.onTasksGenerated(tasks, context);

    // Register the completed spec for later retrieval
    this.registry.register(spec);
    return spec;
  }

  /**
   * Extract insights from evidence. Override in subclasses. The
   * default implementation throws to signal that it must be
   * implemented.
   */
  protected async extractInsights(_question: string, _evidence: EvidenceChunk[], _context?: Context): Promise<InsightExtraction> {
    throw new Error("extractInsights() not implemented. Provide an implementation in a subclass.");
  }

  /**
   * Synthesise a brief from extracted insights. Override in
   * subclasses.
   */
  protected async synthesiseBrief(_question: string, _insights: InsightExtraction, _context?: Context): Promise<OpportunityBrief> {
    throw new Error("synthesiseBrief() not implemented. Provide an implementation in a subclass.");
  }

  /**
   * Generate a patch intent from a brief. Override in subclasses.
   */
  protected async generatePatchIntent(_brief: OpportunityBrief, _context?: Context): Promise<ContractPatchIntent> {
    throw new Error("generatePatchIntent() not implemented. Provide an implementation in a subclass.");
  }

  /**
   * Translate a patch intent into a concrete ContractSpec patch.
   */
  protected async generatePatch(_intent: ContractPatchIntent, _context?: Context): Promise<ContractSpecPatch> {
    throw new Error("generatePatch() not implemented. Provide an implementation in a subclass.");
  }

  /**
   * Produce an impact report for a given intent and patch.
   */
  protected async generateImpactReport(_intent: ContractPatchIntent, _patch: ContractSpecPatch, _context?: Context): Promise<ImpactReport> {
    throw new Error("generateImpactReport() not implemented. Provide an implementation in a subclass.");
  }

  /**
   * Generate a task pack from the brief, intent and impact report.
   */
  protected async generateTasks(_brief: OpportunityBrief, _intent: ContractPatchIntent, _impact: ImpactReport, _context?: Context): Promise<TaskPack> {
    throw new Error("generateTasks() not implemented. Provide an implementation in a subclass.");
  }
}
