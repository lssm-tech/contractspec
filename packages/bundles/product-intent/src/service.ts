import type { EvidenceChunk } from '@contractspec/lib.contracts-spec/product-intent/types';
import {
	createKeywordEvidenceFetcher,
	type ProductIntentModelRunner,
	ProductIntentOrchestrator,
	type ProductIntentOrchestratorOptions,
} from '@contractspec/module.product-intent-core';
import type { LanguageModel } from 'ai';
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
