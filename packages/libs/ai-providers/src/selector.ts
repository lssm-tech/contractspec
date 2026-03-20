import type {
	BenchmarkDimension,
	DimensionWeightConfig,
	ModelRanking,
	ProviderRankingStore,
} from '@contractspec/lib.provider-ranking';
import type { LanguageModel } from 'ai';
import { createProvider } from './factory';
import { getModelInfo, MODELS } from './models';
import type {
	ModelConstraints,
	ModelSelectionContext,
	ModelSelectionResult,
	ModelSelector,
} from './selector-types';
import type { ModelInfo, ProviderName } from './types';

export interface ModelSelectorOptions {
	store: ProviderRankingStore;
	fallbackModels?: ModelInfo[];
	defaultConstraints?: ModelConstraints;
}

/**
 * Create a ModelSelector backed by ranking data with static-metadata fallback.
 *
 * Uses DimensionMatchSelector when `taskDimension` is set,
 * MultiObjectiveSelector when `priorities` are set.
 */
export function createModelSelector(
	options: ModelSelectorOptions
): ModelSelector {
	const { store, fallbackModels, defaultConstraints } = options;
	const catalog = fallbackModels ?? MODELS;

	return {
		async select(
			context: ModelSelectionContext
		): Promise<ModelSelectionResult> {
			const merged = mergeConstraints(defaultConstraints, context.constraints);

			if (context.priorities?.length) {
				return selectMultiObjective(store, catalog, context.priorities, merged);
			}

			const dimension = context.taskDimension ?? 'reasoning';
			return selectByDimension(store, catalog, dimension, merged);
		},

		async selectAndCreate(
			context: ModelSelectionContext
		): Promise<{ model: LanguageModel; selection: ModelSelectionResult }> {
			const selection = await this.select(context);
			const model = createProvider({
				provider: selection.providerKey as ProviderName,
				model: selection.modelId,
			}).getModel();

			return { model, selection };
		},
	};
}

async function selectByDimension(
	store: ProviderRankingStore,
	catalog: ModelInfo[],
	dimension: BenchmarkDimension,
	constraints: ModelConstraints
): Promise<ModelSelectionResult> {
	const { rankings } = await store.listModelRankings({ dimension, limit: 50 });

	const eligible = filterRankings(rankings, catalog, constraints);

	const topCandidate = eligible[0];
	if (topCandidate) {
		const dimScore =
			topCandidate.dimensionScores[dimension]?.score ??
			topCandidate.compositeScore;
		return {
			modelId: topCandidate.modelId,
			providerKey: topCandidate.providerKey,
			score: dimScore,
			reason: `Top-ranked for "${dimension}" (score ${Math.round(dimScore)})`,
			alternatives: eligible.slice(1, 4).map((r) => ({
				modelId: r.modelId,
				providerKey: r.providerKey,
				score: r.dimensionScores[dimension]?.score ?? r.compositeScore,
			})),
		};
	}

	return fallbackFromCatalog(catalog, constraints, dimension);
}

async function selectMultiObjective(
	store: ProviderRankingStore,
	catalog: ModelInfo[],
	priorities: DimensionWeightConfig[],
	constraints: ModelConstraints
): Promise<ModelSelectionResult> {
	const { rankings } = await store.listModelRankings({ limit: 100 });
	const eligible = filterRankings(rankings, catalog, constraints);

	if (eligible.length === 0) {
		const primaryDim = priorities.reduce((a, b) =>
			b.weight > a.weight ? b : a
		).dimension;
		return fallbackFromCatalog(catalog, constraints, primaryDim);
	}

	const totalWeight = priorities.reduce((sum, p) => sum + p.weight, 0) || 1;

	const scored = eligible.map((r) => {
		let weightedScore = 0;
		for (const p of priorities) {
			const dimScore = r.dimensionScores[p.dimension]?.score ?? 0;
			weightedScore += dimScore * (p.weight / totalWeight);
		}
		return { ranking: r, weightedScore };
	});

	scored.sort((a, b) => b.weightedScore - a.weightedScore);

	const best = scored[0];
	if (!best) {
		const primaryDim = priorities.reduce((a, b) =>
			b.weight > a.weight ? b : a
		).dimension;
		return fallbackFromCatalog(catalog, constraints, primaryDim);
	}
	const dims = priorities.map((p) => p.dimension).join(', ');

	return {
		modelId: best.ranking.modelId,
		providerKey: best.ranking.providerKey,
		score: Math.round(best.weightedScore * 100) / 100,
		reason: `Multi-objective optimum across [${dims}]`,
		alternatives: scored.slice(1, 4).map((s) => ({
			modelId: s.ranking.modelId,
			providerKey: s.ranking.providerKey,
			score: Math.round(s.weightedScore * 100) / 100,
		})),
	};
}

