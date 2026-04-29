import type { BuilderMobileReviewCard } from '@contractspec/lib.builder-spec';
import { createBuilderMobileReviewCard } from '@contractspec/lib.mobile-control';
import {
	createBuilderComparisonRunRecord,
	createBuilderExecutionContextBundle,
	createBuilderExternalProviderRecord,
	createBuilderRoutingPolicyRecord,
	createBuilderRuntimeTargetRecord,
	normalizeBuilderExecutionOutput,
} from '@contractspec/lib.provider-runtime';
import type {
	ExternalExecutionProvider,
	ExternalExecutionReceipt,
	ExternalPatchProposal,
	ProviderRoutingPolicy,
	RuntimeTarget,
} from '@contractspec/lib.provider-spec';
import { createBuilderId } from '../utils/id';
import { isoNow } from '../utils/now';
import {
	createRuntimeIncidentReviewCard,
	persistBuilderReviewCard,
	resolveBuilderReviewCard,
} from './review-card-operations';
import { isRecord, readStringArray } from './shared';
import type {
	BuilderOperationInput,
	BuilderRuntimeDependencies,
} from './types';

const LOCAL_RUNTIME_INTEGRATION_PACKAGE =
	'@contractspec/integration.runtime.local';

function createLocalRuntimeTargetPayload(
	overrides: Partial<RuntimeTarget> & Record<string, unknown> = {}
) {
	return {
		type: 'local_daemon',
		runtimeMode: 'local',
		displayName: 'Local Builder Runtime',
		networkPolicy: 'tenant-local',
		dataLocality: 'local',
		secretHandlingMode: 'local',
		supportsPreview: true,
		supportsExport: true,
		supportsMobileInspection: true,
		supportsLocalExecution: true,
		...overrides,
	} as const;
}

function createLocalDaemonRuntimeRegistrationPayload(
	input: {
		grantedTo?: string;
		availableProviders?: string[];
		storageProfile?: string;
		networkReachability?: 'online' | 'restricted' | 'offline';
		evidenceEgressPolicy?: 'full' | 'summaries_only' | 'blocked';
		artifactSizeLimitMb?: number;
	} = {}
): ReturnType<typeof createLocalRuntimeTargetPayload> & {
	supportedChannels: string[];
} {
	const supportedChannels = ['telegram', 'whatsapp', 'mobile_web'];
	const payload = createLocalRuntimeTargetPayload({
		capabilityHandshake: {
			id: 'hs_local_default',
			workspaceId: '',
			runtimeTargetId: '',
			supportedModes: ['local'],
			availableProviders: input.availableProviders ?? [
				'provider.codex',
				'provider.local.model',
			],
			storageProfile: input.storageProfile ?? 'local-daemon-cache',
			networkReachability: input.networkReachability ?? 'restricted',
			artifactSizeLimitMb: input.artifactSizeLimitMb ?? 50,
			localUiSupport: false,
			capturedAt: new Date().toISOString(),
		},
		trustProfile: {
			controller: 'tenant_local',
			secretsLocation: 'local_only',
			outboundNetworkAllowed: input.networkReachability !== 'offline',
			managedRelayAllowed: false,
			evidenceEgressPolicy: input.evidenceEgressPolicy ?? 'summaries_only',
			lastReviewedAt: new Date().toISOString(),
		},
		lease: input.grantedTo
			? {
					id: 'lease_local_default',
					workspaceId: '',
					runtimeTargetId: '',
					grantedTo: input.grantedTo,
					allowedScopes: ['preview', 'export', 'review'],
					expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
					status: 'active',
				}
			: undefined,
		lastHealthSummary: 'Local daemon registered and awaiting first heartbeat.',
	});
	return {
		...payload,
		supportedChannels,
	};
}

function resolveFailureRule(input: {
	receipt: ExternalExecutionReceipt;
	routingPolicy: ProviderRoutingPolicy | null;
}) {
	if (input.receipt.status !== 'failed') {
		return null;
	}
	return (
		input.routingPolicy?.fallbackRules.find(
			(rule) => rule.onFailure === `provider:${input.receipt.providerId}`
		) ??
		input.routingPolicy?.fallbackRules.find(
			(rule) => rule.onFailure === `task:${input.receipt.taskType}`
		) ??
		input.routingPolicy?.fallbackRules.find(
			(rule) => rule.onFailure === 'provider_failed'
		) ??
		null
	);
}

