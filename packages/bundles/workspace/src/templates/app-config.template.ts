import type { AppBlueprintSpecData } from '../types';

export function generateAppBlueprintSpec(data: AppBlueprintSpecData): string {
	const exportName =
		toPascalCase(data.key.split('.').pop() ?? 'App') + 'AppConfig';

	const capabilitiesSection = buildCapabilitiesSection(data);
	const featuresSection = buildFeaturesSection(data);
	const dataViewsSection = buildMappingSection('dataViews', data.dataViews);
	const workflowsSection = buildMappingSection('workflows', data.workflows);
	const policiesSection = buildPolicySection(data);
	const themeSection = buildThemeSection(data);
	const telemetrySection = buildTelemetrySection(data);
	const experimentsSection = buildExperimentsSection(data);
	const flagsSection = buildFeatureFlagsSection(data);
	const routesSection = buildRoutesSection(data);
	const notesSection = data.notes
		? `  notes: '${escapeString(data.notes)}',\n`
		: '';

	return `import type { AppBlueprintSpec } from '@contractspec/lib.contracts-spec/app-config';

export const ${exportName}: AppBlueprintSpec = {
  meta: {
    key: '${escapeString(data.key)}',
    version: '${data.version}',
    title: '${escapeString(data.title)}',
    description: '${escapeString(data.description)}',
    domain: '${escapeString(data.domain)}',
    owners: [${data.owners.map((owner) => `'${escapeString(owner)}'`).join(', ')}],
    tags: [${data.tags.map((tag) => `'${escapeString(tag)}'`).join(', ')}],
    stability: '${data.stability}',
    appId: '${escapeString(data.appId)}',
  },
${capabilitiesSection}${featuresSection}${dataViewsSection}${workflowsSection}${policiesSection}${themeSection}${telemetrySection}${experimentsSection}${flagsSection}${routesSection}${notesSection}};\n`;
}

function buildCapabilitiesSection(data: AppBlueprintSpecData): string {
	if (
		data.capabilitiesEnabled.length === 0 &&
		data.capabilitiesDisabled.length === 0
	) {
		return '';
	}
	const enabled =
		data.capabilitiesEnabled.length > 0
			? `    enabled: [${data.capabilitiesEnabled.map((key) => formatCapabilityRef(key)).join(', ')}],\n`
			: '';
	const disabled =
		data.capabilitiesDisabled.length > 0
			? `    disabled: [${data.capabilitiesDisabled.map((key) => formatCapabilityRef(key)).join(', ')}],\n`
			: '';
	return `  capabilities: {\n${enabled}${disabled}  },\n`;
}

function buildFeaturesSection(data: AppBlueprintSpecData): string {
	if (data.featureIncludes.length === 0 && data.featureExcludes.length === 0) {
		return '';
	}
	const include =
		data.featureIncludes.length > 0
			? `    include: [${data.featureIncludes.map((key) => `{ key: '${escapeString(key)}' }`).join(', ')}],\n`
			: '';
	const exclude =
		data.featureExcludes.length > 0
			? `    exclude: [${data.featureExcludes.map((key) => `{ key: '${escapeString(key)}' }`).join(', ')}],\n`
			: '';
	return `  features: {\n${include}${exclude}  },\n`;
}

function buildMappingSection(
	prop: 'dataViews' | 'workflows',
	mappings: AppBlueprintSpecData['dataViews']
): string {
	if (mappings.length === 0) return '';
	const body = mappings
		.map(
			(mapping) => `    ${mapping.slot}: {
      key: '${escapeString(mapping.key)}'${
				mapping.version ? `,\n      version: '${mapping.version}'` : ''
			}
    }`
		)
		.join(',\n');
	return `  ${prop}: {\n${body}\n  },\n`;
}

