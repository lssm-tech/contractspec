import { describe, expect, it } from 'bun:test';
import type {
	BuilderBlueprint,
	BuilderReadinessReport,
} from '@contractspec/lib.builder-spec';
import type { ExternalExecutionReceipt } from '@contractspec/lib.provider-spec';
import { BuilderRuntimeService } from './runtime';
import { InMemoryBuilderStore } from './stores';

const FIXED_NOW = '2026-04-08T09:00:00.000Z';

function createBlueprint(workspaceId: string): BuilderBlueprint {
	return {
		id: 'bp_export',
		workspaceId,
		appBrief: 'Export lifecycle app',
		personas: [],
		domainObjects: [],
		workflows: [],
		surfaces: [],
		integrations: [],
		policies: ['approval required'],
		runtimeProfiles: [],
		channelSurfaces: [],
		featureParity: [],
		assumptions: [],
		openQuestions: [],
		coverageReport: {
			explicitCount: 1,
			inferredCount: 0,
			conflictedCount: 0,
			missingCount: 0,
			fields: [],
		},
		version: 1,
		lockedFieldPaths: [],
		createdAt: FIXED_NOW,
		updatedAt: FIXED_NOW,
	};
}

function createReadinessReport(
	workspaceId: string,
	blueprint: BuilderBlueprint
): BuilderReadinessReport {
	return {
		id: 'readiness_export',
		workspaceId,
		overallStatus: 'export_ready',
		score: 100,
		supportedRuntimeModes: ['managed', 'local', 'hybrid'],
		managedReady: true,
		localReady: true,
		hybridReady: true,
		mobileParityStatus: 'full',
		blockingIssues: [],
		warnings: [],
		sourceCoverage: blueprint.coverageReport,
		policySummary: blueprint.policies,
		channelSummary: [],
		providerSummary: {
			runs: 1,
			verifiedRuns: 1,
			comparisonRuns: 0,
			activeProviderIds: ['provider.codex'],
		},
		runtimeSummary: {
			selectedDefault: 'managed',
			registeredTargets: ['rt_managed', 'rt_local', 'rt_hybrid'],
			healthyTargetIds: ['rt_managed', 'rt_local', 'rt_hybrid'],
		},
		requiredApprovals: [],
		harnessRunRefs: [],
		evidenceBundleRef: {
			id: 'evidence_1',
			runId: 'run_1',
			artifactIds: ['artifact_1'],
			classes: ['builder-readiness'],
			createdAt: FIXED_NOW,
		},
		recommendedNextAction: 'Export the workspace.',
	};
}

function createReceipt(workspaceId: string): ExternalExecutionReceipt {
	return {
		id: 'receipt_export',
		workspaceId,
		runId: 'run_export',
		providerId: 'provider.codex',
		providerKind: 'coding',
		taskType: 'propose_patch',
		runtimeMode: 'managed',
		contextBundleId: 'ctx_export',
		contextHash: 'hash_export',
		outputArtifactHashes: ['artifact_hash'],
		status: 'succeeded',
		startedAt: FIXED_NOW,
		completedAt: FIXED_NOW,
		verificationRefs: ['verify_export'],
	};
}