function findCompatibleFallbackProviders(input: {
	receipt: ExternalExecutionReceipt;
	routingPolicy: ProviderRoutingPolicy | null;
	providers: ExternalExecutionProvider[];
}) {
	const taskRule = input.routingPolicy?.taskRules.find(
		(rule) => rule.taskType === input.receipt.taskType
	);
	const orderedProviderIds =
		taskRule?.fallbackProviders.length && taskRule.fallbackProviders.length > 0
			? taskRule.fallbackProviders
			: input.providers.map((provider) => provider.id);
	return orderedProviderIds.filter((providerId) =>
		input.providers.some(
			(provider) =>
				provider.id === providerId &&
				provider.status !== 'disabled' &&
				provider.id !== input.receipt.providerId &&
				provider.supportedRuntimeModes.includes(input.receipt.runtimeMode) &&
				provider.supportedTaskTypes.includes(input.receipt.taskType)
		)
	);
}

function enrichProviderActivityForFailure(input: {
	activity: Awaited<
		ReturnType<typeof normalizeBuilderExecutionOutput>
	>['providerActivity'];
	receipt: ExternalExecutionReceipt;
	routingPolicy: ProviderRoutingPolicy | null;
	providers: ExternalExecutionProvider[];
}) {
	const failureRule = resolveFailureRule({
		receipt: input.receipt,
		routingPolicy: input.routingPolicy,
	});
	const recommendedAction = failureRule?.action ?? 'escalate';
	const fallbackProviderIds =
		recommendedAction === 'fallback_or_escalate'
			? findCompatibleFallbackProviders({
					receipt: input.receipt,
					routingPolicy: input.routingPolicy,
					providers: input.providers,
				})
			: [];
	const reason =
		recommendedAction === 'retry'
			? 'Routing policy permits a bounded retry after provider failure.'
			: recommendedAction === 'fallback_or_escalate'
				? fallbackProviderIds.length > 0
					? 'Routing policy permits a same-mode fallback provider.'
					: 'Routing policy permits fallback, but no compatible same-mode fallback provider is registered.'
				: recommendedAction === 'block'
					? 'Routing policy blocks automatic retry or fallback after provider failure.'
					: 'Provider failure requires human escalation under the current routing policy.';
	return {
		...input.activity,
		reason,
		recommendedAction,
		fallbackProviderIds:
			fallbackProviderIds.length > 0 ? fallbackProviderIds : undefined,
	};
}

export async function updateRuntimeTarget(
	deps: BuilderRuntimeDependencies,
	commandKey: string,
	input: BuilderOperationInput
) {
	const payload =
		commandKey === 'builder.runtimeTarget.registerLocalDaemon'
			? {
					...createLocalDaemonRuntimeRegistrationPayload({
						grantedTo:
							typeof input.payload?.grantedTo === 'string'
								? input.payload.grantedTo
								: undefined,
						availableProviders: readStringArray(
							input.payload?.availableProviders
						),
						storageProfile:
							typeof input.payload?.storageProfile === 'string'
								? input.payload.storageProfile
								: undefined,
						networkReachability:
							input.payload?.networkReachability === 'online' ||
							input.payload?.networkReachability === 'restricted' ||
							input.payload?.networkReachability === 'offline'
								? input.payload.networkReachability
								: undefined,
						evidenceEgressPolicy:
							input.payload?.evidenceEgressPolicy === 'full' ||
							input.payload?.evidenceEgressPolicy === 'summaries_only' ||
							input.payload?.evidenceEgressPolicy === 'blocked'
								? input.payload.evidenceEgressPolicy
								: undefined,
						artifactSizeLimitMb:
							typeof input.payload?.artifactSizeLimitMb === 'number'
								? input.payload.artifactSizeLimitMb
								: undefined,
					}),
					integrationPackage: LOCAL_RUNTIME_INTEGRATION_PACKAGE,
					...(input.payload ?? {}),
				}
			: input.payload;
	const existing = input.entityId
		? await deps.store.getRuntimeTarget(String(input.entityId))
		: null;
	const workspaceId = String(input.workspaceId ?? existing?.workspaceId ?? '');
	const nowIso = isoNow(deps.now);
	const target = createBuilderRuntimeTargetRecord({
		commandKey,
		workspaceId,
		entityId: String(
			input.entityId ?? existing?.id ?? createBuilderId('runtime_target')
		),
		payload,
		existing,
		nowIso,
	});
	const savedTarget = await deps.store.saveRuntimeTarget(target);
	if (
		savedTarget.registrationState === 'degraded' ||
		savedTarget.registrationState === 'quarantined' ||
		savedTarget.registrationState === 'offline'
	) {
		await createRuntimeIncidentReviewCard({
			deps,
			target: savedTarget,
			channelType:
				(input.payload
					?.channelType as BuilderMobileReviewCard['channelType']) ??
				'mobile_web',
			commandKey,
		});
	}
	return savedTarget;
}

