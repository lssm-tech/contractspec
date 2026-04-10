import { describe, expect, it } from 'bun:test';
import type {
	ExternalExecutionReceipt,
	ExternalPatchProposal,
	ProviderRoutingPolicy,
	RuntimeTarget,
} from './types';
import {
	validateExternalExecutionReceipt,
	validateExternalPatchProposal,
	validateProviderRoutingPolicy,
	validateRuntimeTarget,
} from './validation';

describe('provider-spec validation', () => {
	it('validates runtime target requirements', () => {
		const target: RuntimeTarget = {
			id: '',
			workspaceId: 'ws_1',
			type: 'local_daemon',
			runtimeMode: 'local',
			displayName: '',
			registrationState: 'registered',
			capabilityProfile: {
				supportsPreview: true,
				supportsExport: true,
				supportsMobileInspection: true,
				supportsLocalExecution: true,
				availableProviders: [],
				dataLocality: 'local',
			},
			networkPolicy: 'restricted',
			dataLocality: 'local',
			secretHandlingMode: 'local',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		expect(validateRuntimeTarget(target).length).toBeGreaterThan(0);
	});

	it('validates routing policy task rules', () => {
		const policy: ProviderRoutingPolicy = {
			id: '',
			workspaceId: 'ws_1',
			taskRules: [
				{
					taskType: 'clarify',
					preferredProviders: [],
					fallbackProviders: [],
				},
			],
			riskRules: [],
			runtimeModeRules: [],
			comparisonRules: [],
			fallbackRules: [],
			updatedAt: new Date().toISOString(),
		};

		expect(validateProviderRoutingPolicy(policy).length).toBeGreaterThan(0);
	});

	it('validates routing policy risk rules', () => {
		const policy: ProviderRoutingPolicy = {
			id: 'policy_1',
			workspaceId: 'ws_1',
			taskRules: [
				{
					taskType: 'clarify',
					preferredProviders: ['provider.chat'],
					fallbackProviders: [],
				},
			],
			riskRules: [
				{
					riskLevelAtOrAbove: 'high',
				},
			],
			runtimeModeRules: [],
			comparisonRules: [],
			fallbackRules: [],
			updatedAt: new Date().toISOString(),
		};

		expect(validateProviderRoutingPolicy(policy).length).toBeGreaterThan(0);
	});

	it('validates execution receipt hashes', () => {
		const receipt: ExternalExecutionReceipt = {
			id: 'receipt_1',
			workspaceId: 'ws_1',
			runId: 'run_1',
			providerId: '',
			providerKind: 'coding',
			taskType: 'propose_patch',
			runtimeMode: 'managed',
			contextBundleId: 'ctx_1',
			contextHash: '',
			outputArtifactHashes: [],
			status: 'succeeded',
			startedAt: new Date().toISOString(),
			completedAt: '',
			verificationRefs: [],
		};

		const issues = validateExternalExecutionReceipt(receipt);

		expect(issues.length).toBeGreaterThan(0);
		expect(issues.some((issue) => issue.path === 'completedAt')).toBe(true);
		expect(issues.some((issue) => issue.path === 'verificationRefs')).toBe(
			true
		);
	});

	it('validates patch proposal scope and verification requirements', () => {
		const proposal: ExternalPatchProposal = {
			id: 'patch_1',
			workspaceId: 'ws_1',
			receiptId: 'receipt_1',
			runId: 'run_1',
			summary: 'Patch summary',
			changedAreas: [],
			diffHash: '',
			outputArtifactRefs: [],
			allowedWriteScopes: [],
			riskLevel: 'high',
			verificationRequirements: [],
			status: 'proposed',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		const issues = validateExternalPatchProposal(proposal);

		expect(issues.length).toBeGreaterThan(0);
		expect(issues.some((issue) => issue.path === 'outputArtifactRefs')).toBe(
			true
		);
		expect(issues.some((issue) => issue.path === 'changedAreas')).toBe(true);
	});
});
