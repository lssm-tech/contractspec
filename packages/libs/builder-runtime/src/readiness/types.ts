import type {
	BuilderApprovalTicket,
	BuilderBlueprint,
	BuilderChannelMessage,
	BuilderConflict,
	BuilderConversation,
	BuilderExportBundle,
	BuilderMobileReviewCard,
	BuilderParticipantBinding,
	BuilderPreview,
	BuilderReadinessReport,
	BuilderTranscriptSegment,
	BuilderWorkspace,
} from '@contractspec/lib.builder-spec';
import type {
	ExecutionComparisonRun,
	ExternalExecutionProvider,
	ExternalExecutionReceipt,
	ExternalPatchProposal,
	RuntimeMode,
	RuntimeTarget,
} from '@contractspec/lib.provider-spec';

export interface BuilderReadinessSuiteResult {
	key: string;
	status: 'passed' | 'warning' | 'blocked';
	blockers: Array<{
		code: string;
		message: string;
		runtimeModes?: RuntimeMode[];
	}>;
	warnings: Array<{
		code: string;
		message: string;
		runtimeModes?: RuntimeMode[];
	}>;
}

export interface EvaluateBuilderReadinessInput {
	workspace: BuilderWorkspace;
	blueprint: BuilderBlueprint;
	conversations: BuilderConversation[];
	bindings: BuilderParticipantBinding[];
	transcripts: BuilderTranscriptSegment[];
	approvals: BuilderApprovalTicket[];
	conflicts: BuilderConflict[];
	messages?: BuilderChannelMessage[];
	runtimeTargets: RuntimeTarget[];
	providers: ExternalExecutionProvider[];
	executionReceipts: ExternalExecutionReceipt[];
	patchProposals: ExternalPatchProposal[];
	comparisonRuns: ExecutionComparisonRun[];
	mobileReviewCards: BuilderMobileReviewCard[];
	preview?: BuilderPreview | null;
	exportBundle?: BuilderExportBundle | null;
}

export interface EvaluateBuilderReadinessResult {
	suites: BuilderReadinessSuiteResult[];
	report: BuilderReadinessReport;
}
