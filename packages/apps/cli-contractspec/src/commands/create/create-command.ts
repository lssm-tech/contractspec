import { getAuthoringTargetDefinitions } from '@contractspec/module.workspace';
import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { validateProvider } from '../../ai/providers';
import type { Config } from '../../utils/config';
import { createAppConfigSpec } from './create-app-config';
import { createDataViewSpec } from './create-data-view';
import { createEventSpec } from './create-event';
import { createExperimentSpec } from './create-experiment';
import { createFeatureSpec } from './create-feature';
import { createFormSpec } from './create-form';
import { createIntegrationSpec } from './create-integration';
import { createKnowledgeSpec } from './create-knowledge';
import { createMigrationSpec } from './create-migration';
import { createOperationSpec } from './create-operation';
import {
	createBuilderSpecPackage,
	createModuleBundleSpec,
	createProviderSpecPackage,
} from './create-package-target';
import { createPresentationSpec } from './create-presentation';
import { createTelemetrySpec } from './create-telemetry';
import { createWorkflowSpec } from './create-workflow';
import type { CreateOptions } from './types';

export async function createCommand(options: CreateOptions, config: Config) {
	console.log(chalk.bold.blue('\n📝 Contract Spec Creator\n'));

	let specType = options.type;

	if (!specType) {
		specType = (await select({
			message: 'What type of spec would you like to create?',
			choices: getAuthoringTargetDefinitions().map((definition) => ({
				name: definition.title,
				value: definition.id,
			})),
		})) as CreateOptions['type'];
	}

	if (options.ai) {
		const validation = await validateProvider(config);
		if (!validation.success) {
			console.error(chalk.red(`\n❌ AI provider error: ${validation.error}`));

			console.log(chalk.yellow('\nFalling back to interactive wizard...\n'));
			options.ai = false;
		}
	}

	const handlers = {
		operation: createOperationSpec,
		event: createEventSpec,
		presentation: createPresentationSpec,
		workflow: createWorkflowSpec,
		migration: createMigrationSpec,
		telemetry: createTelemetrySpec,
		experiment: createExperimentSpec,
		'app-config': createAppConfigSpec,
		'data-view': createDataViewSpec,
		integration: createIntegrationSpec,
		knowledge: createKnowledgeSpec,
		form: createFormSpec,
		feature: createFeatureSpec,
		'module-bundle': createModuleBundleSpec,
		'builder-spec': createBuilderSpecPackage,
		'provider-spec': createProviderSpecPackage,
	} as const;

	const handler = specType ? handlers[specType] : undefined;
	if (!handler) {
		console.error(chalk.red(`Unknown spec type: ${specType}`));
		process.exit(1);
	}

	await handler(options, config);
}
