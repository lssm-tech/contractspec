'use client';

import type { BuilderWorkspaceSnapshot } from '@contractspec/lib.builder-spec';
import { VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@contractspec/lib.ui-kit-web/ui/tabs';
import { summarizeBuilderWorkbench } from '../../core';
import { BlueprintEditorPanel } from './BlueprintEditorPanel';
import { FusionDecisionPanel } from './FusionDecisionPanel';
import { GuidedChatVoicePanel } from './GuidedChatVoicePanel';
import { MobileReviewPanel } from './MobileReviewPanel';
import { OmnichannelInboxPanel } from './OmnichannelInboxPanel';
import { PlanLaneConsolePanel } from './PlanLaneConsolePanel';
import { PreviewWorkspacePanel } from './PreviewWorkspacePanel';
import { ProviderActivityPanel } from './ProviderActivityPanel';
import { ReadinessReviewPanel } from './ReadinessReviewPanel';
import { RuntimeTargetManagerPanel } from './RuntimeTargetManagerPanel';
import { SourceInboxPanel } from './SourceInboxPanel';
import { WorkspaceHomeCard } from './WorkspaceHomeCard';

export function BuilderWorkbench(props: {
	snapshot: BuilderWorkspaceSnapshot;
	promptDraft: string;
	onPromptDraftChange?: (value: string) => void;
	onBriefChange?: (value: string) => void;
	onCapturePrompt?: () => void | Promise<void>;
	onGenerateBlueprint?: () => void | Promise<void>;
	onCompilePlan?: () => void | Promise<void>;
	onRegisterRecommendedTargets?: () => void | Promise<void>;
	onRegisterRecommendedProviders?: () => void | Promise<void>;
	onCreatePreview?: () => void | Promise<void>;
	onRunReadiness?: () => void | Promise<void>;
	onPrepareExport?: () => void | Promise<void>;
	onApproveExport?: () => void | Promise<void>;
	onExecuteExport?: () => void | Promise<void>;
	onAcceptPatchProposal?: (proposalId: string) => void | Promise<void>;
	onRejectPatchProposal?: (proposalId: string) => void | Promise<void>;
	onOpenPatchProposalReview?: (proposalId: string) => void | Promise<void>;
	onQuarantineRuntimeTarget?: (targetId: string) => void | Promise<void>;
	onApproveMobileReviewCard?: (cardId: string) => void | Promise<void>;
	onRejectMobileReviewCard?: (cardId: string) => void | Promise<void>;
	onAcknowledgeMobileReviewCard?: (cardId: string) => void | Promise<void>;
	onOpenMobileReviewDetails?: (
		cardId: string,
		href?: string
	) => void | Promise<void>;
	selectedExportRuntimeMode: import('@contractspec/lib.provider-spec').RuntimeMode;
	onSelectExportRuntimeMode?: (
		runtimeMode: import('@contractspec/lib.provider-spec').RuntimeMode
	) => void;
	busyAction?: string | null;
}) {
	const summary = summarizeBuilderWorkbench({
		...props.snapshot,
	});

	return (
		<Tabs defaultValue="home">
			<TabsList>
				<TabsTrigger value="home">Home</TabsTrigger>
				<TabsTrigger value="chat">Chat / Voice</TabsTrigger>
				<TabsTrigger value="sources">Sources</TabsTrigger>
				<TabsTrigger value="inbox">Inbox</TabsTrigger>
				<TabsTrigger value="fusion">Fusion</TabsTrigger>
				<TabsTrigger value="blueprint">Blueprint</TabsTrigger>
				<TabsTrigger value="plan">Plan</TabsTrigger>
				<TabsTrigger value="providers">Providers</TabsTrigger>
				<TabsTrigger value="runtime">Runtime</TabsTrigger>
				<TabsTrigger value="mobile">Mobile</TabsTrigger>
				<TabsTrigger value="preview">Preview</TabsTrigger>
				<TabsTrigger value="readiness">Readiness</TabsTrigger>
			</TabsList>
			<TabsContent value="home">
				<WorkspaceHomeCard summary={summary} />
			</TabsContent>
			<TabsContent value="chat">
				<GuidedChatVoicePanel
					promptDraft={props.promptDraft}
					transcripts={props.snapshot.transcripts}
					directives={props.snapshot.directives}
					approvalTickets={props.snapshot.approvalTickets}
					onDraftChange={props.onPromptDraftChange}
					onCapturePrompt={props.onCapturePrompt}
					onGenerateBlueprint={props.onGenerateBlueprint}
					isCapturingPrompt={props.busyAction === 'capture_prompt'}
					isGeneratingBlueprint={props.busyAction === 'generate_blueprint'}
				/>
			</TabsContent>
			<TabsContent value="sources">
				<SourceInboxPanel
					sources={props.snapshot.sources}
					extractedParts={props.snapshot.extractedParts}
					evidenceReferences={props.snapshot.evidenceReferences}
				/>
			</TabsContent>
			<TabsContent value="inbox">
				<OmnichannelInboxPanel
					messages={props.snapshot.messages}
					participantBindings={props.snapshot.participantBindings}
				/>
			</TabsContent>
			<TabsContent value="fusion">
				<FusionDecisionPanel
					conflicts={props.snapshot.conflicts}
					assumptions={props.snapshot.assumptions}
					decisionReceipts={props.snapshot.decisionReceipts}
					fusionGraphEdges={props.snapshot.fusionGraphEdges}
				/>
			</TabsContent>
			<TabsContent value="blueprint">
				<VStack gap="lg" align="stretch">
					<BlueprintEditorPanel
						blueprint={props.snapshot.blueprint}
						onBriefChange={props.onBriefChange}
						onGenerateBlueprint={props.onGenerateBlueprint}
						isGeneratingBlueprint={props.busyAction === 'generate_blueprint'}
					/>
				</VStack>
			</TabsContent>
			<TabsContent value="plan">
				<PlanLaneConsolePanel
					plan={props.snapshot.plan}
					approvalTickets={props.snapshot.approvalTickets}
					onCompilePlan={props.onCompilePlan}
					isCompilingPlan={props.busyAction === 'compile_plan'}
				/>
			</TabsContent>
			<TabsContent value="providers">
				<ProviderActivityPanel
					activity={props.snapshot.providerActivity}
					providers={props.snapshot.externalProviders}
					receipts={props.snapshot.executionReceipts}
					patchProposals={props.snapshot.patchProposals}
					comparisonRuns={props.snapshot.comparisonRuns}
					routingPolicy={props.snapshot.routingPolicy}
					proposalRegister={props.snapshot.providerProposalRegister}
					onRegisterRecommendedProviders={props.onRegisterRecommendedProviders}
					onAcceptPatchProposal={props.onAcceptPatchProposal}
					onRejectPatchProposal={props.onRejectPatchProposal}
					onOpenPatchProposalReview={props.onOpenPatchProposalReview}
					isRegisteringProviders={props.busyAction === 'register_providers'}
					busyProposalId={
						props.busyAction?.startsWith('patch_proposal:')
							? props.busyAction.slice('patch_proposal:'.length)
							: null
					}
				/>
			</TabsContent>
			<TabsContent value="runtime">
				<RuntimeTargetManagerPanel
					runtimeTargets={props.snapshot.runtimeTargets}
					onRegisterRecommendedTargets={props.onRegisterRecommendedTargets}
					onQuarantineRuntimeTarget={props.onQuarantineRuntimeTarget}
					isRegisteringTargets={props.busyAction === 'register_targets'}
					busyTargetId={
						props.busyAction?.startsWith('runtime_target:')
							? props.busyAction.slice('runtime_target:'.length)
							: null
					}
				/>
			</TabsContent>
			<TabsContent value="mobile">
				<MobileReviewPanel
					featureParity={props.snapshot.blueprint?.featureParity ?? []}
					cards={props.snapshot.mobileReviewCards}
					onApproveCard={props.onApproveMobileReviewCard}
					onRejectCard={props.onRejectMobileReviewCard}
					onAcknowledgeCard={props.onAcknowledgeMobileReviewCard}
					onOpenDetails={props.onOpenMobileReviewDetails}
					busyCardId={
						props.busyAction?.startsWith('mobile_review:')
							? props.busyAction.slice('mobile_review:'.length)
							: null
					}
				/>
			</TabsContent>
			<TabsContent value="preview">
				<PreviewWorkspacePanel
					preview={props.snapshot.preview}
					exportBundle={props.snapshot.exportBundle}
					onCreatePreview={props.onCreatePreview}
					onRunReadiness={props.onRunReadiness}
					onPrepareExport={props.onPrepareExport}
					onApproveExport={props.onApproveExport}
					onExecuteExport={props.onExecuteExport}
					selectedRuntimeMode={props.selectedExportRuntimeMode}
					onSelectRuntimeMode={props.onSelectExportRuntimeMode}
					isCreatingPreview={props.busyAction === 'create_preview'}
					isRunningReadiness={props.busyAction === 'run_readiness'}
					isPreparingExport={props.busyAction === 'prepare_export'}
					isApprovingExport={props.busyAction === 'approve_export'}
					isExecutingExport={props.busyAction === 'execute_export'}
				/>
			</TabsContent>
			<TabsContent value="readiness">
				<ReadinessReviewPanel
					report={props.snapshot.readinessReport}
					managedBootstrapLabel={summary.managedBootstrapLabel}
				/>
			</TabsContent>
		</Tabs>
	);
}
