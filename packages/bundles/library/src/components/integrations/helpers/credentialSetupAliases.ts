import type {
	IntegrationCredentialAlias,
	IntegrationCredentialModeManifest,
} from '@contractspec/lib.contracts-integrations';
import type {
	EnvironmentConfig,
	EnvVariableAlias,
} from '@contractspec/lib.contracts-spec/workspace-config/environment';
import type {
	BuildIntegrationCredentialSetupModelInput,
	CredentialSetupAliasRow,
	CredentialSetupWarning,
} from './credentialSetupModel';

export function buildAliases(
	manifest: IntegrationCredentialModeManifest | undefined,
	input: BuildIntegrationCredentialSetupModelInput,
	secretKeys: Set<string>,
	warnings: CredentialSetupWarning[]
): CredentialSetupAliasRow[] {
	return [
		...fromManifestAliases(manifest?.envAliases ?? [], secretKeys, warnings),
		...fromEnvironmentAliases(input.environment, input, secretKeys, warnings),
	];
}

function fromManifestAliases(
	aliases: IntegrationCredentialAlias[],
	secretKeys: Set<string>,
	warnings: CredentialSetupWarning[]
) {
	return aliases.flatMap((alias): CredentialSetupAliasRow[] => {
		if (
			secretKeys.has(alias.logicalKey) &&
			isPublicAlias(alias.envVar, alias.public)
		) {
			warnings.push({
				level: 'error',
				fieldKey: alias.logicalKey,
				message: `Unsafe public alias was omitted for secret field ${alias.logicalKey}.`,
			});
			return [];
		}
		return [
			{
				logicalKey: alias.logicalKey,
				envName: alias.envVar,
				targetId: alias.targetId,
				public: isPublicAlias(alias.envVar, alias.public),
				warning: alias.public ? 'Public client alias' : undefined,
			},
		];
	});
}

function fromEnvironmentAliases(
	environment: EnvironmentConfig | undefined,
	input: BuildIntegrationCredentialSetupModelInput,
	secretKeys: Set<string>,
	warnings: CredentialSetupWarning[]
) {
	if (!environment) return [];
	return Object.values(environment?.variables ?? {}).flatMap((definition) =>
		(definition.aliases ?? [])
			.filter((alias) => aliasMatchesInput(alias, environment, input))
			.flatMap((alias): CredentialSetupAliasRow[] => {
				const publicAlias =
					isPublicAlias(alias.name) || isPublicExposure(alias.exposure);
				if (secretKeys.has(definition.key) && publicAlias) {
					warnings.push({
						level: 'error',
						fieldKey: definition.key,
						message: `Unsafe public alias was omitted for secret field ${definition.key}.`,
					});
					return [];
				}
				return [
					{
						logicalKey: definition.key,
						envName: alias.name,
						targetId: alias.targetId,
						targetLabel: targetLabel(environment, alias.targetId),
						profile: alias.profile,
						framework: alias.framework,
						public: publicAlias,
						warning: publicAlias ? 'Public client alias' : undefined,
					},
				];
			})
	);
}

function aliasMatchesInput(
	alias: EnvVariableAlias,
	environment: EnvironmentConfig,
	input: BuildIntegrationCredentialSetupModelInput
) {
	if (
		input.targetIds?.length &&
		alias.targetId &&
		!input.targetIds.includes(alias.targetId)
	)
		return false;
	if (input.profile && alias.profile && alias.profile !== input.profile)
		return false;
	if (
		!input.targetIds?.length &&
		(alias.targetId || alias.profile || alias.framework)
	)
		return false;
	if (alias.framework && alias.targetId) {
		const framework = environment.targets?.[alias.targetId]?.framework;
		if (framework && framework !== alias.framework) return false;
	}
	return true;
}

function targetLabel(
	environment: EnvironmentConfig,
	targetId: string | undefined
) {
	if (!targetId) return undefined;
	const target = environment.targets?.[targetId];
	return target?.packageName ?? target?.appId ?? target?.id ?? targetId;
}

function isPublicExposure(exposure: string | undefined) {
	return exposure === 'public-client' || exposure === 'native-client';
}

function isPublicAlias(name: string, explicit?: boolean) {
	return (
		explicit === true ||
		name.startsWith('NEXT_PUBLIC_') ||
		name.startsWith('EXPO_PUBLIC_')
	);
}
