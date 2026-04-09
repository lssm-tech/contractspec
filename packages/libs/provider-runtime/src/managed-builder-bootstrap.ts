import type {
	ProviderRoutingPolicy,
	RuntimeMode,
} from '@contractspec/lib.provider-spec';
import {
	BUILDER_BOOTSTRAP_PROVIDER_IDS,
	createManagedBuilderBootstrapProviders,
} from './managed-builder-bootstrap.resources';
import {
	BUILDER_HYBRID_RUNTIME_TARGET_ID,
	BUILDER_LOCAL_RUNTIME_TARGET_ID,
	BUILDER_MANAGED_RUNTIME_TARGET_ID,
	createManagedBuilderBootstrapRuntimeTargets,
} from './managed-builder-runtime-targets';
import { createManagedBuilderRoutingPolicyPayload } from './recommended-builder-setup';

export type BuilderBootstrapPreset =
	| 'managed_mvp'
	| 'local_daemon_mvp'
	| 'hybrid_mvp';
export {
	BUILDER_HYBRID_RUNTIME_TARGET_ID,
	BUILDER_LOCAL_RUNTIME_TARGET_ID,
	BUILDER_MANAGED_RUNTIME_TARGET_ID,
};

export interface BuilderBootstrapResource<
	TPayload extends Record<string, unknown>,
> {
	id: string;
	payload: TPayload;
}

export interface ManagedBuilderBootstrapPreset {
	preset: BuilderBootstrapPreset;
	providers: Array<BuilderBootstrapResource<Record<string, unknown>>>;
	runtimeTargets: Array<BuilderBootstrapResource<Record<string, unknown>>>;
	defaultRuntimeMode: RuntimeMode;
	routingPolicy: Pick<
		ProviderRoutingPolicy,
		| 'taskRules'
		| 'riskRules'
		| 'runtimeModeRules'
		| 'comparisonRules'
		| 'fallbackRules'
		| 'defaultProviderProfileId'
	>;
	defaultProviderProfileId: string;
}

export interface ManagedBuilderBootstrapOptions {
	includeLocalRuntimeTarget?: boolean;
	includeHybridRuntimeTarget?: boolean;
	includeLocalHelperProvider?: boolean;
}

export function createManagedBuilderBootstrapPreset(
	options: ManagedBuilderBootstrapOptions & {
		preset?: BuilderBootstrapPreset;
	} = {}
): ManagedBuilderBootstrapPreset {
	const preset = options.preset ?? 'managed_mvp';
	const includeLocalHelperProvider =
		options.includeLocalHelperProvider !== false;
	const defaultRuntimeMode =
		preset === 'local_daemon_mvp'
			? 'local'
			: preset === 'hybrid_mvp'
				? 'hybrid'
				: 'managed';
	const providers = createManagedBuilderBootstrapProviders(
		includeLocalHelperProvider
	);
	const runtimeTargets = createManagedBuilderBootstrapRuntimeTargets({
		includeLocalRuntimeTarget:
			options.includeLocalRuntimeTarget ?? preset !== 'managed_mvp',
		includeHybridRuntimeTarget:
			options.includeHybridRuntimeTarget ?? preset === 'hybrid_mvp',
	});

	const routingPolicy = createManagedBuilderRoutingPolicyPayload({
		conversationalProviderId: BUILDER_BOOTSTRAP_PROVIDER_IDS.conversational,
		codingProviderId: BUILDER_BOOTSTRAP_PROVIDER_IDS.coding,
		codingFallbackProviderIds: [
			BUILDER_BOOTSTRAP_PROVIDER_IDS.codingFallback,
			BUILDER_BOOTSTRAP_PROVIDER_IDS.codingFallbackSecondary,
		],
		sttProviderId: BUILDER_BOOTSTRAP_PROVIDER_IDS.stt,
		localHelperProviderId: includeLocalHelperProvider
			? BUILDER_BOOTSTRAP_PROVIDER_IDS.localHelper
			: undefined,
	});

	return {
		preset,
		providers,
		runtimeTargets,
		defaultRuntimeMode,
		routingPolicy,
		defaultProviderProfileId:
			preset === 'managed_mvp'
				? (routingPolicy.defaultProviderProfileId ??
					BUILDER_BOOTSTRAP_PROVIDER_IDS.conversational)
				: BUILDER_BOOTSTRAP_PROVIDER_IDS.localHelper,
	};
}
