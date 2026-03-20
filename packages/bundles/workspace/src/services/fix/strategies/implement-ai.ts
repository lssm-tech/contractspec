/**
 * Implement AI strategy.
 *
 * Creates a spec with AI-generated content using experimental stability.
 */

import path from 'node:path';
import type { FsAdapter } from '../../../ports/fs';
import type { LoggerAdapter } from '../../../ports/logger';
import {
	generateSkeletonCapability,
	generateSkeletonEvent,
	generateSkeletonOperation,
	generateSkeletonPresentation,
} from '../../../templates/fix';
import { resolveOutputPath } from '../path-resolver';
import type {
	FixableIssue,
	FixFileChange,
	FixOptions,
	FixResult,
	SpecGenerationContext,
} from '../types';
import { FIX_STRATEGY_STABILITY } from '../types';

/**
 * Create a spec with AI-generated content.
 *
 * Falls back to skeleton if AI is not available or fails.
 */
export async function implementAiStrategy(
	issue: FixableIssue,
	options: FixOptions,
	adapters: { fs: FsAdapter; logger: LoggerAdapter }
): Promise<FixResult> {
	const { fs, logger } = adapters;
	const { ref, specType, featureKey } = issue;

	try {
		// Build generation context with AI enrichment
		const ctx: SpecGenerationContext = {
			key: ref.key,
			version: ref.version,
			specType,
			stability: FIX_STRATEGY_STABILITY['implement-ai'],
			featureKey,
		};

		// Try to get AI-generated content
		let enrichedCtx = ctx;
		if (options.aiConfig) {
			try {
				enrichedCtx = await enrichWithAI(ctx, options, logger);
			} catch (aiError) {
				logger.warn('AI enrichment failed, falling back to skeleton', {
					error: aiError instanceof Error ? aiError.message : String(aiError),
				});
				// Continue with unenriched context
			}
		} else {
			logger.info(
				'No AI config provided, using skeleton with experimental stability'
			);
		}

		// Generate the spec code
		const code = generateSpecCode(enrichedCtx);
		if (!code) {
			return {
				success: false,
				strategy: 'implement-ai',
				issue,
				filesChanged: [],
				error: `Unsupported spec type: ${specType}`,
			};
		}

		// Determine output path
		const filePath = resolveOutputPath(issue, options);

		const filesChanged: FixFileChange[] = [];

		// Write the file (unless dry run)
		if (!options.dryRun) {
			// Ensure directory exists
			const dir = path.dirname(filePath);
			await fs.mkdir(dir);

			// Write the spec file
			await fs.writeFile(filePath, code);

			filesChanged.push({
				path: filePath,
				action: 'created',
			});
		} else {
			// For dry run, report what would be created
			filesChanged.push({
				path: filePath,
				action: 'created',
			});
		}

		return {
			success: true,
			strategy: 'implement-ai',
			issue,
			filesChanged,
		};
	} catch (error) {
		return {
			success: false,
			strategy: 'implement-ai',
			issue,
			filesChanged: [],
			error: error instanceof Error ? error.message : String(error),
		};
	}
}

/**
 * Enrich the generation context with AI-generated content.
 *
 * Delegates to AIGenerator when AI config is available, falls back to
 * heuristic inference from the spec key.
 */
async function enrichWithAI(
	ctx: SpecGenerationContext,
	options: FixOptions,
	logger: LoggerAdapter
): Promise<SpecGenerationContext> {
	logger.info('Generating AI content for spec', {
		key: ctx.key,
		type: ctx.specType,
	});

	if (options.aiConfig) {
		try {
			const { AIGenerator } = await import('../../create/ai-generator');
			const config = buildResolvedConfig(options);
			const generator = new AIGenerator(config);

			const kind = ctx.specType === 'operation' ? 'command' : ctx.specType;
			const description = `${capitalize(ctx.specType)} for ${ctx.key}`;

			if (ctx.specType === 'operation') {
				const result = await generator.generateOperationSpec(
					description,
					kind as 'command' | 'query'
				);
				return {
					...ctx,
					description: result.description,
					enrichment: {
						goal: result.goal,
						context: result.context,
						owners: result.owners,
						tags: result.tags,
					},
				};
			}

			if (ctx.specType === 'event') {
				const result = await generator.generateEventSpec(description);
				return {
					...ctx,
					description: result.description,
					enrichment: {
						goal: `Emit ${ctx.key} event`,
						context: result.description,
						owners: ['@team'],
						tags: result.tags,
					},
				};
			}
		} catch (aiError) {
			logger.warn('AIGenerator call failed, falling back to heuristics', {
				error: aiError instanceof Error ? aiError.message : String(aiError),
			});
		}
	}

	const enrichment = inferEnrichmentFromKey(ctx.key, ctx.specType);
	return {
		...ctx,
		description: enrichment.description,
		enrichment: {
			goal: enrichment.goal,
			context: enrichment.context,
			owners: ['@team'],
			tags: enrichment.tags,
		},
	};
}

/**
 * Build a minimal ResolvedContractsrcConfig from FixOptions.aiConfig.
 */
function buildResolvedConfig(options: FixOptions) {
	const ai = options.aiConfig;
	const providerMap: Record<string, string> = {
		claude: 'anthropic',
		openai: 'openai',
		ollama: 'ollama',
		custom: 'custom',
	};
	return {
		aiProvider: providerMap[ai?.provider ?? 'openai'] ?? 'openai',
		aiModel: ai?.model ?? 'gpt-4-turbo',
		customApiKey: ai?.apiKey ?? '',
		customEndpoint: ai?.endpoint ?? '',
	} as import('@contractspec/lib.contracts-spec').ResolvedContractsrcConfig;
}

/**
 * Infer enrichment content from the spec key.
 */
function inferEnrichmentFromKey(
	key: string,
	specType: string
): {
	description: string;
	goal: string;
	context: string;
	tags: string[];
} {
	const parts = key.split('.');
	const domain = parts[0] || 'unknown';
	const action = parts.slice(1).join(' ').replace(/_/g, ' ');

	const domainTags = [domain];
	const actionKeywords = action.toLowerCase().split(' ');

	// Add relevant tags based on action keywords
	const tagKeywords = [
		'auth',
		'user',
		'admin',
		'api',
		'data',
		'search',
		'create',
		'update',
		'delete',
	];
	const matchedTags = tagKeywords.filter((tag) =>
		actionKeywords.some((kw) => kw.includes(tag))
	);

	return {
		description: `${capitalize(specType)} for ${domain} ${action}`,
		goal: `Enable ${action} functionality in the ${domain} domain`,
		context: `Part of the ${domain} feature set. Generated by ContractSpec AI fix.`,
		tags: [...domainTags, ...matchedTags],
	};
}

/**
 * Generate spec code based on type.
 */
function generateSpecCode(ctx: SpecGenerationContext): string | undefined {
	switch (ctx.specType) {
		case 'operation':
			return generateSkeletonOperation(ctx);
		case 'event':
			return generateSkeletonEvent(ctx);
		case 'presentation':
			return generateSkeletonPresentation(ctx);
		case 'capability':
			return generateSkeletonCapability(ctx);
		default:
			return undefined;
	}
}

/**
 * Capitalize the first letter of a string.
 */
function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