export async function updateExternalProvider(
	deps: BuilderRuntimeDependencies,
	commandKey: string,
	input: BuilderOperationInput
) {
	const existing = input.entityId
		? await deps.store.getExternalProvider(String(input.entityId))
		: null;
	const workspaceId = String(input.workspaceId ?? existing?.workspaceId ?? '');
	const provider = createBuilderExternalProviderRecord({
		commandKey,
		workspaceId,
		entityId: String(
			input.entityId ?? existing?.id ?? createBuilderId('provider')
		),
		payload: input.payload,
		existing,
		nowIso: isoNow(deps.now),
	});
	return deps.store.saveExternalProvider(provider);
}

export async function upsertRoutingPolicy(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const workspace = await deps.store.getWorkspace(String(input.workspaceId));
	if (!workspace) return null;
	const existing = await deps.store.getRoutingPolicy(workspace.id);
	const policy = createBuilderRoutingPolicyRecord({
		id: existing?.id ?? createBuilderId('routing_policy'),
		workspace,
		payload: input.payload,
		existing,
		nowIso: isoNow(deps.now),
	});
	return deps.store.saveRoutingPolicy(policy);
}

export async function prepareExecutionContext(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const workspace = await deps.store.getWorkspace(String(input.workspaceId));
	const blueprint = await deps.store.getBlueprint(String(input.workspaceId));
	if (!workspace || !blueprint) return null;
	const bundle = createBuilderExecutionContextBundle({
		id: createBuilderId('exec_ctx'),
		workspace,
		blueprintId: blueprint.id,
		blueprintBrief: blueprint.appBrief,
		blueprintPolicies: blueprint.policies,
		payload: input.payload,
		createdAt: isoNow(deps.now),
	});
	return deps.store.saveExecutionContextBundle(bundle);
}

export async function ingestProviderExecutionOutput(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const workspace = await deps.store.getWorkspace(String(input.workspaceId));
	if (!workspace) return null;
	const provider =
		typeof input.payload?.providerId === 'string'
			? await deps.store.getExternalProvider(input.payload.providerId)
			: null;
	const contextBundle =
		typeof input.payload?.contextBundleId === 'string'
			? await deps.store.getExecutionContextBundle(
					input.payload.contextBundleId
				)
			: null;
	const normalized = normalizeBuilderExecutionOutput({
		id: String(input.entityId ?? createBuilderId('receipt')),
		workspace,
		payload: input.payload,
		provider,
		contextBundle,
		nowIso: isoNow(deps.now),
		channelType: input.payload?.channelType as
			| BuilderMobileReviewCard['channelType']
			| undefined,
	});
	const routingPolicy =
		normalized.receipt.status === 'failed'
			? await deps.store.getRoutingPolicy(workspace.id)
			: null;
	const providers =
		normalized.receipt.status === 'failed'
			? await deps.store.listExternalProviders(workspace.id)
			: [];
	const providerActivity =
		normalized.receipt.status === 'failed'
			? enrichProviderActivityForFailure({
					activity: normalized.providerActivity,
					receipt: normalized.receipt,
					routingPolicy,
					providers,
				})
			: normalized.providerActivity;
	await deps.store.saveExecutionReceipt(normalized.receipt);
	await deps.store.saveSource(normalized.providerSource);
	await deps.store.saveProviderActivity(providerActivity);
	if (normalized.patchProposal) {
		await deps.store.savePatchProposal(normalized.patchProposal);
	}
	if (normalized.mobileReviewCard) {
		await persistBuilderReviewCard(deps, normalized.mobileReviewCard);
	}
	return {
		receipt: normalized.receipt,
		patchProposal: normalized.patchProposal,
	};
}

