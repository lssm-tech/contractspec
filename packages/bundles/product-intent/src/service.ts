import type { LanguageModel } from 'ai';
import type { EvidenceChunk } from '@contractspec/lib.contracts/product-intent/types';
import {
  ProductIntentOrchestrator,
  createKeywordEvidenceFetcher,
  type ProductIntentModelRunner,
  type ProductIntentOrchestratorOptions,
} from '@contractspec/module.product-intent-core';
import { createAiProductIntentRunner } from './ai-runner';

export interface ProductIntentServiceOptions<Context = unknown> {
  model: LanguageModel;
  evidence: EvidenceChunk[];
  system?: string;
  maxEvidenceChunks?: number;
  minEvidenceScore?: number;
  modelRunner?: ProductIntentModelRunner;
  orchestratorOptions?: Omit<
    ProductIntentOrchestratorOptions<Context>,
    'fetchEvidence' | 'modelRunner' | 'maxEvidenceChunks'
  >;
}

export const createProductIntentService = <Context = unknown>(
  options: ProductIntentServiceOptions<Context>
) => {
  const runner =
    options.modelRunner ??
    createAiProductIntentRunner({
      model: options.model,
      system: options.system,
    });

  const fetchEvidence = createKeywordEvidenceFetcher(options.evidence, {
    minScore: options.minEvidenceScore,
  });

  return new ProductIntentOrchestrator<Context>({
    fetchEvidence,
    modelRunner: runner,
    maxEvidenceChunks: options.maxEvidenceChunks,
    ...options.orchestratorOptions,
  });
};
