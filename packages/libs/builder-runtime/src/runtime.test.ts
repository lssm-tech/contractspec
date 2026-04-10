import { describe, expect, it } from 'bun:test';
import type {
	BuilderBlueprint,
	BuilderReadinessReport,
	BuilderWorkspaceSnapshot,
} from '@contractspec/lib.builder-spec';
import type { ExternalExecutionReceipt } from '@contractspec/lib.provider-spec';
import { zipSync } from 'fflate';
import { BuilderRuntimeService } from './runtime';
import { InMemoryBuilderStore } from './stores';

const FIXED_NOW = '2026-04-07T12:00:00.000Z';

async function createWorkspace(
	service: BuilderRuntimeService,
	workspaceId = 'ws_1'
) {
	await service.executeCommand('builder.workspace.create', {
		workspaceId,
		payload: {
			tenantId: 'tenant_1',
			name: 'Builder Workspace',
			ownerIds: ['owner_1'],
		},
	});
	return workspaceId;
}

function createBlueprint(workspaceId: string): BuilderBlueprint {
	return {
		id: 'bp_1',
		workspaceId,
		appBrief: 'Approval dashboard',
		personas: [
			{ id: 'persona_1', name: 'Operator', goals: ['Review approvals'] },
		],
		domainObjects: [
			{ id: 'domain_1', name: 'ApprovalRequest', fields: ['status', 'owner'] },
		],
		workflows: [
			{ id: 'workflow_1', name: 'Approval flow', steps: ['submit', 'review'] },
		],
		surfaces: [
			{ id: 'surface_1', name: 'Dashboard', summary: 'Approval queue' },
		],
		integrations: [],
		policies: ['approval required before publish'],
		runtimeProfiles: [
			{
				id: 'runtime_managed',
				label: 'Managed',
				runtimeMode: 'managed',
				status: 'approved',
			},
		],
		channelSurfaces: [
			{
				channel: 'mobile_web',
				purpose: 'builder_control',
				enabled: true,
			},
		],
		featureParity: [
			{
				featureKey: 'approval.review',
				label: 'Review approvals',
				mobileSupport: 'full',
				channelSupport: ['mobile_web'],
				approvalStrengthRequired: 'bound_channel_ack',
				evidenceShape: 'receipt_with_harness',
			},
		],
		assumptions: [],
		openQuestions: [],
		coverageReport: {
			explicitCount: 1,
			inferredCount: 0,
			conflictedCount: 0,
			missingCount: 0,
			fields: [
				{
					fieldPath: 'brief',
					sourceIds: ['src_1'],
					decisionReceiptIds: [],
					explicit: true,
					conflicted: false,
					locked: false,
					confidence: 0.95,
				},
			],
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
	const evidenceBundleRef = {
		id: 'evidence_1',
		runId: 'run_1',
		artifactIds: ['artifact_1'],
		classes: ['builder-readiness'],
		createdAt: FIXED_NOW,
		summary: 'Builder readiness evaluation',
	};
	return {
		id: 'readiness_1',
		workspaceId,
		overallStatus: 'export_ready',
		score: 100,
		supportedRuntimeModes: ['managed'],
		managedReady: true,
		localReady: false,
		hybridReady: false,
		mobileParityStatus: 'full',
		blockingIssues: [],
		warnings: [],
		sourceCoverage: blueprint.coverageReport,
		policySummary: blueprint.policies,
		channelSummary: [
			{
				channel: 'mobile_web',
				ready: true,
				blockers: [],
			},
		],
		providerSummary: {
			runs: 1,
			verifiedRuns: 1,
			comparisonRuns: 0,
			activeProviderIds: ['provider.codex'],
		},
		runtimeSummary: {
			selectedDefault: 'managed',
			registeredTargets: [],
			healthyTargetIds: [],
		},
		requiredApprovals: [],
		harnessRunRefs: [evidenceBundleRef],
		evidenceBundleRef,
		recommendedNextAction: 'Proceed to export.',
		assumptionsSummary: '0 assumptions remain in the blueprint.',
	};
}

function createExecutionReceipt(workspaceId: string): ExternalExecutionReceipt {
	return {
		id: 'receipt_1',
		workspaceId,
		runId: 'run_1',
		providerId: 'provider.codex',
		providerKind: 'coding',
		modelId: 'gpt-5.4',
		taskType: 'propose_patch',
		runtimeMode: 'managed',
		contextBundleId: 'ctx_1',
		contextHash: 'ctx_hash_1',
		outputArtifactHashes: ['artifact_hash_1'],
		status: 'succeeded',
		startedAt: FIXED_NOW,
		completedAt: FIXED_NOW,
		verificationRefs: ['verify_1'],
	};
}

describe('builder runtime service', () => {
	it('bootstraps a managed Builder workspace through the canonical workspace command', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store);

		const result = (await service.executeCommand(
			'builder.workspace.bootstrap',
			{
				workspaceId: 'ws_bootstrap',
				payload: {
					preset: 'managed_mvp',
				},
			}
		)) as {
			workspaceId: string;
			createdWorkspace: boolean;
			runtimeTargetIds: string[];
			providerIds: string[];
			defaultProviderProfileId?: string;
		} | null;

		expect(result?.workspaceId).toBe('ws_bootstrap');
		expect(result?.createdWorkspace).toBe(true);
		expect(result?.runtimeTargetIds).toEqual(['rt_managed_default']);
		expect(result?.providerIds).toEqual(
			expect.arrayContaining([
				'provider.gemini',
				'provider.codex',
				'provider.stt.default',
			])
		);
		expect(result?.defaultProviderProfileId).toBe('provider.gemini');

		const snapshot = (await service.executeQuery('builder.workspace.snapshot', {
			workspaceId: 'ws_bootstrap',
		})) as BuilderWorkspaceSnapshot | null;

		expect(snapshot?.workspace.preferredProviderProfileId).toBe(
			'provider.gemini'
		);
		expect(
			snapshot?.runtimeTargets.some(
				(target) =>
					target.runtimeMode === 'managed' &&
					target.registrationState === 'registered'
			)
		).toBe(true);
		expect(
			snapshot?.externalProviders.some(
				(provider) =>
					provider.providerKind === 'conversational' &&
					provider.id === 'provider.gemini'
			)
		).toBe(true);
		expect(snapshot?.routingPolicy?.defaultProviderProfileId).toBe(
			'provider.gemini'
		);
	});

	it('supports local-daemon and hybrid bootstrap presets with explicit default runtime modes', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store);

		const localResult = (await service.executeCommand(
			'builder.workspace.bootstrap',
			{
				workspaceId: 'ws_local_bootstrap',
				payload: {
					preset: 'local_daemon_mvp',
				},
			}
		)) as { defaultRuntimeMode?: string } | null;
		const hybridResult = (await service.executeCommand(
			'builder.workspace.bootstrap',
			{
				workspaceId: 'ws_hybrid_bootstrap',
				payload: {
					preset: 'hybrid_mvp',
				},
			}
		)) as { defaultRuntimeMode?: string } | null;

		expect(localResult?.defaultRuntimeMode).toBe('local');
		expect(hybridResult?.defaultRuntimeMode).toBe('hybrid');
		const localWorkspace = (await service.executeQuery(
			'builder.workspace.get',
			{
				workspaceId: 'ws_local_bootstrap',
			}
		)) as { defaultRuntimeMode?: string } | null;
		expect(localWorkspace?.defaultRuntimeMode).toBe('local');
	});

	it('registers a local daemon runtime target with handshake, trust, and lease defaults', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store);
		const workspaceId = await createWorkspace(service, 'ws_local_runtime');

		const target = (await service.executeCommand(
			'builder.runtimeTarget.registerLocalDaemon',
			{
				workspaceId,
				entityId: 'rt_local_daemon',
				payload: {
					grantedTo: 'operator_1',
					availableProviders: ['provider.codex'],
				},
			}
		)) as {
			runtimeMode: string;
			capabilityHandshake?: { networkReachability: string };
			trustProfile?: { controller: string };
			lease?: { grantedTo: string };
		} | null;

		expect(target?.runtimeMode).toBe('local');
		expect(target?.capabilityHandshake?.networkReachability).toBe('restricted');
		expect(target?.trustProfile?.controller).toBe('tenant_local');
		expect(target?.lease?.grantedTo).toBe('operator_1');
	});

	it('ingests zip bundles into child sources', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store);
		const workspaceId = await createWorkspace(service);
		const archive = zipSync({
			'notes.md': Buffer.from('# Requirements'),
			'policy.json': Buffer.from('{"approval":true}'),
		});

		await service.executeCommand('builder.source.uploadAsset', {
			workspaceId,
			payload: {
				workspaceId,
				sourceType: 'file',
				title: 'bundle.zip',
				filename: 'bundle.zip',
				mimeType: 'application/zip',
				content: Buffer.from(archive).toString('base64'),
			},
		});

		const sources = await store.listSources(workspaceId);
		expect(sources.some((source) => source.sourceType === 'zip_entry')).toBe(
			true
		);
	});

	it('returns a workbench snapshot query with aggregated state', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store);
		const workspaceId = await createWorkspace(service);

		await service.executeCommand('builder.participantBinding.bind', {
			workspaceId,
			entityId: 'binding_1',
			payload: {
				participantId: 'owner_1',
				workspaceRole: 'owner',
				channelType: 'telegram',
				externalIdentityRef: 'telegram:owner_1',
				identityAssurance: 'high',
				channelBindingStrength: 'high',
				messageAuthenticity: 'high',
				approvalStrength: 'admin_signed',
				allowedActions: ['builder.blueprint.patch'],
			},
		});
		await service.executeCommand('builder.conversation.start', {
			workspaceId,
			entityId: 'conversation_1',
			payload: {
				mode: 'mixed',
				boundChannelIds: ['telegram'],
			},
		});
		await service.executeCommand('builder.channel.receiveInbound', {
			workspaceId,
			conversationId: 'conversation_1',
			payload: {
				workspaceId,
				conversationId: 'conversation_1',
				channelType: 'telegram',
				externalConversationId: 'thread_1',
				externalMessageId: 'message_1',
				participantBindingId: 'binding_1',
				messageKind: 'text',
				text: 'Create an internal dashboard for approvals.',
			},
		});

		const snapshot = (await service.executeQuery('builder.workbench.snapshot', {
			workspaceId,
		})) as BuilderWorkspaceSnapshot | null;

		expect(snapshot?.participantBindings.length).toBe(1);
		expect(snapshot?.sources.length).toBeGreaterThan(0);
		expect(snapshot?.messages.length).toBe(1);
	});

	it('deduplicates replayed channel deliveries with the same external message revision', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store);
		const workspaceId = await createWorkspace(service);

		await service.executeCommand('builder.conversation.start', {
			workspaceId,
			entityId: 'conversation_1',
		});
		await service.executeCommand('builder.channel.receiveInbound', {
			workspaceId,
			conversationId: 'conversation_1',
			payload: {
				workspaceId,
				conversationId: 'conversation_1',
				channelType: 'telegram',
				externalConversationId: 'thread_1',
				externalMessageId: 'message_1',
				messageKind: 'text',
				text: 'Create an approvals workspace.',
			},
		});
		await service.executeCommand('builder.channel.receiveInbound', {
			workspaceId,
			conversationId: 'conversation_1',
			payload: {
				workspaceId,
				conversationId: 'conversation_1',
				channelType: 'telegram',
				externalConversationId: 'thread_1',
				externalMessageId: 'message_1',
				messageKind: 'text',
				text: 'Create an approvals workspace.',
			},
		});

		const snapshot = (await service.executeQuery('builder.workbench.snapshot', {
			workspaceId,
		})) as BuilderWorkspaceSnapshot | null;

		expect(snapshot?.messages.length).toBe(1);
		expect(snapshot?.sources.length).toBe(1);
		expect(snapshot?.directives.length).toBe(1);
	});

	it('requires approval for a high-risk structured channel operation', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store);
		const workspaceId = await createWorkspace(service);

		await service.executeCommand('builder.participantBinding.bind', {
			workspaceId,
			entityId: 'binding_1',
			payload: {
				participantId: 'owner_1',
				workspaceRole: 'owner',
				channelType: 'whatsapp',
				externalIdentityRef: 'wa:+331234',
				identityAssurance: 'high',
				channelBindingStrength: 'high',
				messageAuthenticity: 'high',
				approvalStrength: 'admin_signed',
				allowedActions: ['builder.blueprint.patch'],
			},
		});
		await service.executeCommand('builder.conversation.start', {
			workspaceId,
			entityId: 'conversation_1',
		});
		await service.executeCommand('builder.channel.receiveInbound', {
			workspaceId,
			conversationId: 'conversation_1',
			payload: {
				workspaceId,
				conversationId: 'conversation_1',
				channelType: 'whatsapp',
				externalConversationId: 'thread_1',
				externalMessageId: 'message_1',
				participantBindingId: 'binding_1',
				messageKind: 'text',
				text: 'Create an approval workspace.',
			},
		});
		const directives = await store.listDirectives(workspaceId);
		await service.executeCommand('builder.directive.accept', {
			workspaceId,
			entityId: directives[0]?.id,
		});
		await service.executeCommand('builder.blueprint.generate', { workspaceId });

		await service.executeCommand('builder.channel.receiveInbound', {
			workspaceId,
			conversationId: 'conversation_1',
			payload: {
				workspaceId,
				conversationId: 'conversation_1',
				channelType: 'whatsapp',
				externalConversationId: 'thread_1',
				externalMessageId: 'message_2',
				participantBindingId: 'binding_1',
				messageKind: 'button',
				text: 'remove auth',
				metadata: {
					operation: {
						fieldPath: 'policies',
						mode: 'append',
						value: 'remove auth from the exported app',
						confirmationStep: 1,
					},
				},
			},
		});

		const approvals = await store.listApprovalTickets(workspaceId);
		expect(approvals.length).toBe(1);
		expect(approvals[0]?.riskLevel).toBe('high');
	});

	it('applies a medium-risk structured channel operation with a strong bound ack', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store);
		const workspaceId = await createWorkspace(service);

		await service.executeCommand('builder.participantBinding.bind', {
			workspaceId,
			entityId: 'binding_1',
			payload: {
				participantId: 'editor_1',
				workspaceRole: 'editor',
				channelType: 'telegram',
				externalIdentityRef: 'telegram:editor_1',
				identityAssurance: 'high',
				channelBindingStrength: 'high',
				messageAuthenticity: 'high',
				approvalStrength: 'bound_channel_ack',
				allowedActions: ['builder.blueprint.patch'],
			},
		});
		await service.executeCommand('builder.conversation.start', {
			workspaceId,
			entityId: 'conversation_1',
		});
		await service.executeCommand('builder.channel.receiveInbound', {
			workspaceId,
			conversationId: 'conversation_1',
			payload: {
				workspaceId,
				conversationId: 'conversation_1',
				channelType: 'telegram',
				externalConversationId: 'thread_1',
				externalMessageId: 'message_1',
				participantBindingId: 'binding_1',
				messageKind: 'text',
				text: 'Create a manager dashboard.',
			},
		});
		const directives = await store.listDirectives(workspaceId);
		await service.executeCommand('builder.directive.accept', {
			workspaceId,
			entityId: directives[0]?.id,
		});
		await service.executeCommand('builder.blueprint.generate', { workspaceId });

		await service.executeCommand('builder.channel.receiveInbound', {
			workspaceId,
			conversationId: 'conversation_1',
			payload: {
				workspaceId,
				conversationId: 'conversation_1',
				channelType: 'telegram',
				externalConversationId: 'thread_1',
				externalMessageId: 'message_2',
				participantBindingId: 'binding_1',
				messageKind: 'button',
				text: 'approval rule',
				metadata: {
					operation: {
						fieldPath: 'policies',
						mode: 'append',
						value: 'approval required before payout',
						confirmationStep: 1,
					},
				},
			},
		});

		const blueprint = await store.getBlueprint(workspaceId);
		expect(blueprint?.policies).toContain('approval required before payout');
	});

	it('deduplicates exact channel deliveries and links replay revisions', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store);
		const workspaceId = await createWorkspace(service);

		const first = (await service.executeCommand(
			'builder.channel.receiveInbound',
			{
				workspaceId,
				conversationId: 'conversation_1',
				payload: {
					workspaceId,
					conversationId: 'conversation_1',
					channelType: 'telegram',
					externalConversationId: 'thread_1',
					externalEventId: 'evt_1',
					externalMessageId: 'message_1',
					messageRevision: 1,
					messageKind: 'text',
					text: 'Create an approvals dashboard',
				},
			}
		)) as {
			message: { id: string; supersedesMessageId?: string };
			source: { id: string; supersedesSourceId?: string };
		};
		const duplicate = (await service.executeCommand(
			'builder.channel.receiveInbound',
			{
				workspaceId,
				conversationId: 'conversation_1',
				payload: {
					workspaceId,
					conversationId: 'conversation_1',
					channelType: 'telegram',
					externalConversationId: 'thread_1',
					externalEventId: 'evt_1',
					externalMessageId: 'message_1',
					messageRevision: 1,
					messageKind: 'text',
					text: 'Create an approvals dashboard',
				},
			}
		)) as {
			message: { id: string };
			source: { id: string };
		};
		const edited = (await service.executeCommand('builder.channel.recordEdit', {
			workspaceId,
			conversationId: 'conversation_1',
			payload: {
				workspaceId,
				conversationId: 'conversation_1',
				channelType: 'telegram',
				externalConversationId: 'thread_1',
				externalEventId: 'evt_2',
				externalMessageId: 'message_1',
				messageRevision: 2,
				messageKind: 'text',
				text: 'Create an approvals dashboard with an export gate',
				editedAt: '2026-04-07T12:05:00.000Z',
			},
		})) as {
			message: { id: string; supersedesMessageId?: string };
			source: { id: string; supersedesSourceId?: string };
		};

		const messages = await store.listChannelMessages('conversation_1');
		const sources = await store.listSources(workspaceId);
		const directives = await store.listDirectives(workspaceId);

		expect(duplicate.message.id).toBe(first.message.id);
		expect(messages).toHaveLength(2);
		expect(sources).toHaveLength(2);
		expect(directives).toHaveLength(2);
		expect(edited.message.supersedesMessageId).toBe(first.message.id);
		expect(edited.source.supersedesSourceId).toBe(first.source.id);
	});

	it('prepares deterministic export artifacts once preview and readiness exist', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store);
		const workspaceId = await createWorkspace(service);
		const blueprint = createBlueprint(workspaceId);

		await store.saveBlueprint(blueprint);
		await service.executeCommand('builder.preview.create', {
			workspaceId,
			payload: {
				runtimeMode: 'managed',
			},
		});
		await store.saveReadinessReport(
			createReadinessReport(workspaceId, blueprint)
		);
		await store.saveExecutionReceipt(createExecutionReceipt(workspaceId));

		const first = (await service.executeCommand('builder.export.prepare', {
			workspaceId,
			payload: {
				runtimeMode: 'managed',
			},
		})) as {
			artifactRefs: string[];
			verificationRef: string;
		} | null;
		const second = (await service.executeCommand('builder.export.prepare', {
			workspaceId,
			payload: {
				runtimeMode: 'managed',
			},
		})) as {
			artifactRefs: string[];
			verificationRef: string;
		} | null;

		expect(first).not.toBeNull();
		expect(second).not.toBeNull();
		if (!first || !second) {
			return;
		}
		expect(first.artifactRefs).toEqual(second.artifactRefs);
		expect(first.verificationRef).toBe(second.verificationRef);
		expect(first.artifactRefs[0]).toMatch(/^builder:\/\/artifact\/export\//);
	});

	it('surfaces routing-policy fallback guidance when a provider run fails', async () => {
		const store = new InMemoryBuilderStore();
		const service = new BuilderRuntimeService(store);
		const workspaceId = await createWorkspace(service);
		await store.saveBlueprint(createBlueprint(workspaceId));

		await service.executeCommand('builder.provider.register', {
			workspaceId,
			entityId: 'provider_primary',
			payload: {
				providerKind: 'coding',
				displayName: 'Primary Coding Provider',
				integrationPackage: '@contractspec/integration.provider.primary',
				supportedRuntimeModes: ['managed'],
				supportedTaskTypes: ['propose_patch'],
				supportsRepoScopedPatch: true,
				supportsStructuredDiff: true,
				supportsLongContext: true,
				supportsFunctionCalling: true,
				supportsStreaming: true,
				defaultRiskPolicy: {
					propose_patch: 'high',
				},
			},
		});
		await service.executeCommand('builder.provider.register', {
			workspaceId,
			entityId: 'provider_fallback',
			payload: {
				providerKind: 'coding',
				displayName: 'Fallback Coding Provider',
				integrationPackage: '@contractspec/integration.provider.fallback',
				supportedRuntimeModes: ['managed'],
				supportedTaskTypes: ['propose_patch'],
				supportsRepoScopedPatch: true,
				supportsStructuredDiff: true,
				supportsLongContext: true,
				supportsFunctionCalling: true,
				supportsStreaming: true,
				defaultRiskPolicy: {
					propose_patch: 'medium',
				},
			},
		});
		await service.executeCommand('builder.providerRoutingPolicy.upsert', {
			workspaceId,
			payload: {
				taskRules: [
					{
						taskType: 'propose_patch',
						preferredProviders: ['provider_primary'],
						fallbackProviders: ['provider_fallback'],
					},
				],
				riskRules: [],
				runtimeModeRules: [],
				comparisonRules: [],
				fallbackRules: [
					{
						onFailure: 'provider_failed',
						action: 'fallback_or_escalate',
					},
				],
			},
		});

		await service.executeCommand('builder.providerExecution.ingestOutput', {
			workspaceId,
			entityId: 'receipt_failure_1',
			payload: {
				providerId: 'provider_primary',
				taskType: 'propose_patch',
				runtimeMode: 'managed',
				status: 'failed',
				startedAt: FIXED_NOW,
				completedAt: FIXED_NOW,
				contextHash: 'ctx_hash_failed',
				artifactRefs: ['artifact://failed'],
				verificationRefs: ['verify_failed'],
			},
		});

		const snapshot = (await service.executeQuery('builder.workbench.snapshot', {
			workspaceId,
		})) as BuilderWorkspaceSnapshot | null;
		const failureActivity = snapshot?.providerActivity.find(
			(activity) => activity.receiptId === 'receipt_failure_1'
		);

		expect(failureActivity?.status).toBe('failed');
		expect(failureActivity?.recommendedAction).toBe('fallback_or_escalate');
		expect(failureActivity?.fallbackProviderIds).toEqual(['provider_fallback']);
		expect(failureActivity?.reason).toContain('same-mode fallback');
	});
});
