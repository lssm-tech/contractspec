import { describe, expect, it } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { MobileReviewPanel } from './MobileReviewPanel';
import { PreviewWorkspacePanel } from './PreviewWorkspacePanel';
import { ProviderActivityPanel } from './ProviderActivityPanel';
import { RuntimeTargetManagerPanel } from './RuntimeTargetManagerPanel';

describe('builder workbench actionable panels', () => {
	it('renders provider review actions and comparison details', () => {
		const html = renderToStaticMarkup(
			<ProviderActivityPanel
				activity={[
					{
						id: 'activity_1',
						workspaceId: 'ws_1',
						taskType: 'propose_patch',
						status: 'failed',
						receiptId: 'receipt_1',
						providerId: 'provider.codex',
						reason: 'Routing policy permits a same-mode fallback provider.',
						recommendedAction: 'fallback_or_escalate',
						fallbackProviderIds: ['provider.claude.code'],
						recordedAt: '2026-04-08T09:00:00.000Z',
					},
				]}
				providers={[]}
				receipts={[
					{
						id: 'receipt_1',
						workspaceId: 'ws_1',
						runId: 'run_1',
						providerId: 'provider.codex',
						providerKind: 'coding',
						taskType: 'propose_patch',
						runtimeMode: 'managed',
						contextBundleId: 'ctx_1',
						contextHash: 'hash_1',
						outputArtifactHashes: ['artifact_1'],
						status: 'succeeded',
						startedAt: '2026-04-08T09:00:00.000Z',
						completedAt: '2026-04-08T09:01:00.000Z',
						verificationRefs: ['verify_1'],
					},
				]}
				patchProposals={[
					{
						id: 'proposal_1',
						workspaceId: 'ws_1',
						receiptId: 'receipt_1',
						runId: 'run_1',
						summary: 'Patch the approval policy',
						changedAreas: ['policies'],
						diffHash: 'diff_1',
						outputArtifactRefs: ['artifact_1'],
						allowedWriteScopes: ['packages/apps/web-landing'],
						riskLevel: 'high',
						verificationRequirements: ['Run readiness'],
						status: 'proposed',
						createdAt: '2026-04-08T09:00:00.000Z',
						updatedAt: '2026-04-08T09:00:00.000Z',
					},
				]}
				comparisonRuns={[
					{
						id: 'comparison_1',
						workspaceId: 'ws_1',
						taskType: 'propose_patch',
						riskLevel: 'high',
						mode: 'dual_provider',
						providerIds: ['provider.codex', 'provider.claude.code'],
						receiptIds: ['receipt_1'],
						verdict: {
							recommendedProviderId: 'provider.codex',
							summary: 'Codex produced the smaller verified diff.',
							evidenceRefs: ['receipt_1'],
							confidence: 0.89,
						},
						status: 'completed',
						createdAt: '2026-04-08T09:00:00.000Z',
						updatedAt: '2026-04-08T09:01:00.000Z',
					},
				]}
				routingPolicy={{
					id: 'policy_1',
					workspaceId: 'ws_1',
					taskRules: [],
					riskRules: [],
					runtimeModeRules: [],
					comparisonRules: [],
					fallbackRules: [],
					updatedAt: '2026-04-08T09:00:00.000Z',
				}}
				proposalRegister={[]}
			/>
		);

		expect(html).toContain('Patch the approval policy');
		expect(html).toContain('Provider: provider.codex · managed');
		expect(html).toContain('Accept');
		expect(html).toContain('Reject');
		expect(html).toContain('Codex produced the smaller verified diff.');
		expect(html).toContain('Next: fallback_or_escalate');
		expect(html).toContain('provider.claude.code');
	});

	it('renders runtime trust, handshake, and quarantine controls', () => {
		const html = renderToStaticMarkup(
			<RuntimeTargetManagerPanel
				runtimeTargets={[
					{
						id: 'rt_1',
						workspaceId: 'ws_1',
						type: 'hybrid_bridge',
						runtimeMode: 'hybrid',
						displayName: 'Hybrid Bridge',
						registrationState: 'registered',
						capabilityProfile: {
							supportsPreview: true,
							supportsExport: true,
							supportsMobileInspection: true,
							supportsLocalExecution: true,
							availableProviders: ['provider.codex'],
							dataLocality: 'mixed',
							networkReachability: 'restricted',
						},
						networkPolicy: 'restricted-egress',
						dataLocality: 'mixed',
						secretHandlingMode: 'mixed',
						capabilityHandshake: {
							id: 'hs_1',
							workspaceId: 'ws_1',
							runtimeTargetId: 'rt_1',
							supportedModes: ['hybrid'],
							availableProviders: ['provider.codex'],
							storageProfile: 'encrypted-cache',
							networkReachability: 'restricted',
							artifactSizeLimitMb: 50,
							localUiSupport: true,
							capturedAt: '2026-04-08T09:00:00.000Z',
						},
						trustProfile: {
							controller: 'shared',
							secretsLocation: 'mixed',
							outboundNetworkAllowed: true,
							managedRelayAllowed: false,
							evidenceEgressPolicy: 'summaries_only',
						},
						lastSeenAt: '2026-04-08T09:00:00.000Z',
						lastHealthSummary: 'Bridge healthy with restricted egress.',
						blockedReasons: [],
						createdAt: '2026-04-08T09:00:00.000Z',
						updatedAt: '2026-04-08T09:00:00.000Z',
					},
				]}
			/>
		);

		expect(html).toContain('Handshake:');
		expect(html).toContain('restricted');
		expect(html).toContain('Quarantine');
		expect(html).toContain('export ready');
	});

	it('renders mobile review actions and export lifecycle controls', () => {
		const mobileHtml = renderToStaticMarkup(
			<MobileReviewPanel
				featureParity={[
					{
						featureKey: 'approval.review',
						label: 'Approval review',
						mobileSupport: 'partial',
						channelSupport: ['mobile_web', 'telegram'],
						approvalStrengthRequired: 'admin_signed',
						evidenceShape: 'receipt_with_harness',
						statusNote:
							'Telegram review falls back to the dedicated mobile route.',
						mobileFallbackRef: 'builder://mobile-review/patch',
					},
				]}
				cards={[
					{
						id: 'card_1',
						workspaceId: 'ws_1',
						channelType: 'telegram',
						subjectType: 'patch_proposal',
						subjectId: 'proposal_1',
						summary: 'Review the policy patch',
						riskLevel: 'high',
						provider: {
							id: 'provider.codex',
							runId: 'run_1',
						},
						affectedAreas: ['policies'],
						evidence: {
							sourceRefs: ['src_1'],
							receiptId: 'receipt_1',
							harnessSummary: 'Harness passed.',
						},
						actions: [
							{ id: 'approve', label: 'Approve' },
							{ id: 'reject', label: 'Reject' },
							{ id: 'open_details', label: 'Open details' },
						],
						createdAt: '2026-04-08T09:00:00.000Z',
						updatedAt: '2026-04-08T09:00:00.000Z',
					},
				]}
			/>
		);
		const previewHtml = renderToStaticMarkup(
			<PreviewWorkspacePanel
				preview={{
					id: 'preview_1',
					workspaceId: 'ws_1',
					generatedWorkspaceRef: 'builder://workspace/ws_1/generated',
					dataMode: 'mock',
					runtimeMode: 'hybrid',
					buildStatus: 'ready',
					readinessSummary: 'Ready for export.',
					comparisonRunIds: [],
					mobileReviewCardIds: ['card_1'],
					createdAt: '2026-04-08T09:00:00.000Z',
					updatedAt: '2026-04-08T09:00:00.000Z',
				}}
				exportBundle={{
					id: 'export_1',
					workspaceId: 'ws_1',
					targetType: 'repo_pr',
					runtimeMode: 'hybrid',
					artifactRefs: ['artifact_1'],
					verificationRef: 'verify_1',
					receiptIds: ['receipt_1'],
					auditPackageRefs: ['audit_1'],
					approvedAt: '2026-04-08T09:02:00.000Z',
					exportedAt: '2026-04-08T09:03:00.000Z',
				}}
				selectedRuntimeMode="hybrid"
			/>
		);

		expect(mobileHtml).toContain('Approve');
		expect(mobileHtml).toContain('Open details');
		expect(mobileHtml).toContain('Harness passed.');
		expect(mobileHtml).toContain('builder://mobile-review/patch');
		expect(previewHtml).toContain('Approve Export');
		expect(previewHtml).toContain('Execute Export');
		expect(previewHtml).toContain('approved 2026-04-08T09:02:00.000Z');
	});
});
