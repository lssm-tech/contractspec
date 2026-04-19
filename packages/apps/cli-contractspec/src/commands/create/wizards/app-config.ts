import { confirm, input, select } from '@inquirer/prompts';
import type {
	AppBlueprintSpecData,
	AppConfigFeatureFlagData,
	AppConfigMappingData,
	AppRouteConfigData,
	Stability,
} from '../../../types';

const SEMVER_PATTERN = /^\d+\.\d+\.\d+([-.][a-z0-9.]+)?$/i;

export async function appConfigWizard(): Promise<AppBlueprintSpecData> {
	const key = await input({
		message: 'Blueprint key (e.g., "tenant.app"):',
		validate: required,
	});

	const version = await input({
		message: 'Version:',
		default: '1.0.0',
		validate: validateVersion,
	});

	const title = await input({
		message: 'Title:',
		default: `${key} config`,
	});

	const description = await input({
		message: 'Description:',
		default: 'Application configuration',
	});

	const domain = await input({
		message: 'Domain/bounded context:',
		default: key.split('.')[0] ?? 'core',
		validate: required,
	});

	const ownersInput = await input({
		message: 'Owners (comma-separated):',
		default: '@team.platform',
		validate: validateOwners,
	});

	const tagsInput = await input({
		message: 'Tags (comma-separated):',
		default: 'app-config',
	});

	const stability = await select<Stability>({
		message: 'Stability:',
		choices: [
			{ name: 'Experimental', value: 'experimental' },
			{ name: 'Beta', value: 'beta' },
			{ name: 'Stable', value: 'stable' },
			{ name: 'Deprecated', value: 'deprecated' },
		],
		default: 'experimental',
	});

	const appId = await input({
		message: 'Application id:',
		default: key.split('.')[1] ?? 'app',
		validate: required,
	});

	const capabilitiesEnabled = await collectList(
		'Enable capabilities (comma-separated keys, optional):'
	);
	const capabilitiesDisabled = await collectList(
		'Disable capabilities (comma-separated keys, optional):'
	);
	const featureIncludes = await collectList(
		'Include features (comma-separated feature keys, optional):'
	);
	const featureExcludes = await collectList(
		'Exclude features (comma-separated feature keys, optional):'
	);

	const dataViews = await collectMappings('Add data view slot?');
	const workflows = await collectMappings('Add workflow slot?');
	const policyRefs = await collectVersionedRefs('Add policy reference?');
	const theme = await collectPrimaryTheme();
	const themeFallbacks = await collectThemeFallbacks();
	const telemetry = await collectOptionalVersionedRef('Bind telemetry spec?');
	const activeExperiments = await collectVersionedRefs('Activate experiments?');
	const pausedExperiments = await collectVersionedRefs('Pause experiments?');
	const featureFlags = await collectFeatureFlags();
	const routes = await collectRoutes();

	const notes = await input({
		message: 'Notes (optional):',
		default: '',
	});

	return {
		key,
		version,
		title,
		description,
		domain,
		owners: splitList(ownersInput),
		tags: splitList(tagsInput),
		stability,
		appId,
		capabilitiesEnabled,
		capabilitiesDisabled,
		featureIncludes,
		featureExcludes,
		dataViews,
		workflows,
		policyRefs,
		theme,
		themeFallbacks,
		telemetry,
		activeExperiments,
		pausedExperiments,
		featureFlags,
		routes,
		notes: notes || undefined,
	};
}

async function collectMappings(
	promptMessage: string
): Promise<AppConfigMappingData[]> {
	const mappings: AppConfigMappingData[] = [];
	let add = await confirm({ message: promptMessage, default: false });
	while (add) {
		const slot = await input({
			message: 'Slot key (e.g., "dashboard"):',
			validate: required,
		});
		const key = await input({
			message: 'Spec key:',
			validate: required,
		});
		const version = await collectOptionalVersion('Spec version (optional):');
		mappings.push({
			slot,
			key,
			version,
		});
		add = await confirm({ message: promptMessage, default: false });
	}
	return mappings;
}

async function collectVersionedRefs(
	prompt: string
): Promise<Array<{ key: string; version?: string }>> {
	const refs: Array<{ key: string; version?: string }> = [];
	let add = await confirm({ message: prompt, default: false });
	while (add) {
		const key = await input({
			message: 'Spec key:',
			validate: required,
		});
		const version = await collectOptionalVersion('Spec version (optional):');
		refs.push({ key, version });
		add = await confirm({
			message: 'Add another reference?',
			default: false,
		});
	}
	return refs;
}

