import {
	type BuilderChannelInboundEnvelope,
	BuilderIngestionService,
} from './ingestion';
import {
	compilePlanOperation,
	createWorkspace,
	generateBlueprint,
	ingestChannelEnvelope,
	patchBlueprint,
	removeSource,
	reprocessSource,
	resolveConflict,
	sendOutbound,
	startConversation,
	updateApproval,
	updateAssumption,
	updateConversation,
	updateDirective,
	updateParticipantBinding,
	updatePlan,
	updateWorkspace,
} from './runtime/core-operations';
import {
	createOrRefreshPreview,
	runReadiness,
	updateExport,
} from './runtime/preview-operations';
import {
	createMobileReviewCardOperation,
	ingestProviderExecutionOutput,
	prepareExecutionContext,
	recordComparisonRun,
	updateExternalProvider,
	updatePatchProposal,
	updateRuntimeTarget,
	upsertRoutingPolicy,
} from './runtime/provider-operations';
import { executeBuilderQuery } from './runtime/query-operations';
import type {
	BuilderOperationInput,
	BuilderRuntimeDependencies,
	BuilderRuntimeServiceOptions,
} from './runtime/types';

export type {
	BuilderOperationInput,
	BuilderOutboundBridge,
	BuilderRuntimeDependencies,
	BuilderRuntimeServiceOptions,
} from './runtime/types';

export class BuilderRuntimeService {
	private readonly ingestion: BuilderIngestionService;
	private readonly now: () => Date;

	constructor(
		private readonly store: BuilderRuntimeDependencies['store'],
		private readonly options: BuilderRuntimeServiceOptions = {}
	) {
		this.ingestion = new BuilderIngestionService(store, {
			now: options.now,
			approvedVoiceLocales: options.approvedVoiceLocales,
			retainRawAudioPolicy: options.retainRawAudioPolicy,
		});
		this.now = options.now ?? (() => new Date());
	}

	private get deps(): BuilderRuntimeDependencies {
		return {
			store: this.store,
			ingestion: this.ingestion,
			now: this.now,
			options: this.options,
		};
	}

	async executeCommand(commandKey: string, input: BuilderOperationInput = {}) {
		switch (commandKey) {
			case 'builder.workspace.create':
				return createWorkspace(this.deps, input);
			case 'builder.workspace.rename':
			case 'builder.workspace.archive':
				return updateWorkspace(this.deps, commandKey, input);
			case 'builder.conversation.start':
				return startConversation(this.deps, input);
			case 'builder.conversation.pause':
			case 'builder.conversation.resume':
			case 'builder.conversation.archive':
			case 'builder.conversation.bindChannel':
			case 'builder.conversation.unbindChannel':
				return updateConversation(this.deps, commandKey, input);
			case 'builder.participantBinding.bind':
			case 'builder.participant.bind':
			case 'builder.participantBinding.update':
			case 'builder.participant.updateBinding':
			case 'builder.participantBinding.revoke':
			case 'builder.participant.revokeBinding':
				return updateParticipantBinding(this.deps, commandKey, input);
			case 'builder.source.uploadAsset':
			case 'builder.source.attachStudioSnapshot':
				return this.ingestion.ingestAsset(input.payload as never);
			case 'builder.source.reprocess':
				return reprocessSource(this.deps, input);
			case 'builder.source.remove':
				return removeSource(this.deps, input);
			case 'builder.channel.receiveInbound':
			case 'builder.channel.recordEdit':
			case 'builder.channel.recordDelete':
			case 'builder.channel.captureInteractiveSelection':
				return ingestChannelEnvelope(
					this.deps,
					input.payload as unknown as BuilderChannelInboundEnvelope
				);
			case 'builder.channel.sendOutbound':
				return sendOutbound(this.deps, input);
			case 'builder.voice.transcribe':
				return this.ingestion.transcribeVoice(input.payload as never);
			case 'builder.voice.confirmTranscript':
				return this.ingestion.confirmTranscript(String(input.entityId));
			case 'builder.voice.rejectTranscript':
				return this.ingestion.rejectTranscript(String(input.entityId));
			case 'builder.brief.generate':
			case 'builder.brief.update':
			case 'builder.blueprint.generate':
				return generateBlueprint(this.deps, input);
			case 'builder.directive.accept':
			case 'builder.directive.reject':
				return updateDirective(this.deps, commandKey, input);
			case 'builder.fusion.resolveConflict':
				return resolveConflict(this.deps, input);
			case 'builder.assumption.confirm':
			case 'builder.assumption.reject':
				return updateAssumption(this.deps, commandKey, input);
			case 'builder.blueprint.patch':
			case 'builder.blueprint.lockSection':
			case 'builder.blueprint.unlockSection':
				return patchBlueprint(this.deps, commandKey, input);
			case 'builder.plan.compile':
				return compilePlanOperation(this.deps, input);
			case 'builder.plan.approve':
			case 'builder.plan.execute':
			case 'builder.plan.pause':
			case 'builder.plan.resume':
			case 'builder.plan.cancel':
				return updatePlan(this.deps, commandKey, input);
			case 'builder.approval.request':
			case 'builder.approval.capture':
			case 'builder.approval.invalidate':
				return updateApproval(this.deps, commandKey, input);
			case 'builder.preview.create':
			case 'builder.preview.refresh':
				return createOrRefreshPreview(this.deps, input);
			case 'builder.preview.runHarness':
				return runReadiness(this.deps, input);
			case 'builder.runtimeTarget.register':
			case 'builder.runtimeTarget.update':
			case 'builder.runtimeTarget.quarantine':
				return updateRuntimeTarget(this.deps, commandKey, input);
			case 'builder.provider.register':
			case 'builder.provider.update':
				return updateExternalProvider(this.deps, commandKey, input);
			case 'builder.providerRoutingPolicy.upsert':
				return upsertRoutingPolicy(this.deps, input);
			case 'builder.providerExecution.prepareContext':
				return prepareExecutionContext(this.deps, input);
			case 'builder.providerExecution.ingestOutput':
				return ingestProviderExecutionOutput(this.deps, input);
			case 'builder.patchProposal.accept':
			case 'builder.patchProposal.reject':
			case 'builder.patchProposal.supersede':
				return updatePatchProposal(this.deps, commandKey, input, (nextInput) =>
					createOrRefreshPreview(this.deps, nextInput)
				);
			case 'builder.comparison.record':
				return recordComparisonRun(this.deps, input);
			case 'builder.mobileReviewCard.create':
				return createMobileReviewCardOperation(this.deps, input);
			case 'builder.export.prepare':
			case 'builder.export.approve':
			case 'builder.export.execute':
				return updateExport(this.deps, commandKey, input);
			default:
				throw new Error(`Unsupported Builder command: ${commandKey}`);
		}
	}

	async executeQuery(queryKey: string, input: BuilderOperationInput = {}) {
		return executeBuilderQuery(this.deps, queryKey, input);
	}
}
