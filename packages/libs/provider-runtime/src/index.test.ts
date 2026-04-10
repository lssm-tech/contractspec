import { describe, expect, it } from 'bun:test';
import type { BuilderWorkspace } from '@contractspec/lib.builder-spec';
import {
	createBuilderExecutionContextBundle,
	createBuilderExternalProviderRecord,
	createBuilderRoutingPolicyRecord,
	createBuilderRuntimeTargetRecord,
	normalizeBuilderExecutionOutput,
} from './index';

const workspace = {
	id: 'ws_1',
	tenantId: 'tenant_1',
	name: 'Builder',
	status: 'draft',
	appClass: 'internal_workflow',
	defaultRuntimeMode: 'managed',
	mobileParityRequired: true,
	ownerIds: ['owner_1'],
	defaultLocale: 'en',
	defaultChannelPolicy: {},
	createdAt: '2026-04-08T00:00:00.000Z',
	updatedAt: '2026-04-08T00:00:00.000Z',
} satisfies BuilderWorkspace;

describe('provider-runtime', () => {
	it('creates runtime target records with handshake and trust profile data', () => {
		const target = createBuilderRuntimeTargetRecord({
			commandKey: 'builder.runtimeTarget.register',
			workspaceId: workspace.id,
			entityId: 'rt_1',
			nowIso: '2026-04-08T00:00:00.000Z',
			payload: {
				runtimeMode: 'local',
				capabilityHandshake: {
					supportedModes: ['local'],
					availableProviders: ['provider.codex'],
				},
				trustProfile: {
					controller: 'tenant_local',
					secretsLocation: 'local_only',
					outboundNetworkAllowed: true,
				},
			},
		});
		expect(target.runtimeMode).toBe('local');
		expect(target.capabilityHandshake?.availableProviders).toContain(
			'provider.codex'
		);
		expect(target.trustProfile?.controller).toBe('tenant_local');
	});

	it('creates execution context bundles with deterministic hashes', () => {
		const bundle = createBuilderExecutionContextBundle({
			id: 'ctx_1',
			workspace,
			blueprintId: 'bp_1',
			blueprintBrief: 'Build a payroll approvals workspace',
			blueprintPolicies: ['retention.90d'],
			createdAt: '2026-04-08T00:00:00.000Z',
			payload: {
				sourceRefs: ['src_1'],
				allowedWriteScopes: ['src/features/payroll'],
			},
		});
		expect(bundle.hash.length).toBeGreaterThan(0);
		expect(bundle.allowedWriteScopes).toEqual(['src/features/payroll']);
		expect(bundle.requiredReceiptFields).toEqual([
			'providerId',
			'modelId',
			'taskType',
			'runtimeMode',
			'contextHash',
			'outputArtifactHashes',
			'startedAt',
			'completedAt',
			'verificationRefs',
		]);
	});

	it('normalizes provider execution output into receipts and patch proposals', () => {
		const provider = createBuilderExternalProviderRecord({
			commandKey: 'builder.provider.register',
			workspaceId: workspace.id,
			entityId: 'provider.codex',
			nowIso: '2026-04-08T00:00:00.000Z',
			payload: {
				providerKind: 'coding',
				supportedTaskTypes: ['propose_patch'],
			},
		});
		const normalized = normalizeBuilderExecutionOutput({
			id: 'receipt_1',
			workspace,
			provider,
			nowIso: '2026-04-08T00:00:00.000Z',
			payload: {
				taskType: 'propose_patch',
				diffHash: 'diff_1',
				artifactRefs: ['artifact://diff'],
				patchProposal: {
					summary: 'Add hybrid export guard',
					changedAreas: ['export'],
					allowedWriteScopes: ['src/export'],
				},
			},
		});
		expect(normalized.receipt.providerId).toBe('provider.codex');
		expect(normalized.patchProposal?.summary).toBe('Add hybrid export guard');
		expect(normalized.mobileReviewCard?.subjectType).toBe('patch_proposal');
	});

	it('preserves workspace provider profile defaults in routing policy records', () => {
		const policy = createBuilderRoutingPolicyRecord({
			id: 'policy_1',
			workspace: {
				...workspace,
				preferredProviderProfileId: 'profile.default.v1',
			},
			nowIso: '2026-04-08T00:00:00.000Z',
		});
		expect(policy.defaultProviderProfileId).toBe('profile.default.v1');
	});
});
