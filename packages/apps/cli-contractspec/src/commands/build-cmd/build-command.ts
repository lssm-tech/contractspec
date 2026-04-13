import { existsSync } from 'node:fs';
import {
	buildSpec,
	createNodeAdapters,
	type RuntimeGenerationStrategy,
} from '@contractspec/bundle.workspace';
import { findAuthoringTargetDefinition } from '@contractspec/module.workspace';
import chalk from 'chalk';
import { AgentOrchestrator } from '../../ai/agents/index';
import { validateProvider } from '../../ai/providers';
import type { Config } from '../../utils/config';
import {
	ensureTrailingNewline,
	generateTestsWithAgent,
	generateWithAgent,
} from './agent-generation';
import { detectSpecType } from './spec-detect';
import type { BuildOptions } from './types';

export async function buildCommand(
	specFile: string,
	options: BuildOptions,
	config: Config
) {
	console.log(chalk.bold.blue('\n🏗️  Contract Builder\n'));

	if (!existsSync(specFile)) {
		console.error(chalk.red(`❌ Spec file not found: ${specFile}`));
		process.exit(1);
	}

	const adapters = createNodeAdapters({ config, silent: true });
	const orchestrator = await resolveOrchestrator(options, config);
	const generation = createRuntimeGenerationStrategy(config, orchestrator);
	const result = await buildSpec(specFile, adapters, config, {
		outputDir: options.outputDir ?? config.outputDir,
		overwrite: true,
		includeTests: !options.noTests,
		runtimeGeneration: generation,
	});

	if (result.results.length === 0) {
		const definition =
			result.targetId !== 'unknown'
				? findAuthoringTargetDefinition(result.targetId)
				: undefined;
		if (!definition) {
			console.log(
				chalk.yellow(
					'⚠️  Could not determine the authored target type automatically.'
				)
			);
			return;
		}

		if (
			definition.materialization === 'docs' ||
			definition.materialization === 'none'
		) {
			console.log(
				chalk.yellow(
					`ℹ️  ${definition.title} targets are materialized through "contractspec generate" rather than "contractspec build".`
				)
			);
			return;
		}

		console.log(
			chalk.yellow(
				`ℹ️  No materialization targets were produced for ${definition.title}.`
			)
		);
		return;
	}

	const failed = result.results.filter(
		(entry) => !entry.success && !entry.skipped
	);
	const skipped = result.results.filter((entry) => entry.skipped);
	const succeeded = result.results.filter((entry) => entry.success);

	for (const entry of succeeded) {
		console.log(
			chalk.green(`✅ Generated ${entry.target}: ${entry.outputPath}`)
		);
	}
	for (const entry of skipped) {
		console.log(chalk.yellow(`⚠️  Skipped ${entry.target}: ${entry.error}`));
	}
	for (const entry of failed) {
		console.log(
			chalk.red(
				`❌ Failed ${entry.target}${entry.outputPath ? ` (${entry.outputPath})` : ''}: ${entry.error ?? 'unknown error'}`
			)
		);
	}

	if (failed.length > 0) {
		process.exit(1);
	}

	console.log(chalk.cyan('\n✨ Build complete!'));
}

async function resolveOrchestrator(
	options: BuildOptions,
	config: Config
): Promise<AgentOrchestrator | null> {
	if (options.noAgent) {
		return null;
	}

	const orchestrator = new AgentOrchestrator(config);
	if (config.agentMode !== 'simple') {
		return orchestrator;
	}

	const providerStatus = await validateProvider(config);
	if (providerStatus.success) {
		return orchestrator;
	}

	console.log(
		chalk.yellow(
			`⚠️  AI provider unavailable (${providerStatus.error}). Falling back to template generation.`
		)
	);
	return null;
}

function createRuntimeGenerationStrategy(
	config: Config,
	orchestrator: AgentOrchestrator | null
): RuntimeGenerationStrategy | undefined {
	if (!orchestrator) {
		return undefined;
	}

	return {
		generateArtifact: async (input) => {
			const label = input.kind === 'form' ? 'form component' : input.kind;
			const result = await generateWithAgent(orchestrator, config.agentMode, {
				label,
				target: input.kind,
				specCode: input.specCode,
				targetPath: input.outputPath || undefined,
			});
			return result ? ensureTrailingNewline(result.code) : null;
		},
		generateTest: async (input) => {
			const result = await generateTestsWithAgent(
				orchestrator,
				config.agentMode,
				{
					specCode: input.specCode,
					existingCode: input.existingCode,
					target: input.kind,
				}
			);
			return result ? ensureTrailingNewline(result.code) : null;
		},
	};
}