export async function updatePatchProposal(
	deps: BuilderRuntimeDependencies,
	commandKey: string,
	input: BuilderOperationInput,
	refreshPreview: (input: BuilderOperationInput) => Promise<unknown>
) {
	const proposal = await deps.store.getPatchProposal(String(input.entityId));
	if (!proposal) return null;
	const statusMap: Record<string, ExternalPatchProposal['status']> = {
		'builder.patchProposal.accept': 'accepted_for_preview',
		'builder.patchProposal.reject': 'rejected',
		'builder.patchProposal.supersede': 'superseded',
	};
	const nextProposal = await deps.store.savePatchProposal({
		...proposal,
		status: statusMap[commandKey] ?? proposal.status,
		updatedAt: isoNow(deps.now),
	});
	if (commandKey === 'builder.patchProposal.accept') {
		await refreshPreview({
			workspaceId: proposal.workspaceId,
			payload: {
				runtimeMode: input.payload?.runtimeMode,
			},
		});
	}
	return nextProposal;
}

export async function recordComparisonRun(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const comparisonRun = createBuilderComparisonRunRecord({
		workspaceId: String(input.workspaceId),
		id: String(input.entityId ?? createBuilderId('comparison')),
		payload: input.payload,
		nowIso: isoNow(deps.now),
	});
	await deps.store.saveProviderActivity({
		id: createBuilderId('provider_activity'),
		workspaceId: comparisonRun.workspaceId,
		taskType: comparisonRun.taskType,
		comparisonMode: comparisonRun.mode,
		status: comparisonRun.status === 'failed' ? 'failed' : 'completed',
		recordedAt: isoNow(deps.now),
	});
	return deps.store.saveComparisonRun(comparisonRun);
}

export async function createMobileReviewCardOperation(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	const card = createBuilderMobileReviewCard({
		id: String(input.entityId ?? createBuilderId('mobile_review')),
		workspaceId: String(input.workspaceId),
		channelType:
			(input.payload?.channelType as BuilderMobileReviewCard['channelType']) ??
			'mobile_web',
		subjectType:
			(input.payload?.subjectType as BuilderMobileReviewCard['subjectType']) ??
			'patch_proposal',
		subjectId: String(input.payload?.subjectId ?? createBuilderId('subject')),
		summary: String(input.payload?.summary ?? 'Builder review required.'),
		riskLevel:
			(input.payload?.riskLevel as BuilderMobileReviewCard['riskLevel']) ??
			'medium',
		provider: isRecord(input.payload?.provider)
			? {
					id: String(input.payload.provider.id ?? 'provider.unknown'),
					runId:
						typeof input.payload.provider.runId === 'string'
							? input.payload.provider.runId
							: undefined,
				}
			: undefined,
		affectedAreas: readStringArray(input.payload?.affectedAreas),
		sourceRefs: readStringArray(input.payload?.sourceRefs),
		receiptId:
			typeof input.payload?.receiptId === 'string'
				? input.payload.receiptId
				: undefined,
		harnessSummary: String(
			input.payload?.harnessSummary ?? 'Review evidence before acting.'
		),
		actions:
			Array.isArray(input.payload?.actions) && input.payload.actions.length > 0
				? input.payload.actions.map((action) => ({
						id: String(
							(action as Record<string, unknown>).id ??
								createBuilderId('action')
						),
						label: String((action as Record<string, unknown>).label ?? 'Open'),
						deepLinkHref:
							typeof (action as Record<string, unknown>).deepLinkHref ===
							'string'
								? ((action as Record<string, unknown>).deepLinkHref as string)
								: undefined,
					}))
				: undefined,
		createdAt: isoNow(deps.now),
	});
	return persistBuilderReviewCard(deps, card);
}

export async function resolveMobileReviewCardOperation(
	deps: BuilderRuntimeDependencies,
	input: BuilderOperationInput
) {
	if (!input.entityId) {
		return null;
	}
	const status =
		input.payload?.status === 'approved' ||
		input.payload?.status === 'rejected' ||
		input.payload?.status === 'acknowledged' ||
		input.payload?.status === 'resolved'
			? input.payload.status
			: 'resolved';
	return resolveBuilderReviewCard(deps, {
		cardId: String(input.entityId),
		status,
	});
}
