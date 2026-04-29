import {
	type AppEnvironmentFramework,
	type EnvironmentConfig,
	EnvironmentConfigSchema,
	type EnvironmentValueSource,
	type EnvironmentVariableDefinition,
} from '@contractspec/lib.contracts-spec/workspace-config/environment';

export type EnvironmentResolutionStatus =
	| 'resolved'
	| 'missing'
	| 'secret-ref'
	| 'redacted';

export interface ResolvedEnvironmentVariable {
	logicalKey: string;
	envName: string;
	targetId?: string;
	status: EnvironmentResolutionStatus;
	redactedValue?: string;
	sourceType?: EnvironmentValueSource['type'];
	message?: string;
}

export interface EnvironmentResolutionReport {
	targetId?: string;
	profile?: string;
	variables: ResolvedEnvironmentVariable[];
	errors: string[];
}

export interface ResolveEnvironmentOptions {
	config: EnvironmentConfig;
	targetId?: string;
	profile?: string;
	hostEnv?: Record<string, string | undefined>;
}

export function resolveEnvironmentForTarget(
	options: ResolveEnvironmentOptions
): EnvironmentResolutionReport {
	const parsed = EnvironmentConfigSchema.safeParse(options.config);
	if (!parsed.success) {
		return {
			targetId: options.targetId,
			profile: options.profile,
			variables: [],
			errors: parsed.error.issues.map((issue) => issue.message),
		};
	}

	const target = options.targetId
		? parsed.data.targets?.[options.targetId]
		: undefined;
	const variables: ResolvedEnvironmentVariable[] = [];

	for (const [recordKey, definition] of Object.entries(
		parsed.data.variables ?? {}
	)) {
		const allAliases = definition.aliases ?? [];
		const aliases = allAliases.filter((alias) =>
			aliasMatchesTarget(
				alias.targetId,
				alias.profile,
				alias.framework,
				target?.id ?? options.targetId,
				options.profile,
				target?.framework
			)
		);
		if (
			allAliases.some(
				(alias) => alias.targetId || alias.profile || alias.framework
			) &&
			aliases.length === 0
		) {
			continue;
		}
		const names =
			aliases.length > 0 ? aliases.map((alias) => alias.name) : [recordKey];
		const resolved = resolveValue(definition, options);
		for (const envName of names) {
			variables.push({
				logicalKey: definition.key,
				envName,
				targetId: target?.id ?? options.targetId,
				...resolved,
			});
		}
	}

	return {
		targetId: target?.id ?? options.targetId,
		profile: options.profile,
		variables,
		errors: [],
	};
}

export function buildEnvExample(report: EnvironmentResolutionReport): string {
	return report.variables
		.map(
			(item) => `${item.envName}=${item.redactedValue ?? placeholderFor(item)}`
		)
		.join('\n');
}

export function redactEnvironmentValue(
	definition: Pick<EnvironmentVariableDefinition, 'sensitivity'>,
	value: string | undefined
): string | undefined {
	if (value === undefined) return undefined;
	const sensitivity = definition.sensitivity ?? 'internal';
	if (sensitivity === 'secret' || sensitivity === 'sensitive') {
		return '[redacted]';
	}
	return value;
}

function resolveValue(
	definition: EnvironmentVariableDefinition,
	options: ResolveEnvironmentOptions
): Omit<ResolvedEnvironmentVariable, 'logicalKey' | 'envName' | 'targetId'> {
	const source = resolveSource(definition, options.profile, options.config);
	if (!source) {
		return {
			status: definition.requiredProfiles?.includes(options.profile ?? '')
				? 'missing'
				: 'resolved',
			redactedValue: stringifyValue(definition.defaultValue),
			sourceType: 'literal',
		};
	}
	if (source.type === 'secret' || source.type === 'byok-connection') {
		return {
			status: (source.secretRef ?? source.ref) ? 'secret-ref' : 'missing',
			redactedValue:
				(source.secretRef ?? source.ref) ? '[secret-ref]' : undefined,
			sourceType: source.type,
		};
	}
	if (source.type === 'managed-connection') {
		return {
			status: source.connectionId ? 'secret-ref' : 'missing',
			redactedValue: source.connectionId ? '[managed-connection]' : undefined,
			sourceType: source.type,
		};
	}
	if (source.type === 'env') {
		const envName = source.envVar ?? source.ref ?? definition.key;
		const value = options.hostEnv?.[envName];
		return {
			status: value === undefined ? 'missing' : 'resolved',
			redactedValue: redactEnvironmentValue(definition, value),
			sourceType: source.type,
		};
	}
	return {
		status: 'resolved',
		redactedValue: redactEnvironmentValue(
			definition,
			stringifyValue(source.value ?? definition.defaultValue)
		),
		sourceType: 'literal',
	};
}

function resolveSource(
	definition: EnvironmentVariableDefinition,
	profile: string | undefined,
	config: EnvironmentConfig
): EnvironmentValueSource | undefined {
	const profileSource = profile
		? config.profiles?.[profile]?.variables?.[definition.key]
		: undefined;
	return profileSource ?? definition.valueSource;
}

function aliasMatchesTarget(
	targetId: string | undefined,
	profile: string | undefined,
	framework: AppEnvironmentFramework | undefined,
	activeTargetId: string | undefined,
	activeProfile: string | undefined,
	activeFramework: AppEnvironmentFramework | undefined
): boolean {
	if (targetId && targetId !== activeTargetId) return false;
	if (profile && profile !== activeProfile) return false;
	if (framework && framework !== activeFramework) return false;
	return true;
}

function stringifyValue(value: string | number | boolean | undefined) {
	if (value === undefined) return undefined;
	return String(value);
}

function placeholderFor(item: ResolvedEnvironmentVariable) {
	if (item.status === 'secret-ref' || item.status === 'redacted') {
		return '<secret-ref>';
	}
	return '<set-value>';
}
