import { appLogger } from '@contractspec/bundle.library/infrastructure/elysia/logger';
import {
	ChannelApprovalService,
	ChannelOutboxDispatcher,
	ChannelRuntimeService,
	type ChannelRuntimeStore,
	type ChannelTelemetryEmitter,
	type ChannelTelemetryEvent,
	ChannelTraceService,
	ControlPlaneSkillRegistryService,
	InMemoryChannelRuntimeStore,
	MessagingPolicyEngine,
	PostgresChannelRuntimeStore,
} from '@contractspec/integration.runtime/channel';
import {
	ControlPlaneApprovalCapability,
	ControlPlaneAuditCapability,
	ControlPlaneChannelRuntimeCapability,
	ControlPlaneCoreCapability,
	ControlPlaneFeature,
	ControlPlaneSkillRegistryCapability,
	type ControlPlaneSkillRuntimeContext,
	type ControlPlaneSkillTrustPolicy,
} from '@contractspec/lib.contracts-spec/control-plane';
import { createPostgresChannelRuntimeStore } from './channel-runtime-store-factory';
import { resetSenderResolverForTests } from './channel-sender-resolver';
import { clearWorkspaceMapCacheForTests } from './channel-workspace-resolver';

interface RuntimeResources {
	store: ChannelRuntimeStore;
	approvalService: ChannelApprovalService;
	traceService: ChannelTraceService;
	skillRegistry: ControlPlaneSkillRegistryService;
	policy: MessagingPolicyEngine;
	service: ChannelRuntimeService;
	dispatcher: ChannelOutboxDispatcher;
	initializePromise: Promise<void>;
}

let runtimeResources: RuntimeResources | null = null;

const telemetryEmitter: ChannelTelemetryEmitter = {
	record(event: ChannelTelemetryEvent) {
		const level =
			event.status === 'failed' || event.status === 'dead_letter'
				? 'warn'
				: 'info';
		appLogger[level]('channel.runtime.telemetry', {
			stage: event.stage,
			status: event.status,
			workspaceId: event.workspaceId,
			providerKey: event.providerKey,
			receiptId: event.receiptId,
			actionId: event.actionId,
			sessionId: event.sessionId,
			workflowId: event.workflowId,
			traceId: event.traceId,
			latencyMs: event.latencyMs,
			attempt: event.attempt,
			...event.metadata,
		});
	},
};

export async function getChannelRuntimeResources(): Promise<RuntimeResources> {
	if (runtimeResources) {
		await runtimeResources.initializePromise;
		return runtimeResources;
	}

	const storageMode = process.env.CHANNEL_RUNTIME_STORAGE ?? 'postgres';
	const databaseUrl =
		process.env.CHANNEL_RUNTIME_DATABASE_URL ?? process.env.DATABASE_URL;
	if (storageMode !== 'memory' && !databaseUrl) {
		throw new Error(
			'CHANNEL_RUNTIME_DATABASE_URL (or DATABASE_URL) must be set for channel runtime.'
		);
	}
	const store =
		storageMode === 'memory'
			? new InMemoryChannelRuntimeStore()
			: createPostgresChannelRuntimeStore(databaseUrl as string);
	const asyncProcessing = process.env.CHANNEL_RUNTIME_ASYNC_PROCESSING !== '0';
	const defaultCapabilityGrants = (
		process.env.CHANNEL_RUNTIME_DEFAULT_CAPABILITY_GRANTS ?? ''
	)
		.split(',')
		.map((grant) => grant.trim())
		.filter(Boolean);
	const policy = new MessagingPolicyEngine();
	const approvalService = new ChannelApprovalService(store, {
		telemetry: telemetryEmitter,
	});
	const traceService = new ChannelTraceService(store);
	const skillRegistry = new ControlPlaneSkillRegistryService(store, {
		trustPolicy: readSkillTrustPolicyFromEnv(),
		runtime: readSkillRuntimeContext(),
	});
	const service = new ChannelRuntimeService(store, {
		asyncProcessing,
		policy,
		actorResolver(event) {
			return {
				type: 'service',
				id:
					process.env.CHANNEL_RUNTIME_ACTOR_ID ??
					'app.api-library.channel-runtime',
				tenantId: event.workspaceId,
				sessionId: event.metadata?.['sessionId'],
				capabilitySource: 'app.api-library.channel-runtime',
				capabilityGrants: [...defaultCapabilityGrants],
			};
		},
		defaultCapabilityGrants,
		defaultCapabilitySource: 'app.api-library.channel-runtime',
		telemetry: telemetryEmitter,
	});
	const dispatcher = new ChannelOutboxDispatcher(store, {
		telemetry: telemetryEmitter,
		batchSize: Number.parseInt(
			process.env.CHANNEL_DISPATCH_BATCH_SIZE ?? '20',
			10
		),
		maxRetries: Number.parseInt(
			process.env.CHANNEL_DISPATCH_MAX_RETRIES ?? '3',
			10
		),
		baseBackoffMs: Number.parseInt(
			process.env.CHANNEL_DISPATCH_BASE_BACKOFF_MS ?? '1000',
			10
		),
	});
	const initializePromise =
		store instanceof PostgresChannelRuntimeStore
			? store.initializeSchema()
			: Promise.resolve();

	runtimeResources = {
		store,
		approvalService,
		traceService,
		skillRegistry,
		policy,
		service,
		dispatcher,
		initializePromise,
	};

	await initializePromise;
	return runtimeResources;
}

export function resetChannelRuntimeResourcesForTests(): void {
	runtimeResources = null;
	resetSenderResolverForTests();
	clearWorkspaceMapCacheForTests();
}

export function getChannelRuntimeStoreForTests(): ChannelRuntimeStore | null {
	return runtimeResources?.store ?? null;
}

function readSkillTrustPolicyFromEnv(): ControlPlaneSkillTrustPolicy {
	const raw = process.env.CONTROL_PLANE_SKILL_TRUST_POLICY_JSON;
	if (!raw) {
		return {
			trustedPublishers: [],
		};
	}
	try {
		const parsed = JSON.parse(raw);
		if (
			typeof parsed !== 'object' ||
			parsed === null ||
			!Array.isArray(
				(parsed as { trustedPublishers?: unknown }).trustedPublishers
			)
		) {
			throw new Error('trustedPublishers must be an array.');
		}
		return parsed as ControlPlaneSkillTrustPolicy;
	} catch (error) {
		appLogger.warn('channel.runtime.skillTrustPolicy.invalid', {
			error: error instanceof Error ? error.message : String(error),
		});
		return {
			trustedPublishers: [],
		};
	}
}

function readSkillRuntimeContext(): ControlPlaneSkillRuntimeContext {
	return {
		contractsSpecVersion:
			process.env.CONTROL_PLANE_SKILL_CONTRACTS_SPEC_VERSION ?? '0.0.0',
		controlPlaneFeatureVersion:
			process.env.CONTROL_PLANE_SKILL_CONTROL_PLANE_VERSION ??
			ControlPlaneFeature.meta.version,
		availableCapabilities: [
			ControlPlaneCoreCapability.meta,
			ControlPlaneApprovalCapability.meta,
			ControlPlaneAuditCapability.meta,
			ControlPlaneChannelRuntimeCapability.meta,
			ControlPlaneSkillRegistryCapability.meta,
		],
	};
}
