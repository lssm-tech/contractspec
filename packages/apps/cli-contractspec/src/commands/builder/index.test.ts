import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import {
	runBuilderComparisonStatusCommand,
	runBuilderInitCommand,
	runBuilderLocalRegisterCommand,
	runBuilderLocalStatusCommand,
	runBuilderMobileStatusCommand,
	runBuilderStatusCommand,
} from './actions';
import { builderCommand } from './index';

const originalFetch = globalThis.fetch;
const originalApiBaseUrl = process.env.CONTRACTSPEC_API_BASE_URL;
const originalToken = process.env.CONTROL_PLANE_API_TOKEN;
const originalConsoleLog = console.log;

describe('builder command', () => {
	beforeEach(() => {
		process.env.CONTRACTSPEC_API_BASE_URL = 'http://localhost/';
		process.env.CONTROL_PLANE_API_TOKEN = 'builder-token';
		console.log = mock(() => {}) as typeof console.log;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		process.env.CONTRACTSPEC_API_BASE_URL = originalApiBaseUrl;
		process.env.CONTROL_PLANE_API_TOKEN = originalToken;
		console.log = originalConsoleLog;
	});

	it('exposes init and status subcommands with workspace-id options', () => {
		expect(builderCommand.commands.map((command) => command.name())).toEqual([
			'init',
			'status',
			'mobile-status',
			'comparison-status',
			'local',
		]);
		expect(
			builderCommand.commands
				.find((command) => command.name() === 'init')
				?.options.map((option) => option.long)
		).toContain('--workspace-id');
		expect(
			builderCommand.commands
				.find((command) => command.name() === 'status')
				?.options.map((option) => option.long)
		).toContain('--workspace-id');
		expect(
			builderCommand.commands
				.find((command) => command.name() === 'local')
				?.commands.map((command) => command.name())
		).toEqual(['register', 'status']);
	});

	it('calls the Builder bootstrap API for init and renders a status summary from the snapshot', async () => {
		const fetchMock = mock(async (input: string | URL) => {
			const url = String(input);
			if (
				url.includes('/internal/builder/commands/builder.workspace.bootstrap')
			) {
				return new Response(
					JSON.stringify({
						ok: true,
						result: {
							workspaceId: 'ws_cli',
							preset: 'managed_mvp',
							createdWorkspace: true,
							runtimeTargetIds: ['rt_managed_default'],
							providerIds: [
								'provider.gemini',
								'provider.codex',
								'provider.stt.default',
							],
							routingPolicyId: 'routing_1',
							defaultProviderProfileId: 'provider.gemini',
							defaultRuntimeMode: 'managed',
						},
					}),
					{ status: 200 }
				);
			}
			return new Response(
				JSON.stringify({
					ok: true,
					result: {
						workspace: {
							id: 'ws_cli',
							tenantId: 'tenant_1',
							name: 'CLI Workspace',
							status: 'draft',
							appClass: 'internal_workflow',
							defaultRuntimeMode: 'managed',
							preferredProviderProfileId: 'provider.gemini',
							mobileParityRequired: true,
							ownerIds: ['owner_1'],
							defaultLocale: 'en',
							defaultChannelPolicy: {},
							createdAt: '2026-04-09T00:00:00.000Z',
							updatedAt: '2026-04-09T00:00:00.000Z',
						},
						participantBindings: [],
						conversations: [],
						sources: [],
						rawAssets: [],
						extractedParts: [],
						evidenceReferences: [],
						messages: [],
						transcripts: [],
						directives: [],
						assumptions: [],
						conflicts: [],
						decisionReceipts: [],
						fusionGraphEdges: [],
						blueprint: null,
						plan: null,
						approvalTickets: [],
						preview: null,
						readinessReport: null,
						exportBundle: null,
						runtimeTargets: [
							{
								id: 'rt_managed_default',
								workspaceId: 'ws_cli',
								type: 'managed_workspace',
								runtimeMode: 'managed',
								displayName: 'Managed Builder Runtime',
								registrationState: 'registered',
								capabilityProfile: {
									supportsPreview: true,
									supportsExport: true,
									supportsMobileInspection: true,
									supportsLocalExecution: false,
									availableProviders: [],
									dataLocality: 'managed',
								},
								networkPolicy: 'managed-default',
								dataLocality: 'managed',
								secretHandlingMode: 'managed',
								createdAt: '2026-04-09T00:00:00.000Z',
								updatedAt: '2026-04-09T00:00:00.000Z',
							},
						],
						externalProviders: [
							{ id: 'provider.gemini', providerKind: 'conversational' },
							{ id: 'provider.codex', providerKind: 'coding' },
							{ id: 'provider.stt.default', providerKind: 'stt' },
						],
						routingPolicy: {
							id: 'routing_1',
							workspaceId: 'ws_cli',
							taskRules: [],
							riskRules: [],
							runtimeModeRules: [],
							comparisonRules: [
								{
									taskType: 'propose_patch',
									riskLevelAtOrAbove: 'high',
									comparisonMode: 'dual_provider',
								},
							],
							fallbackRules: [],
							defaultProviderProfileId: 'provider.gemini',
							updatedAt: '2026-04-09T00:00:00.000Z',
						},
						executionContextBundles: [],
						executionReceipts: [],
						patchProposals: [],
						comparisonRuns: [],
						mobileReviewCards: [],
						decisionLedger: { decisions: [], inferences: [] },
						sourceTimeline: [],
						providerProposalRegister: [],
						providerActivity: [],
						stableMemory: {
							approvedDecisionIds: [],
							lockedFieldPaths: [],
							approvedSnapshotSourceIds: [],
							exportBundleIds: [],
						},
						workingMemory: {
							messageIds: [],
							directiveIds: [],
							assumptionIds: [],
							conflictIds: [],
							pendingApprovalIds: [],
						},
					},
				}),
				{ status: 200 }
			);
		});
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		await runBuilderInitCommand({
			workspaceId: 'ws_cli',
			preset: 'managed-mvp',
		});
		const status = await runBuilderStatusCommand({ workspaceId: 'ws_cli' });

		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
			'/internal/builder/commands/builder.workspace.bootstrap'
		);
		expect(status.managedBootstrapComplete).toBe(true);
		expect(status.bootstrapMode).toBe('managed');
		expect(status.comparisonHighRiskEnabled).toBe(true);
		expect(status.defaultProviderProfileId).toBe('provider.gemini');
	});

	it('supports local daemon registration plus focused mobile and comparison status views', async () => {
		const fetchMock = mock(async (input: string | URL) => {
			const url = String(input);
			if (url.includes('builder.runtimeTarget.registerLocalDaemon')) {
				return new Response(
					JSON.stringify({
						ok: true,
						result: {
							id: 'rt_local_daemon',
							registrationState: 'registered',
						},
					}),
					{ status: 200 }
				);
			}
			return new Response(
				JSON.stringify({
					ok: true,
					result: {
						workspace: {
							id: 'ws_cli',
							tenantId: 'tenant_1',
							name: 'CLI Workspace',
							status: 'draft',
							appClass: 'internal_workflow',
							defaultRuntimeMode: 'local',
							preferredProviderProfileId: 'provider.local.model',
							mobileParityRequired: true,
							ownerIds: ['owner_1'],
							defaultLocale: 'en',
							defaultChannelPolicy: {},
							createdAt: '2026-04-09T00:00:00.000Z',
							updatedAt: '2026-04-09T00:00:00.000Z',
						},
						participantBindings: [],
						conversations: [],
						sources: [],
						rawAssets: [],
						extractedParts: [],
						evidenceReferences: [],
						messages: [],
						transcripts: [],
						directives: [],
						assumptions: [],
						conflicts: [],
						decisionReceipts: [],
						fusionGraphEdges: [],
						blueprint: {
							featureParity: [],
						},
						plan: null,
						approvalTickets: [],
						preview: null,
						readinessReport: {
							id: 'rr_1',
							workspaceId: 'ws_cli',
							overallStatus: 'needs_review',
							score: 80,
							supportedRuntimeModes: ['managed', 'local'],
							managedReady: true,
							localReady: true,
							hybridReady: false,
							mobileParityStatus: 'partial',
							mobileParitySummary: {
								channelNativeFeatures: ['approval.review'],
								deepLinkFeatures: ['diff.review'],
								blockedFeatures: [],
								channelNativeActionCount: 3,
								deepLinkActionCount: 1,
							},
							blockingIssues: [],
							warnings: [],
							sourceCoverage: {
								explicitCount: 0,
								inferredCount: 0,
								conflictedCount: 0,
								missingCount: 0,
								fields: [],
							},
							policySummary: [],
							channelSummary: [],
							providerSummary: {
								runs: 0,
								verifiedRuns: 0,
								comparisonRuns: 1,
								activeProviderIds: [],
							},
							runtimeSummary: {
								selectedDefault: 'local',
								registeredTargets: ['rt_local_daemon'],
								healthyTargetIds: ['rt_local_daemon'],
							},
							requiredApprovals: [],
							harnessRunRefs: [],
							evidenceBundleRef: {
								id: 'evidence_1',
								runId: 'run_1',
								artifactIds: [],
								classes: [],
								createdAt: '2026-04-09T00:00:00.000Z',
							},
							recommendedNextAction: 'Review',
						},
						exportBundle: null,
						runtimeTargets: [
							{
								id: 'rt_local_daemon',
								workspaceId: 'ws_cli',
								type: 'local_daemon',
								runtimeMode: 'local',
								displayName: 'Local Builder Runtime',
								registrationState: 'registered',
								capabilityProfile: {
									supportsPreview: true,
									supportsExport: true,
									supportsMobileInspection: true,
									supportsLocalExecution: true,
									availableProviders: ['provider.codex'],
									dataLocality: 'local',
								},
								networkPolicy: 'tenant-local',
								dataLocality: 'local',
								secretHandlingMode: 'local',
								capabilityHandshake: {
									id: 'hs_1',
									workspaceId: 'ws_cli',
									runtimeTargetId: 'rt_local_daemon',
									supportedModes: ['local'],
									availableProviders: ['provider.codex'],
									storageProfile: 'local-daemon-cache',
									networkReachability: 'restricted',
									artifactSizeLimitMb: 50,
									localUiSupport: false,
									capturedAt: '2026-04-09T00:00:00.000Z',
								},
								trustProfile: {
									controller: 'tenant_local',
									secretsLocation: 'local_only',
									outboundNetworkAllowed: true,
									managedRelayAllowed: false,
									evidenceEgressPolicy: 'summaries_only',
								},
								lease: {
									id: 'lease_1',
									workspaceId: 'ws_cli',
									runtimeTargetId: 'rt_local_daemon',
									grantedTo: 'operator_1',
									allowedScopes: ['preview'],
									expiresAt: '2026-04-10T00:00:00.000Z',
									status: 'active',
								},
								createdAt: '2026-04-09T00:00:00.000Z',
								updatedAt: '2026-04-09T00:00:00.000Z',
							},
						],
						externalProviders: [
							{ id: 'provider.local.model', providerKind: 'routing_helper' },
							{ id: 'provider.codex', providerKind: 'coding' },
							{ id: 'provider.stt.default', providerKind: 'stt' },
							{ id: 'provider.gemini', providerKind: 'conversational' },
						],
						routingPolicy: {
							id: 'routing_1',
							workspaceId: 'ws_cli',
							taskRules: [],
							riskRules: [],
							runtimeModeRules: [],
							comparisonRules: [
								{
									taskType: 'propose_patch',
									riskLevelAtOrAbove: 'high',
									comparisonMode: 'dual_provider',
								},
							],
							fallbackRules: [],
							defaultProviderProfileId: 'provider.local.model',
							updatedAt: '2026-04-09T00:00:00.000Z',
						},
						executionContextBundles: [],
						executionReceipts: [],
						patchProposals: [],
						comparisonRuns: [
							{
								id: 'comparison_1',
								workspaceId: 'ws_cli',
								taskType: 'propose_patch',
								riskLevel: 'high',
								mode: 'dual_provider',
								providerIds: ['provider.codex', 'provider.claude.code'],
								receiptIds: [],
								verdict: {
									summary: 'Codex selected.',
									evidenceRefs: [],
									confidence: 0.8,
								},
								status: 'completed',
								createdAt: '2026-04-09T00:00:00.000Z',
								updatedAt: '2026-04-09T00:00:00.000Z',
							},
						],
						mobileReviewCards: [],
						decisionLedger: { decisions: [], inferences: [] },
						sourceTimeline: [],
						providerProposalRegister: [],
						providerActivity: [],
						stableMemory: {
							approvedDecisionIds: [],
							lockedFieldPaths: [],
							approvedSnapshotSourceIds: [],
							exportBundleIds: [],
						},
						workingMemory: {
							messageIds: [],
							directiveIds: [],
							assumptionIds: [],
							conflictIds: [],
							pendingApprovalIds: [],
						},
					},
				}),
				{ status: 200 }
			);
		});
		globalThis.fetch = fetchMock as unknown as typeof fetch;

		await runBuilderLocalRegisterCommand({
			workspaceId: 'ws_cli',
			runtimeId: 'rt_local_daemon',
			grantedTo: 'operator_1',
			provider: ['provider.codex'],
		});
		const localStatus = await runBuilderLocalStatusCommand({
			workspaceId: 'ws_cli',
		});
		const mobileStatus = await runBuilderMobileStatusCommand({
			workspaceId: 'ws_cli',
		});
		const comparisonStatus = await runBuilderComparisonStatusCommand({
			workspaceId: 'ws_cli',
		});

		expect(localStatus.runtimeTargetId).toBe('rt_local_daemon');
		expect(localStatus.grantedTo).toBe('operator_1');
		expect(mobileStatus.channelNativeActionCount).toBe(3);
		expect(comparisonStatus.highRiskComparisonEnabled).toBe(true);
	});
});
