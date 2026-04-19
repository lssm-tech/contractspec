/**
 * Create command for ContractSpec extension.
 *
 * Provides an interactive wizard to create new contract specifications.
 */

import { loadWorkspaceConfig, templates } from '@contractspec/bundle.workspace';
import type { AuthoringContractSpecType } from '@contractspec/module.workspace';
import * as path from 'path';
import * as vscode from 'vscode';
import { getWorkspaceAdapters } from '../workspace/adapters';
import {
	buildDefaultCreatePath,
	getCreateQuickPickItems,
} from './create-helpers';

type CreateInputs = {
	key: string;
	description: string;
	domain?: string;
	kind?: 'command' | 'query';
	locale?: string;
	targetType?: 'operation' | 'workflow';
	targetKey?: string;
	sourceOperationKey?: string;
	question?: string;
	instructions?: string;
	scenarioKey?: string;
};

type TemplateStability = 'experimental' | 'beta' | 'stable' | 'deprecated';

const STABILITY: TemplateStability = 'experimental';

/**
 * Create a new spec file with wizard.
 */
export async function createSpec(
	outputChannel: vscode.OutputChannel
): Promise<void> {
	const adapters = getWorkspaceAdapters();
	const config = await loadWorkspaceConfig(
		adapters.fs,
		vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
	);

	outputChannel.appendLine('\n=== Creating new spec ===');
	outputChannel.show(true);

	try {
		const specType = await selectSpecType();
		if (!specType) return;

		outputChannel.appendLine(`Spec type: ${specType}`);

		const inputs = await gatherInputs(specType);
		if (!inputs) return;

		const outputPath = await selectOutputLocation(specType, inputs, config);
		if (!outputPath) return;

		outputChannel.appendLine(`Output path: ${outputPath}`);

		const content = generateSpecContent(specType, inputs, templates);
		await adapters.fs.writeFile(outputPath, content);

		outputChannel.appendLine(`✅ Created: ${outputPath}`);
		vscode.window.showInformationMessage(
			`Spec created successfully: ${path.basename(outputPath)}`
		);

		const doc = await vscode.workspace.openTextDocument(outputPath);
		await vscode.window.showTextDocument(doc);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		vscode.window.showErrorMessage(`Failed to create spec: ${message}`);
		outputChannel.appendLine(`\n❌ Error: ${message}`);
	}
}

async function selectSpecType(): Promise<
	AuthoringContractSpecType | undefined
> {
	const selected = await vscode.window.showQuickPick(
		getCreateQuickPickItems(),
		{
			placeHolder: 'Select spec type to create',
			matchOnDescription: true,
			matchOnDetail: true,
		}
	);

	return selected?.value;
}

async function gatherInputs(
	specType: AuthoringContractSpecType
): Promise<CreateInputs | undefined> {
	switch (specType) {
		case 'operation':
			return gatherOperationInputs();
		case 'event':
			return gatherEventInputs();
		case 'presentation':
			return gatherPresentationInputs();
		case 'translation':
			return gatherTranslationInputs();
		case 'test-spec':
			return gatherTestSpecInputs();
		case 'visualization':
			return gatherVisualizationInputs();
		case 'agent':
			return gatherAgentInputs();
		case 'product-intent':
			return gatherProductIntentInputs();
		case 'harness-suite':
			return gatherHarnessSuiteInputs();
		default:
			return gatherGenericInputs(specType);
	}
}

async function gatherOperationInputs(): Promise<CreateInputs | undefined> {
	const kind = await vscode.window.showQuickPick(
		[
			{ label: 'Command', description: 'Write operation', value: 'command' },
			{ label: 'Query', description: 'Read operation', value: 'query' },
		],
		{ placeHolder: 'Is this a command or query?' }
	);
	if (!kind) return undefined;

	const domain = await promptRequired('Domain', 'user');
	if (!domain) return undefined;

	const operationName = await promptRequired(
		'Operation name (camelCase)',
		kind.value === 'command' ? 'createItem' : 'getItem'
	);
	if (!operationName) return undefined;

	const description = await promptDescription();
	return {
		key: `${domain}.${operationName}`,
		kind: kind.value as 'command' | 'query',
		description,
		domain,
	};
}