function buildPolicySection(data: AppBlueprintSpecData): string {
	if (data.policyRefs.length === 0) return '';
	const entries = data.policyRefs
		.map(
			(policy) => `    {
      key: '${escapeString(policy.key)}'${
				policy.version ? `,\n      version: '${policy.version}'` : ''
			}
    }`
		)
		.join(',\n');
	return `  policies: [\n${entries}\n  ],\n`;
}

function buildThemeSection(data: AppBlueprintSpecData): string {
	if (!data.theme) return '';
	const primary = `    primary: { key: '${escapeString(data.theme.key)}', version: '${data.theme.version}' },\n`;
	const fallbacks =
		data.themeFallbacks.length > 0
			? `    fallbacks: [${data.themeFallbacks
					.map(
						(theme) =>
							`{ key: '${escapeString(theme.key)}', version: '${theme.version}' }`
					)
					.join(', ')}],\n`
			: '';
	return `  theme: {\n${primary}${fallbacks}  },\n`;
}

function buildTelemetrySection(data: AppBlueprintSpecData): string {
	if (!data.telemetry) return '';
	return `  telemetry: {
    spec: {
      key: '${escapeString(data.telemetry.key)}'${
				data.telemetry.version
					? `,\n      version: '${data.telemetry.version}'`
					: ''
			}
    },
  },\n`;
}

function buildExperimentsSection(data: AppBlueprintSpecData): string {
	if (
		data.activeExperiments.length === 0 &&
		data.pausedExperiments.length === 0
	) {
		return '';
	}
	const active =
		data.activeExperiments.length > 0
			? `    active: [${data.activeExperiments.map((exp) => formatExperimentRef(exp)).join(', ')}],\n`
			: '';
	const paused =
		data.pausedExperiments.length > 0
			? `    paused: [${data.pausedExperiments.map((exp) => formatExperimentRef(exp)).join(', ')}],\n`
			: '';
	return `  experiments: {\n${active}${paused}  },\n`;
}

function buildFeatureFlagsSection(data: AppBlueprintSpecData): string {
	if (data.featureFlags.length === 0) return '';
	const flags = data.featureFlags
		.map(
			(flag) => `    {
      key: '${escapeString(flag.key)}',
      enabled: ${flag.enabled},
      ${flag.variant ? `variant: '${escapeString(flag.variant)}',` : ''}
      ${flag.description ? `description: '${escapeString(flag.description)}',` : ''}
    }`
		)
		.join(',\n');
	return `  featureFlags: [\n${flags}\n  ],\n`;
}

function buildRoutesSection(data: AppBlueprintSpecData): string {
	if (data.routes.length === 0) return '';
	const routes = data.routes
		.map((route) => {
			const entries = [
				`path: '${escapeString(route.path)}'`,
				route.label ? `label: '${escapeString(route.label)}'` : null,
				route.dataView ? `dataView: '${escapeString(route.dataView)}'` : null,
				route.workflow ? `workflow: '${escapeString(route.workflow)}'` : null,
				route.guardKey
					? `guard: { key: '${escapeString(route.guardKey)}'${
							route.guardVersion ? `, version: '${route.guardVersion}'` : ''
						} }`
					: null,
				route.featureFlag
					? `featureFlag: '${escapeString(route.featureFlag)}'`
					: null,
				route.experimentKey
					? `experiment: { key: '${escapeString(route.experimentKey)}'${
							route.experimentVersion
								? `, version: '${route.experimentVersion}'`
								: ''
						} }`
					: null,
			].filter(Boolean);
			return `    { ${entries.join(', ')} }`;
		})
		.join(',\n');
	return `  routes: [\n${routes}\n  ],\n`;
}

function formatCapabilityRef(key: string): string {
	return `{ key: '${escapeString(key)}' }`;
}

function formatExperimentRef(exp: { key: string; version?: string }): string {
	const version = exp.version ? `, version: '${exp.version}'` : '';
	return `{ key: '${escapeString(exp.key)}'${version} }`;
}

function toPascalCase(value: string): string {
	return value
		.split(/[-_.]/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}

function escapeString(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