function filterRankings(
	rankings: ModelRanking[],
	catalog: ModelInfo[],
	constraints: ModelConstraints
): ModelRanking[] {
	return rankings.filter((r) => {
		if (constraints.allowedProviders?.length) {
			if (!constraints.allowedProviders.includes(r.providerKey as ProviderName))
				return false;
		}
		if (constraints.excludeModels?.length) {
			if (constraints.excludeModels.includes(r.modelId)) return false;
		}

		const info =
			getModelInfo(r.modelId) ?? catalog.find((m) => m.id === r.modelId);
		if (!info) return true;

		if (
			constraints.minContextWindow &&
			info.contextWindow < constraints.minContextWindow
		) {
			return false;
		}
		if (constraints.maxCostPerMillionInput && info.costPerMillion) {
			if (info.costPerMillion.input > constraints.maxCostPerMillionInput)
				return false;
		}
		if (constraints.maxCostPerMillionOutput && info.costPerMillion) {
			if (info.costPerMillion.output > constraints.maxCostPerMillionOutput)
				return false;
		}
		if (constraints.requiredCapabilities?.length) {
			for (const cap of constraints.requiredCapabilities) {
				if (!info.capabilities[cap]) return false;
			}
		}

		return true;
	});
}

function fallbackFromCatalog(
	catalog: ModelInfo[],
	constraints: ModelConstraints,
	dimension: BenchmarkDimension
): ModelSelectionResult {
	let eligible = catalog.filter((m) => m.costPerMillion != null);

	const {
		allowedProviders,
		excludeModels,
		minContextWindow,
		requiredCapabilities,
	} = constraints;
	if (allowedProviders?.length) {
		eligible = eligible.filter((m) => allowedProviders.includes(m.provider));
	}
	if (excludeModels?.length) {
		eligible = eligible.filter((m) => !excludeModels.includes(m.id));
	}
	if (minContextWindow) {
		eligible = eligible.filter((m) => m.contextWindow >= minContextWindow);
	}
	if (requiredCapabilities?.length) {
		eligible = eligible.filter((m) =>
			requiredCapabilities.every((cap) => m.capabilities[cap])
		);
	}

	if (eligible.length === 0) {
		eligible = catalog.slice(0, 5);
	}

	eligible.sort((a, b) => {
		const costA = a.costPerMillion
			? (a.costPerMillion.input + a.costPerMillion.output) / 2
			: 999;
		const costB = b.costPerMillion
			? (b.costPerMillion.input + b.costPerMillion.output) / 2
			: 999;
		return (
			b.contextWindow / 100000 - costB - (a.contextWindow / 100000 - costA)
		);
	});

	const best = eligible[0];
	if (!best) {
		return {
			modelId: 'unknown',
			providerKey: 'openai',
			score: 0,
			reason: `No eligible models found for "${dimension}"`,
			alternatives: [],
		};
	}
	return {
		modelId: best.id,
		providerKey: best.provider,
		score: 0,
		reason: `Fallback from catalog (no ranking data for "${dimension}")`,
		alternatives: eligible.slice(1, 4).map((m) => ({
			modelId: m.id,
			providerKey: m.provider,
			score: 0,
		})),
	};
}

function mergeConstraints(
	defaults?: ModelConstraints,
	overrides?: ModelConstraints
): ModelConstraints {
	if (!defaults) return overrides ?? {};
	if (!overrides) return defaults;
	return { ...defaults, ...overrides };
}

export type {
	ModelConstraints,
	ModelSelectionContext,
	ModelSelectionResult,
	ModelSelector,
};