async function gatherEventInputs(): Promise<CreateInputs | undefined> {
	const domain = await promptRequired('Domain', 'user');
	if (!domain) return undefined;
	const eventName = await promptRequired('Event name', 'created');
	if (!eventName) return undefined;
	return {
		key: `${domain}.${eventName}`,
		description: await promptDescription(),
		domain,
	};
}

async function gatherPresentationInputs(): Promise<CreateInputs | undefined> {
	const componentName = await promptRequired(
		'Component name (PascalCase)',
		'UserProfileCard'
	);
	if (!componentName) return undefined;
	return {
		key: componentName,
		description: await promptDescription(),
	};
}

async function gatherTranslationInputs(): Promise<CreateInputs | undefined> {
	const base = await gatherGenericInputs('translation');
	if (!base) return undefined;
	const locale = await promptRequired('Locale', 'en');
	if (!locale) return undefined;
	return { ...base, locale };
}

async function gatherTestSpecInputs(): Promise<CreateInputs | undefined> {
	const base = await gatherGenericInputs('test-spec');
	if (!base) return undefined;
	const targetType = await vscode.window.showQuickPick(
		[
			{ label: 'Operation', value: 'operation' },
			{ label: 'Workflow', value: 'workflow' },
		],
		{ placeHolder: 'What does this test spec target?' }
	);
	if (!targetType) return undefined;
	const targetKey = await promptRequired('Target key', 'example.operation');
	if (!targetKey) return undefined;
	return {
		...base,
		targetType: targetType.value as 'operation' | 'workflow',
		targetKey,
	};
}

async function gatherVisualizationInputs(): Promise<CreateInputs | undefined> {
	const base = await gatherGenericInputs('visualization');
	if (!base) return undefined;
	const sourceOperationKey = await promptRequired(
		'Source operation key',
		'analytics.query.list'
	);
	if (!sourceOperationKey) return undefined;
	return { ...base, sourceOperationKey };
}

async function gatherAgentInputs(): Promise<CreateInputs | undefined> {
	const base = await gatherGenericInputs('agent');
	if (!base) return undefined;
	const instructions = await promptRequired(
		'Instructions',
		`You are responsible for ${base.description.toLowerCase()}.`
	);
	if (!instructions) return undefined;
	return { ...base, instructions };
}

async function gatherProductIntentInputs(): Promise<CreateInputs | undefined> {
	const base = await gatherGenericInputs('product-intent');
	if (!base) return undefined;
	const question = await promptRequired(
		'Discovery question',
		`How should we improve ${base.key.split('.').at(-1) ?? base.key}?`
	);
	if (!question) return undefined;
	return { ...base, question };
}

async function gatherHarnessSuiteInputs(): Promise<CreateInputs | undefined> {
	const base = await gatherGenericInputs('harness-suite');
	if (!base) return undefined;
	const scenarioKey = await promptRequired(
		'Scenario key',
		`${base.key}.scenario`
	);
	if (!scenarioKey) return undefined;
	return { ...base, scenarioKey };
}

async function gatherGenericInputs(
	specType: AuthoringContractSpecType
): Promise<CreateInputs | undefined> {
	const key = await promptRequired('Spec key', `my.${specType}`);
	if (!key) return undefined;
	return {
		key,
		description: await promptDescription(),
		domain: key.split('.')[0] ?? specType,
	};
}

