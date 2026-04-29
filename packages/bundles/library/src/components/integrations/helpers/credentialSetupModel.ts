import type {
	IntegrationCredentialFieldRef,
	IntegrationCredentialManifest,
	IntegrationCredentialModeManifest,
	IntegrationOwnershipMode,
	IntegrationSpec,
} from '@contractspec/lib.contracts-integrations';
import { getIntegrationCredentialManifest } from '@contractspec/lib.contracts-integrations';
import type { EnvironmentConfig } from '@contractspec/lib.contracts-spec/workspace-config/environment';
import { buildAliases } from './credentialSetupAliases';

export type CredentialSetupFieldKind = 'config' | 'secret';
export type CredentialSetupFieldStatus = 'configured' | 'missing' | 'optional';
export type CredentialSetupWarningLevel = 'info' | 'warning' | 'error';

export interface CredentialSetupFieldRow {
	kind: CredentialSetupFieldKind;
	key: string;
	label: string;
	description?: string;
	required: boolean;
	status: CredentialSetupFieldStatus;
	secretRef?: string;
	envVar?: string;
}

export interface CredentialSetupAliasRow {
	logicalKey: string;
	envName: string;
	targetId?: string;
	targetLabel?: string;
	profile?: string;
	framework?: string;
	public: boolean;
	warning?: string;
}

export interface CredentialSetupWarning {
	level: CredentialSetupWarningLevel;
	message: string;
	fieldKey?: string;
}

export interface CredentialSetupModeOption {
	mode: IntegrationOwnershipMode;
	label: string;
	available: boolean;
	fieldCount: number;
	missingRequiredCount: number;
	docsUrl?: string;
	setupSteps?: string[];
}

export interface IntegrationCredentialSetupModel {
	selectedMode: IntegrationOwnershipMode;
	modes: CredentialSetupModeOption[];
	fields: CredentialSetupFieldRow[];
	aliases: CredentialSetupAliasRow[];
	warnings: CredentialSetupWarning[];
}

export interface BuildIntegrationCredentialSetupModelInput {
	integration?: IntegrationSpec;
	credentialManifest?: IntegrationCredentialManifest;
	supportedModes?: IntegrationOwnershipMode[];
	selectedMode?: IntegrationOwnershipMode;
	environment?: EnvironmentConfig;
	configValues?: Record<string, unknown>;
	secretRefs?: Record<string, string | undefined>;
	targetIds?: string[];
	profile?: string;
}

export function buildIntegrationCredentialSetupModel(
	input: BuildIntegrationCredentialSetupModelInput
): IntegrationCredentialSetupModel {
	const manifest = input.credentialManifest ?? manifestFromIntegration(input);
	const supportedModes = resolveSupportedModes(input, manifest);
	const selectedMode = input.selectedMode ?? supportedModes[0] ?? 'managed';
	const modeManifest = manifest.modes?.[selectedMode];
	const secretKeys = new Set(
		(modeManifest?.secretFields ?? []).map((f) => f.key)
	);
	const warnings: CredentialSetupWarning[] = [];
	const fields = buildFields(modeManifest, input, warnings);
	const aliases = buildAliases(modeManifest, input, secretKeys, warnings);
	const modes = supportedModes.map((mode) =>
		buildModeOption(mode, manifest.modes?.[mode], input)
	);

	return { selectedMode, modes, fields, aliases, warnings };
}

function manifestFromIntegration(
	input: BuildIntegrationCredentialSetupModelInput
) {
	return input.integration
		? getIntegrationCredentialManifest(input.integration)
		: {};
}

function resolveSupportedModes(
	input: BuildIntegrationCredentialSetupModelInput,
	manifest: IntegrationCredentialManifest
): IntegrationOwnershipMode[] {
	return (
		input.supportedModes ??
		input.integration?.supportedModes ??
		(Object.keys(manifest.modes ?? {}) as IntegrationOwnershipMode[])
	);
}

function buildModeOption(
	mode: IntegrationOwnershipMode,
	manifest: IntegrationCredentialModeManifest | undefined,
	input: BuildIntegrationCredentialSetupModelInput
): CredentialSetupModeOption {
	const fields = [
		...(manifest?.configFields ?? []),
		...(manifest?.secretFields ?? []),
	];
	const missingRequiredCount = fields.filter(
		(field) => field.required && !hasConfiguredField(field, input)
	).length;
	return {
		mode,
		label: mode === 'byok' ? 'BYOK' : 'Managed',
		available: Boolean(manifest),
		fieldCount: fields.length,
		missingRequiredCount,
		docsUrl: manifest?.docsUrl,
		setupSteps: manifest?.setupSteps,
	};
}

function buildFields(
	manifest: IntegrationCredentialModeManifest | undefined,
	input: BuildIntegrationCredentialSetupModelInput,
	warnings: CredentialSetupWarning[]
) {
	const configRows = (manifest?.configFields ?? []).map((field) =>
		buildFieldRow('config', field, input, warnings)
	);
	const secretRows = (manifest?.secretFields ?? []).map((field) =>
		buildFieldRow('secret', field, input, warnings)
	);
	return [...configRows, ...secretRows];
}

function buildFieldRow(
	kind: CredentialSetupFieldKind,
	field: IntegrationCredentialFieldRef,
	input: BuildIntegrationCredentialSetupModelInput,
	warnings: CredentialSetupWarning[]
): CredentialSetupFieldRow {
	const configured = hasConfiguredField(field, input);
	const secretRef =
		kind === 'secret' ? safeSecretRef(field, input, warnings) : undefined;
	if (kind === 'secret' && field.required === true && !configured) {
		warnings.push({
			level: 'warning',
			fieldKey: field.key,
			message: `${toLabel(field.key)} is required for BYOK secret reference setup.`,
		});
	}
	return {
		kind,
		key: field.key,
		label: toLabel(field.key),
		description: field.description,
		required: field.required === true,
		status: configured ? 'configured' : field.required ? 'missing' : 'optional',
		secretRef,
		envVar: field.envVar,
	};
}

function hasConfiguredField(
	field: IntegrationCredentialFieldRef,
	input: BuildIntegrationCredentialSetupModelInput
) {
	const configValue = input.configValues?.[field.key];
	const secretRef =
		input.secretRefs?.[field.key] ?? input.secretRefs?.[field.envVar ?? ''];
	return hasPresence(configValue) || hasPresence(secretRef);
}

function safeSecretRef(
	field: IntegrationCredentialFieldRef,
	input: BuildIntegrationCredentialSetupModelInput,
	warnings: CredentialSetupWarning[]
) {
	const value =
		input.secretRefs?.[field.key] ?? input.secretRefs?.[field.envVar ?? ''];
	if (!value) return undefined;
	if (
		/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ||
		/^[A-Z][A-Z0-9_]*$/.test(value)
	) {
		return value;
	}
	warnings.push({
		level: 'warning',
		fieldKey: field.key,
		message: `${toLabel(field.key)} has a value, but it is hidden because it is not a secret reference.`,
	});
	return undefined;
}

function hasPresence(value: unknown) {
	return value !== undefined && value !== null && value !== '';
}

function toLabel(key: string) {
	return key
		.replace(/[_-]+/g, ' ')
		.replace(/\b\w/g, (char) => char.toUpperCase());
}
