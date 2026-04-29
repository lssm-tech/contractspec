import { templates } from '@contractspec/bundle.workspace';
import {
	type AuthoringContractSpecType,
	getAuthoringTargetDefinition,
} from '@contractspec/module.workspace';
import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import type { Stability } from '../../types';
import type { Config } from '../../utils/config';
import type { CreateOptions } from './types';
import { writeSpecFile } from './write-spec-file';

type AdditionalCreateTarget = Extract<
	AuthoringContractSpecType,
	| 'capability'
	| 'policy'
	| 'test-spec'
	| 'translation'
	| 'example'
	| 'visualization'
	| 'job'
	| 'agent'
	| 'product-intent'
	| 'pwa-app'
	| 'harness-scenario'
	| 'harness-suite'
>;

const STABILITY_CHOICES: Array<{ name: string; value: Stability }> = [
	{ name: 'Experimental', value: 'experimental' },
	{ name: 'Beta', value: 'beta' },
	{ name: 'Stable', value: 'stable' },
	{ name: 'Deprecated', value: 'deprecated' },
];

export async function createAdditionalContractSpec(
	specType: AdditionalCreateTarget,
	options: CreateOptions,
	config: Config
): Promise<void> {
	const key = await input({
		message: `${getAuthoringTargetDefinition(specType).title} key:`,
		validate: (value: string) => value.trim().length > 0 || 'Key is required',
	});

	const description = await input({
		message: 'Description:',
		validate: (value: string) =>
			value.trim().length > 0 || 'Description is required',
	});

	const stability = await select<Stability>({
		message: 'Stability:',
		choices: STABILITY_CHOICES,
		default: 'experimental',
	});

	const baseData = {
		key,
		version: '1.0.0',
		description,
		stability,
		owners: config.defaultOwners ?? [],
		tags: config.defaultTags ?? [],
	};

	const targetQuestion =
		specType === 'product-intent'
			? await input({
					message: 'Discovery question:',
					default: `How should we improve ${key.split('.').at(-1) ?? key}?`,
				})
			: undefined;
	const translationLocale =
		specType === 'translation'
			? await input({
					message: 'Locale:',
					default: 'en',
					validate: (value: string) =>
						value.trim().length > 0 || 'Locale is required',
				})
			: undefined;
	const testTargetType =
		specType === 'test-spec'
			? await select<'operation' | 'workflow'>({
					message: 'Test target type:',
					choices: [
						{ name: 'Operation', value: 'operation' },
						{ name: 'Workflow', value: 'workflow' },
					],
				})
			: undefined;
	const referencedTargetKey =
		specType === 'test-spec' ||
		specType === 'visualization' ||
		specType === 'harness-suite'
			? await input({
					message:
						specType === 'visualization'
							? 'Source operation key:'
							: specType === 'harness-suite'
								? 'Scenario key:'
								: 'Target spec key:',
					default:
						specType === 'visualization'
							? `${key.split('.').slice(0, -1).join('.') || 'example'}.query.list`
							: undefined,
					validate: (value: string) =>
						value.trim().length > 0 || 'Referenced key is required',
				})
			: undefined;
	const instructions =
		specType === 'agent'
			? await input({
					message: 'Instructions:',
					default: `You are responsible for ${description.toLowerCase()}.`,
				})
			: undefined;

	const code = renderAdditionalSpec(specType, {
		...baseData,
		translationLocale,
		testTargetType,
		referencedTargetKey,
		instructions,
		targetQuestion,
	});

	const filePath = await writeSpecFile({
		specName: key,
		specType,
		code,
		spinnerText: `Writing ${getAuthoringTargetDefinition(specType).title.toLowerCase()} spec...`,
		options,
		config,
		pathOptions: {
			translationLocale,
		},
	});

	console.log(chalk.cyan('\n✨ Next steps:'));
	console.log(chalk.gray(`  1. Review the generated scaffold in ${filePath}.`));
	console.log(
		chalk.gray(
			'  2. Replace placeholder refs, rules, and TODO text with concrete contract details.'
		)
	);
}

function renderAdditionalSpec(
	specType: AdditionalCreateTarget,
	data: {
		key: string;
		version: string;
		description: string;
		stability: Stability;
		owners: string[];
		tags: string[];
		translationLocale?: string;
		testTargetType?: 'operation' | 'workflow';
		referencedTargetKey?: string;
		instructions?: string;
		targetQuestion?: string;
	}
): string {
	switch (specType) {
		case 'capability':
			return templates.generateCapabilitySpec(data);
		case 'policy':
			return templates.generatePolicySpec(data);
		case 'test-spec':
			return templates.generateTestSpec({
				...data,
				targetType: data.testTargetType ?? 'operation',
				targetKey: data.referencedTargetKey ?? 'example.operation',
			});
		case 'translation':
			return templates.generateTranslationSpec({
				...data,
				locale: data.translationLocale ?? 'en',
			});
		case 'example':
			return templates.generateExampleSpec(data);
		case 'visualization':
			return templates.generateVisualizationSpec({
				...data,
				sourceOperationKey: data.referencedTargetKey ?? 'example.query.list',
			});
		case 'job':
			return templates.generateJobSpec(data);
		case 'agent':
			return templates.generateAgentSpec({
				...data,
				instructions:
					data.instructions ??
					`You are responsible for ${data.description.toLowerCase()}.`,
			});
		case 'product-intent':
			return templates.generateProductIntentSpec({
				...data,
				question:
					data.targetQuestion ??
					`How should we improve ${data.key.split('.').at(-1) ?? data.key}?`,
			});
		case 'pwa-app':
			return templates.generatePwaAppManifestSpec(data);
		case 'harness-scenario':
			return templates.generateHarnessScenarioSpec(data);
		case 'harness-suite':
			return templates.generateHarnessSuiteSpec({
				...data,
				scenarioKey:
					data.referencedTargetKey ?? `${data.key}.scenario.placeholder`,
			});
	}
}
