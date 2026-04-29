import type {
	IntegrationCredentialManifest,
	IntegrationOwnershipMode,
} from '@contractspec/lib.contracts-integrations';
import type { EnvironmentConfig } from '@contractspec/lib.contracts-spec/workspace-config/environment';
import {
	integrationHubCredentialManifest,
	integrationHubCredentialSetupState,
	integrationHubEnvironmentConfig,
} from '../setup/credential-setup';

export interface IntegrationHubSetupFieldRow {
	key: string;
	kind: 'config' | 'secret';
	description?: string;
	required?: boolean;
	configured: boolean;
	secretRef?: string;
}

export interface IntegrationHubSetupAliasRow {
	name: string;
	targetId?: string;
	targetLabel?: string;
	framework?: string;
	exposure?: string;
}

export interface IntegrationHubCredentialSetupPreviewModel {
	fields: IntegrationHubSetupFieldRow[];
	aliases: IntegrationHubSetupAliasRow[];
	missingSecrets: IntegrationHubSetupFieldRow[];
}

export function buildIntegrationHubCredentialSetupPreviewModel(
	mode: IntegrationOwnershipMode
): IntegrationHubCredentialSetupPreviewModel {
	const manifest =
		integrationHubCredentialManifest as IntegrationCredentialManifest;
	const environment = integrationHubEnvironmentConfig as EnvironmentConfig;
	const setupState: {
		configValues: Record<string, unknown>;
		secretRefs: Record<string, string | undefined>;
		targetIds: readonly string[];
	} = integrationHubCredentialSetupState;
	const modeManifest = manifest.modes?.[mode];
	const fields: IntegrationHubSetupFieldRow[] = [
		...(modeManifest?.configFields ?? []).map((field) => ({
			...field,
			kind: 'config' as const,
			configured: hasValue(setupState.configValues[field.key]),
			secretRef: undefined,
		})),
		...(modeManifest?.secretFields ?? []).map((field) => ({
			...field,
			kind: 'secret' as const,
			configured: hasValue(setupState.secretRefs[field.key]),
			secretRef: setupState.secretRefs[field.key],
		})),
	];
	const aliases = Object.values(environment.variables ?? {})
		.flatMap((variable) =>
			(variable.aliases ?? []).map((alias) => ({
				...alias,
				targetLabel:
					environment.targets?.[alias.targetId ?? '']?.packageName ??
					alias.targetId,
			}))
		)
		.filter((alias) => setupState.targetIds.includes(alias.targetId ?? ''));
	const missingSecrets = fields.filter(
		(field) => field.kind === 'secret' && field.required && !field.configured
	);

	return { fields, aliases, missingSecrets };
}

function hasValue(value: unknown) {
	return value !== undefined && value !== null && value !== '';
}
