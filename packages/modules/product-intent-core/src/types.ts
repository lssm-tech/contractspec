import type { EvidenceChunk } from '@contractspec/lib.contracts-spec/product-intent/types';
import type { ProductIntentMeta } from '@contractspec/lib.contracts-spec/product-intent/spec';
import type {
  ContractPatchIntent,
  ContractSpecPatch,
  ImpactReport,
  InsightExtraction,
  OpportunityBrief,
  TaskPack,
} from '@contractspec/lib.contracts-spec/product-intent/types';

export interface ProductIntentModelRunner {
  generateJson: (prompt: string) => Promise<string>;
}

export interface ProductIntentOrchestratorOptions<Context = unknown> {
  fetchEvidence: (params: {
    query: string;
    maxChunks?: number;
    context?: Context;
  }) => Promise<EvidenceChunk[]>;
  modelRunner: ProductIntentModelRunner;
  maxEvidenceChunks?: number;
  onInsightsGenerated?: (
    insights: InsightExtraction,
    ctx?: Context
  ) => Promise<void>;
  onBriefSynthesised?: (
    brief: OpportunityBrief,
    ctx?: Context
  ) => Promise<void>;
  onPatchIntentGenerated?: (
    intent: ContractPatchIntent,
    ctx?: Context
  ) => Promise<void>;
  onPatchGenerated?: (patch: ContractSpecPatch, ctx?: Context) => Promise<void>;
  onImpactGenerated?: (impact: ImpactReport, ctx?: Context) => Promise<void>;
  onTasksGenerated?: (tasks: TaskPack, ctx?: Context) => Promise<void>;
}

export interface ProductIntentOrchestratorParams<Context = unknown> {
  id: string;
  meta: ProductIntentMeta;
  question: string;
  context?: Context;
  maxEvidenceChunks?: number;
  baseSpecSnippet?: string;
  compilerOutputText?: string;
  repoContext?: string;
}