async function selectOutputLocation(
	specType: AuthoringContractSpecType,
	inputs: CreateInputs,
	config: Awaited<ReturnType<typeof loadWorkspaceConfig>>
): Promise<string | undefined> {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		vscode.window.showErrorMessage('No workspace folder open');
		return undefined;
	}

	const workspaceRoot = workspaceFolders[0].uri.fsPath;
	const defaultPath = buildDefaultCreatePath(
		workspaceRoot,
		config.outputDir,
		specType,
		inputs,
		config.conventions
	);
	const defaultDir = path.dirname(defaultPath);

	const useDefault = await vscode.window.showQuickPick(
		[
			{ label: 'Use default location', value: true },
			{ label: 'Choose custom location', value: false },
		],
		{ placeHolder: `Default: ${path.relative(workspaceRoot, defaultPath)}` }
	);
	if (useDefault === undefined) return undefined;

	if (useDefault.value) {
		const adapters = getWorkspaceAdapters();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await (adapters.fs as any).ensureDir(defaultDir);
		return defaultPath;
	}

	const uri = await vscode.window.showSaveDialog({
		defaultUri: vscode.Uri.file(defaultPath),
		filters: { TypeScript: ['ts'] },
	});
	return uri?.fsPath;
}

function generateSpecContent(
	specType: AuthoringContractSpecType,
	inputs: CreateInputs,
	specTemplates: typeof templates
): string {
	switch (specType) {
		case 'operation':
			return specTemplates.generateOperationSpec({
				name: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				goal: '',
				context: '',
				stability: STABILITY,
				owners: [],
				tags: inputs.domain ? [inputs.domain] : [],
				kind: inputs.kind ?? 'query',
				hasInput: true,
				hasOutput: true,
				auth: 'user',
				flags: [],
				emitsEvents: false,
			});
		case 'event':
			return specTemplates.generateEventSpec({
				name: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: inputs.domain ? [inputs.domain] : [],
				stability: STABILITY,
				piiFields: [],
			});
		case 'presentation':
			return specTemplates.generatePresentationSpec({
				name: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: [],
				stability: STABILITY,
				presentationKind: 'web_component',
			});
		case 'data-view':
			return specTemplates.generateDataViewSpec({
				name: inputs.key,
				version: '1.0.0',
				title: toTitleCase(inputs.key),
				description: inputs.description,
				domain: inputs.domain ?? 'app',
				owners: [],
				tags: [],
				stability: STABILITY,
				entity: 'entity',
				kind: 'list',
				primaryOperation: { name: 'todo.query.list', version: '1.0.0' },
				fields: [],
			});
		case 'workflow':
			return specTemplates.generateWorkflowSpec({
				name: inputs.key,
				version: '1.0.0',
				title: toTitleCase(inputs.key),
				description: inputs.description,
				domain: inputs.domain ?? 'app',
				owners: [],
				tags: [],
				stability: STABILITY,
				steps: [],
				transitions: [],
				policyFlags: [],
			});
		case 'migration':
			return specTemplates.generateMigrationSpec({
				name: inputs.key,
				version: '1.0.0',
				title: toTitleCase(inputs.key),
				description: inputs.description,
				domain: inputs.domain ?? 'app',
				owners: [],
				tags: [],
				stability: STABILITY,
				dependencies: [],
				up: [],
			});
		case 'telemetry':
			return specTemplates.generateTelemetrySpec({
				name: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				domain: inputs.domain ?? 'app',
				owners: [],
				tags: [],
				stability: STABILITY,
				events: [],
			});
		case 'experiment':
			return specTemplates.generateExperimentSpec({
				name: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				domain: inputs.domain ?? 'app',
				owners: [],
				tags: [],
				stability: STABILITY,
				controlVariant: 'control',
				variants: [],
				allocation: { type: 'random' },
			});
		case 'app-config':
			return specTemplates.generateAppBlueprintSpec({
				key: inputs.key,
				version: '1.0.0',
				title: toTitleCase(inputs.key),
				description: inputs.description,
				domain: inputs.domain ?? 'app',
				owners: [],
				tags: [],
				stability: STABILITY,
				appId: inputs.key,
				capabilitiesEnabled: [],
				capabilitiesDisabled: [],
				featureIncludes: [],
				featureExcludes: [],
				dataViews: [],
				workflows: [],
				policyRefs: [],
				themeFallbacks: [],
				activeExperiments: [],
				pausedExperiments: [],
				featureFlags: [],
				routes: [],
			});
		case 'integration':
			return specTemplates.generateIntegrationSpec({
				name: inputs.key,
				version: '1.0.0',
				title: toTitleCase(inputs.key),
				description: inputs.description,
				domain: inputs.domain ?? 'app',
				displayName: toTitleCase(inputs.key),
				category: 'custom',
				owners: [],
				tags: [],
				stability: STABILITY,
				supportedModes: ['managed'],
				capabilitiesProvided: [],
				capabilitiesRequired: [],
				configFields: [],
				secretFields: [],
				healthCheckMethod: 'ping',
			});
		case 'knowledge':
			return specTemplates.generateKnowledgeSpaceSpec({
				name: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: [],
				stability: STABILITY,
				title: toTitleCase(inputs.key),
				domain: inputs.domain ?? 'knowledge',
				displayName: toTitleCase(inputs.key),
				category: 'operational',
				retention: { ttlDays: null, archiveAfterDays: undefined },
				trustLevel: 'medium',
				automationWritable: false,
			});
		case 'capability':
			return specTemplates.generateCapabilitySpec({
				key: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: [],
				stability: STABILITY,
				domain: inputs.domain,
			});
		case 'policy':
			return specTemplates.generatePolicySpec({
				key: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: [],
				stability: STABILITY,
				domain: inputs.domain,
			});
		case 'test-spec':
			return specTemplates.generateTestSpec({
				key: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: [],
				stability: STABILITY,
				domain: inputs.domain,
				targetType: inputs.targetType ?? 'operation',
				targetKey: inputs.targetKey ?? 'todo.operation',
			});
		case 'translation':
			return specTemplates.generateTranslationSpec({
				key: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: [],
				stability: STABILITY,
				domain: inputs.domain,
				locale: inputs.locale ?? 'en',
			});
		case 'example':
			return specTemplates.generateExampleSpec({
				key: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: [],
				stability: STABILITY,
				domain: inputs.domain,
			});
		case 'visualization':
			return specTemplates.generateVisualizationSpec({
				key: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: [],
				stability: STABILITY,
				domain: inputs.domain,
				sourceOperationKey: inputs.sourceOperationKey ?? 'analytics.query.list',
			});
		case 'job':
			return specTemplates.generateJobSpec({
				key: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: [],
				stability: STABILITY,
				domain: inputs.domain,
			});
		case 'agent':
			return specTemplates.generateAgentSpec({
				key: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: [],
				stability: STABILITY,
				instructions:
					inputs.instructions ??
					`You are responsible for ${inputs.description.toLowerCase()}.`,
			});
		case 'product-intent':
			return specTemplates.generateProductIntentSpec({
				key: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: [],
				stability: STABILITY,
				domain: inputs.domain,
				question:
					inputs.question ??
					`How should we improve ${inputs.key.split('.').at(-1) ?? inputs.key}?`,
			});
		case 'harness-scenario':
			return specTemplates.generateHarnessScenarioSpec({
				key: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: [],
				stability: STABILITY,
				domain: inputs.domain,
			});
		case 'harness-suite':
			return specTemplates.generateHarnessSuiteSpec({
				key: inputs.key,
				version: '1.0.0',
				description: inputs.description,
				owners: [],
				tags: [],
				stability: STABILITY,
				domain: inputs.domain,
				scenarioKey: inputs.scenarioKey ?? `${inputs.key}.scenario`,
			});
	}

	throw new Error(`Unsupported create target: ${specType}`);
}

async function promptRequired(
	prompt: string,
	placeHolder: string
): Promise<string | undefined> {
	return vscode.window.showInputBox({
		prompt,
		placeHolder,
		validateInput: (value) =>
			value.trim().length > 0 ? null : `${prompt} is required`,
	});
}

async function promptDescription(): Promise<string> {
	return (
		(await vscode.window.showInputBox({
			prompt: 'Description',
			placeHolder: 'Short description',
		})) ?? ''
	);
}

function toTitleCase(value: string): string {
	return value
		.split(/[-_.]/)
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(' ');
}