describe('builder export lifecycle', () => {
	it('prepares, approves, and executes exports across managed, local, and hybrid modes', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store, {
			now: () => new Date(FIXED_NOW),
		});
		const workspaceId = 'ws_export';

		await service.executeCommand('builder.workspace.create', {
			workspaceId,
			payload: {
				tenantId: 'tenant_1',
				name: 'Export Workspace',
				ownerIds: ['owner_1'],
			},
		});
		const blueprint = createBlueprint(workspaceId);
		await store.saveBlueprint(blueprint);
		await store.saveReadinessReport(
			createReadinessReport(workspaceId, blueprint)
		);
		await store.saveExecutionReceipt(createReceipt(workspaceId));

		const runtimeModes = [
			{
				runtimeMode: 'managed' as const,
				targetId: 'rt_managed',
			},
			{
				runtimeMode: 'local' as const,
				targetId: 'rt_local',
			},
			{
				runtimeMode: 'hybrid' as const,
				targetId: 'rt_hybrid',
			},
		];

		for (const target of runtimeModes) {
			await service.executeCommand('builder.runtimeTarget.register', {
				workspaceId,
				entityId: target.targetId,
				payload: {
					displayName: target.targetId,
					runtimeMode: target.runtimeMode,
					type:
						target.runtimeMode === 'managed'
							? 'managed_workspace'
							: target.runtimeMode === 'local'
								? 'local_daemon'
								: 'hybrid_bridge',
				},
			});
			await service.executeCommand('builder.preview.create', {
				workspaceId,
				payload: {
					runtimeMode: target.runtimeMode,
					runtimeTargetId: target.targetId,
				},
			});
			const prepared = await service.executeCommand('builder.export.prepare', {
				workspaceId,
				payload: {
					runtimeMode: target.runtimeMode,
					runtimeTargetId: target.targetId,
				},
			});
			expect(prepared).not.toBeNull();
			await service.executeCommand('builder.export.approve', {
				workspaceId,
			});
			await service.executeCommand('builder.export.execute', {
				workspaceId,
			});
			const exportBundle = await store.getExportBundle(workspaceId);
			expect(exportBundle?.runtimeMode).toBe(target.runtimeMode);
			expect(exportBundle?.runtimeTargetRef).toBe(target.targetId);
			expect(exportBundle?.approvedAt).toBe(FIXED_NOW);
			expect(exportBundle?.exportedAt).toBe(FIXED_NOW);
		}
	});

	it('blocks export execution until approval is captured and the runtime target stays registered', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store, {
			now: () => new Date(FIXED_NOW),
		});
		const workspaceId = 'ws_export_gate';

		await service.executeCommand('builder.workspace.create', {
			workspaceId,
			payload: {
				tenantId: 'tenant_1',
				name: 'Export Gate Workspace',
				ownerIds: ['owner_1'],
				defaultRuntimeMode: 'local',
			},
		});
		const blueprint = createBlueprint(workspaceId);
		await store.saveBlueprint(blueprint);
		await store.saveReadinessReport(
			createReadinessReport(workspaceId, blueprint)
		);
		await store.saveExecutionReceipt(createReceipt(workspaceId));
		await service.executeCommand('builder.runtimeTarget.register', {
			workspaceId,
			entityId: 'rt_local_gate',
			payload: {
				displayName: 'Local gate runtime',
				runtimeMode: 'local',
				type: 'local_daemon',
			},
		});
		await service.executeCommand('builder.preview.create', {
			workspaceId,
			payload: {
				runtimeMode: 'local',
				runtimeTargetId: 'rt_local_gate',
			},
		});
		await service.executeCommand('builder.export.prepare', {
			workspaceId,
			payload: {
				runtimeMode: 'local',
				runtimeTargetId: 'rt_local_gate',
			},
		});

		const executeBeforeApproval = await service.executeCommand(
			'builder.export.execute',
			{
				workspaceId,
			}
		);
		expect(executeBeforeApproval).toBeNull();
		expect(
			(await store.getExportBundle(workspaceId))?.exportedAt
		).toBeUndefined();

		await service.executeCommand('builder.export.approve', {
			workspaceId,
		});
		await service.executeCommand('builder.runtimeTarget.quarantine', {
			workspaceId,
			entityId: 'rt_local_gate',
			payload: {
				reason: 'Bridge heartbeat failed.',
			},
		});

		const executeAfterQuarantine = await service.executeCommand(
			'builder.export.execute',
			{
				workspaceId,
			}
		);
		expect(executeAfterQuarantine).toBeNull();
		expect(
			(await store.getExportBundle(workspaceId))?.exportedAt
		).toBeUndefined();
	});
});
