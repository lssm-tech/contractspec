import type { IntegrationOwnershipMode, IntegrationSpec } from './spec';

export type CredentialValidationStrategy =
	| 'static-schema'
	| 'provider-health'
	| 'byok-lifecycle'
	| 'custom';

export interface IntegrationCredentialFieldRef {
	key: string;
	required?: boolean;
	description?: string;
	envVar?: string;
}

export interface IntegrationCredentialAlias {
	logicalKey: string;
	envVar: string;
	targetId?: string;
	public?: boolean;
}

export interface IntegrationCredentialRotationPolicy {
	supported?: boolean;
	recommendedIntervalDays?: number;
}

export interface IntegrationCredentialModeManifest {
	mode: IntegrationOwnershipMode;
	configFields?: IntegrationCredentialFieldRef[];
	secretFields?: IntegrationCredentialFieldRef[];
	envAliases?: IntegrationCredentialAlias[];
	allowedSecretProviders?: string[];
	validationStrategy?: CredentialValidationStrategy;
	rotation?: IntegrationCredentialRotationPolicy;
	setupSteps?: string[];
	docsUrl?: string;
}

export interface IntegrationCredentialManifest {
	modes?: Partial<
		Record<IntegrationOwnershipMode, IntegrationCredentialModeManifest>
	>;
	exempt?: boolean;
	exemptionReason?: string;
}

export function getIntegrationCredentialManifest(
	spec: IntegrationSpec
): IntegrationCredentialManifest {
	return spec.credentialManifest ?? buildLegacyCredentialManifest(spec);
}

export function getIntegrationCredentialRequirements(
	spec: IntegrationSpec,
	mode: IntegrationOwnershipMode
): IntegrationCredentialModeManifest | undefined {
	if (!spec.supportedModes.includes(mode)) return undefined;
	return getIntegrationCredentialManifest(spec).modes?.[mode];
}

export function integrationHasCredentialCoverage(
	spec: IntegrationSpec
): boolean {
	const manifest = getIntegrationCredentialManifest(spec);
	if (manifest.exempt) return true;
	return spec.supportedModes.every((mode) => Boolean(manifest.modes?.[mode]));
}

export function buildLegacyCredentialManifest(
	spec: IntegrationSpec
): IntegrationCredentialManifest {
	const requiredConfig = extractJsonSchemaFields(spec.configSchema.schema);
	const requiredSecrets = extractJsonSchemaFields(spec.secretSchema.schema);
	const modes: IntegrationCredentialManifest['modes'] = {};

	for (const mode of spec.supportedModes) {
		modes[mode] = {
			mode,
			configFields: requiredConfig,
			secretFields: requiredSecrets,
			validationStrategy:
				mode === 'byok' && spec.byokSetup ? 'byok-lifecycle' : 'static-schema',
			rotation: {
				supported:
					mode === 'byok'
						? spec.byokSetup?.keyRotationSupported === true
						: false,
			},
			setupSteps:
				mode === 'byok'
					? (spec.byokSetup?.provisioningSteps ??
						(spec.byokSetup?.setupInstructions
							? [spec.byokSetup.setupInstructions]
							: undefined))
					: undefined,
			docsUrl: spec.docsUrl,
		};
	}

	return { modes };
}

function extractJsonSchemaFields(
	schema: unknown
): IntegrationCredentialFieldRef[] {
	if (!isRecord(schema)) return [];
	const required = Array.isArray(schema.required)
		? new Set(
				schema.required.filter(
					(item): item is string => typeof item === 'string'
				)
			)
		: new Set<string>();
	const properties = isRecord(schema.properties) ? schema.properties : {};

	return Object.entries(properties).map(([key, value]) => ({
		key,
		required: required.has(key),
		description:
			isRecord(value) && typeof value.description === 'string'
				? value.description
				: undefined,
	}));
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