async function collectPrimaryTheme(): Promise<AppBlueprintSpecData['theme']> {
	const attach = await confirm({
		message: 'Bind a primary theme?',
		default: true,
	});
	if (!attach) return undefined;

	const key = await input({
		message: 'Theme key:',
		validate: required,
	});
	const version = await input({
		message: 'Theme version:',
		default: '1.0.0',
		validate: validateVersion,
	});
	return { key, version };
}

async function collectThemeFallbacks(): Promise<
	Array<{ key: string; version: string }>
> {
	const fallbacks: Array<{ key: string; version: string }> = [];
	let add = await confirm({
		message: 'Add theme fallback?',
		default: false,
	});
	while (add) {
		const key = await input({
			message: 'Fallback theme key:',
			validate: required,
		});
		const version = await input({
			message: 'Fallback theme version:',
			default: '1.0.0',
			validate: validateVersion,
		});
		fallbacks.push({ key, version });
		add = await confirm({
			message: 'Add another fallback?',
			default: false,
		});
	}
	return fallbacks;
}

async function collectOptionalVersionedRef(
	message: string
): Promise<{ key: string; version?: string } | undefined> {
	const attach = await confirm({ message, default: false });
	if (!attach) return undefined;

	const key = await input({
		message: 'Spec key:',
		validate: required,
	});
	const version = await collectOptionalVersion('Spec version (optional):');
	return { key, version };
}

async function collectFeatureFlags(): Promise<AppConfigFeatureFlagData[]> {
	const flags: AppConfigFeatureFlagData[] = [];
	let add = await confirm({
		message: 'Define feature flag overrides?',
		default: false,
	});
	while (add) {
		const key = await input({
			message: 'Flag key:',
			validate: required,
		});
		const enabled = await confirm({
			message: 'Enabled?',
			default: true,
		});
		const variant = await input({
			message: 'Variant (optional):',
			default: '',
		});
		const description = await input({
			message: 'Description (optional):',
			default: '',
		});
		flags.push({
			key,
			enabled,
			variant: variant || undefined,
			description: description || undefined,
		});
		add = await confirm({
			message: 'Add another feature flag?',
			default: false,
		});
	}
	return flags;
}

async function collectRoutes(): Promise<AppRouteConfigData[]> {
	const routes: AppRouteConfigData[] = [];
	let add = await confirm({
		message: 'Configure application routes?',
		default: false,
	});
	while (add) {
		const path = await input({
			message: 'Route path (e.g., "/dashboard"):',
			validate: required,
		});
		const label = await input({
			message: 'Route label (optional):',
			default: '',
		});
		const dataView = await input({
			message: 'Data view slot (optional):',
			default: '',
		});
		const workflow = await input({
			message: 'Workflow slot (optional):',
			default: '',
		});
		const guardKey = await input({
			message: 'Guard policy key (optional):',
			default: '',
		});
		const guardVersion = guardKey.trim()
			? await collectOptionalVersion('Guard policy version (optional):')
			: undefined;
		const featureFlag = await input({
			message: 'Feature flag key (optional):',
			default: '',
		});
		const experimentKey = await input({
			message: 'Experiment key (optional):',
			default: '',
		});
		const experimentVersion = experimentKey.trim()
			? await collectOptionalVersion('Experiment version (optional):')
			: undefined;

		routes.push({
			path,
			label: label || undefined,
			dataView: dataView || undefined,
			workflow: workflow || undefined,
			guardKey: guardKey || undefined,
			guardVersion,
			featureFlag: featureFlag || undefined,
			experimentKey: experimentKey || undefined,
			experimentVersion,
		});
		add = await confirm({
			message: 'Add another route?',
			default: false,
		});
	}
	return routes;
}

async function collectList(message: string): Promise<string[]> {
	const answer = await input({
		message,
		default: '',
	});
	return splitList(answer);
}

async function collectOptionalVersion(
	message: string
): Promise<string | undefined> {
	const version = await input({
		message,
		default: '',
		validate: optionalVersion,
	});
	return version.trim() || undefined;
}

function splitList(value: string): string[] {
	return value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

function required(value: string) {
	return value.trim().length > 0 || 'Value is required';
}

function validateVersion(value: string) {
	return SEMVER_PATTERN.test(value) || 'Version must look like 1.0.0';
}

function optionalVersion(value: string) {
	return value.trim().length === 0 || validateVersion(value);
}

function validateOwners(value: string) {
	const owners = splitList(value);
	return owners.length > 0 || 'At least one owner is required';
}
