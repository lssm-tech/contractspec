import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import chalk from 'chalk';
import { AgentOrchestrator } from '../../ai/agents/index';
import { validateProvider } from '../../ai/providers';
import type { Config } from '../../utils/config';
import { buildDataView } from './build-data-view';
import { buildForm } from './build-form';
import { buildOperation } from './build-operation';
import { buildPresentation } from './build-presentation';
import { buildWorkflow } from './build-workflow';
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

	const specCode = await readFile(specFile, 'utf-8');
	const specType = detectSpecType(specFile, specCode);

	if (
		specType === 'event' ||
		specType === 'migration' ||
		specType === 'telemetry' ||
		specType === 'experiment' ||
		specType === 'app-config' ||
		specType === 'integration' ||
		specType === 'knowledge'
	) {
		console.log(
			chalk.yellow(
				'ℹ️  This spec type does not require build artifacts. Skipping.'
			)
		);
		return;
	}

	if (specType === 'unknown') {
		console.log(
			chalk.yellow(
				'⚠️  Could not determine spec type automatically. Currently supported: operations, presentations, forms.'
			)
		);
		return;
	}

	let orchestrator: AgentOrchestrator | null = null;
	if (!options.noAgent) {
		orchestrator = new AgentOrchestrator(config);

		// For simple agent mode ensure provider credentials exist; otherwise fall back to templates
		if (config.agentMode === 'simple') {
			const providerStatus = await validateProvider(config);
			if (!providerStatus.success) {
				console.log(
					chalk.yellow(
						`⚠️  AI provider unavailable (${providerStatus.error}). Falling back to template generation.`
					)
				);
				orchestrator = null;
			}
		}
	}

	switch (specType) {
		case 'operation':
			await buildOperation(specFile, specCode, options, config, orchestrator);
			break;
		case 'presentation':
			await buildPresentation(
				specFile,
				specCode,
				options,
				config,
				orchestrator
			);
			break;
		case 'form':
			await buildForm(specFile, specCode, options, config, orchestrator);
			break;
		case 'workflow':
			await buildWorkflow(specFile, specCode, options, config);
			break;
		case 'data-view':
			await buildDataView(specFile, specCode, options, config);
			break;
		default:
			console.log(chalk.yellow('⚠️  Unsupported spec type for build command.'));
	}
}
