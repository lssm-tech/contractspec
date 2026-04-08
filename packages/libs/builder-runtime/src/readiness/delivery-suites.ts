import { createIssue } from './helpers';
import type {
	BuilderReadinessSuiteResult,
	EvaluateBuilderReadinessInput,
} from './types';

const STT_WARNING_CONFIDENCE_THRESHOLD = 0.75;

function normalizeLocaleTag(value: string | undefined) {
	return value?.trim().toLowerCase().split(/[-_]/)[0] ?? '';
}

export function createDeliverySuites(input: {
	readinessInput: EvaluateBuilderReadinessInput;
	mobileParityStatus: import('@contractspec/lib.provider-spec').MobileSupportStatus;
	hasManaged: boolean;
	hasLocal: boolean;
	hasHybrid: boolean;
	openApprovalTickets: EvaluateBuilderReadinessInput['approvals'];
	duplicateDeliveries: Array<
		import('@contractspec/lib.builder-spec').BuilderChannelMessage[]
	>;
	unlinkedMessageRevisions: Array<
		import('@contractspec/lib.builder-spec').BuilderChannelMessage[]
	>;
	cardsMissingDeepLinks: EvaluateBuilderReadinessInput['mobileReviewCards'];
	invalidExportBundle: boolean;
	exportBundleArtifactMismatch: boolean;
}) {
	const { readinessInput } = input;
	const defaultLocale = normalizeLocaleTag(
		readinessInput.workspace.defaultLocale
	);
	const lowConfidenceSegments = readinessInput.transcripts.filter(
		(segment) =>
			segment.confidence < STT_WARNING_CONFIDENCE_THRESHOLD &&
			!segment.requiresConfirmation
	);
	const languageMismatchSegments = readinessInput.transcripts.filter(
		(segment) =>
			Boolean(defaultLocale) &&
			Boolean(normalizeLocaleTag(segment.language)) &&
			normalizeLocaleTag(segment.language) !== defaultLocale
	);
	const suites: BuilderReadinessSuiteResult[] = [
		{
			key: 'mobile_parity',
			status:
				input.mobileParityStatus === 'blocked' ||
				(readinessInput.workspace.mobileParityRequired &&
					input.mobileParityStatus !== 'full')
					? 'blocked'
					: input.mobileParityStatus === 'partial'
						? 'warning'
						: 'passed',
			blockers:
				input.mobileParityStatus === 'blocked'
					? [
							createIssue(
								'MOBILE_PARITY_BLOCKED',
								'A required Builder feature is blocked on mobile surfaces.'
							),
						]
					: readinessInput.workspace.mobileParityRequired &&
							input.mobileParityStatus !== 'full'
						? [
								createIssue(
									'MOBILE_PARITY_REQUIRED',
									'Workspace-level mobile parity is required before export.'
								),
							]
						: [],
			warnings:
				input.mobileParityStatus === 'partial'
					? [
							createIssue(
								'MOBILE_PARITY_PARTIAL',
								'Some Builder mobile flows still rely on a deep-link fallback.'
							),
						]
					: [],
		},
		{
			key: 'mobile_review_links',
			status: input.cardsMissingDeepLinks.length > 0 ? 'blocked' : 'passed',
			blockers: input.cardsMissingDeepLinks.map((card) =>
				createIssue(
					'MOBILE_REVIEW_DEEP_LINK_MISSING',
					`Review card ${card.id} is missing a mobile deep-link fallback for ${card.channelType}.`
				)
			),
			warnings: [],
		},
		{
			key: 'approval_gate',
			status: input.openApprovalTickets.length > 0 ? 'blocked' : 'passed',
			blockers: input.openApprovalTickets.map((ticket) =>
				createIssue(
					'APPROVAL_REQUIRED',
					`Approval ticket ${ticket.id} is still open and blocks export.`
				)
			),
			warnings: [],
		},
		{
			key: 'runtime_compatibility',
			status:
				input.hasManaged || input.hasLocal || input.hasHybrid
					? 'passed'
					: 'blocked',
			blockers:
				input.hasManaged || input.hasLocal || input.hasHybrid
					? []
					: [
							createIssue(
								'RUNTIME_COMPATIBILITY_MISSING',
								'No compatible runtime mode is currently ready.',
								['managed', 'local', 'hybrid']
							),
						],
			warnings: [
				...(!input.hasLocal
					? [
							createIssue(
								'LOCAL_RUNTIME_UNAVAILABLE',
								'Local runtime mode is not ready.',
								['local']
							),
						]
					: []),
				...(!input.hasHybrid
					? [
							createIssue(
								'HYBRID_RUNTIME_UNAVAILABLE',
								'Hybrid runtime mode is not ready.',
								['hybrid']
							),
						]
					: []),
			],
		},
		{
			key: 'channel_replay',
			status:
				input.duplicateDeliveries.length > 0
					? 'blocked'
					: input.unlinkedMessageRevisions.length > 0
						? 'warning'
						: 'passed',
			blockers: input.duplicateDeliveries.map((group) =>
				createIssue(
					'CHANNEL_DUPLICATE_DELIVERY',
					`Duplicate channel delivery was recorded for ${group[0]?.externalMessageId}.`
				)
			),
			warnings: input.unlinkedMessageRevisions.map((group) =>
				createIssue(
					'CHANNEL_REPLAY_LINK_MISSING',
					`Replay history for ${group[0]?.externalMessageId} is missing supersession links.`
				)
			),
		},
		{
			key: 'voice_stt_quality',
			status: readinessInput.transcripts.some(
				(segment) => segment.requiresConfirmation
			)
				? 'blocked'
				: lowConfidenceSegments.length > 0 ||
						languageMismatchSegments.length > 0
					? 'warning'
					: 'passed',
			blockers: readinessInput.transcripts
				.filter((segment) => segment.requiresConfirmation)
				.map((segment) =>
					createIssue(
						'STT_CONFIRMATION_REQUIRED',
						`Transcript ${segment.id} still requires confirmation.`
					)
				),
			warnings: [
				...lowConfidenceSegments.map((segment) =>
					createIssue(
						'STT_CONFIDENCE_LOW',
						`Transcript ${segment.id} confidence ${segment.confidence.toFixed(2)} is below the Builder review threshold.`
					)
				),
				...languageMismatchSegments.map((segment) =>
					createIssue(
						'STT_LANGUAGE_MISMATCH',
						`Transcript ${segment.id} language ${segment.language} does not match the workspace default locale ${readinessInput.workspace.defaultLocale}.`
					)
				),
			],
		},
		{
			key: 'export_reproducibility',
			status:
				input.invalidExportBundle || input.exportBundleArtifactMismatch
					? 'blocked'
					: readinessInput.exportBundle
						? 'passed'
						: 'warning',
			blockers:
				input.invalidExportBundle && readinessInput.exportBundle
					? [
							createIssue(
								'EXPORT_BUNDLE_INVALID',
								`Export bundle ${readinessInput.exportBundle.id} is missing verification or artifact references.`
							),
						]
					: input.exportBundleArtifactMismatch && readinessInput.exportBundle
						? [
								createIssue(
									'EXPORT_BUNDLE_NONDETERMINISTIC',
									`Export bundle ${readinessInput.exportBundle.id} does not match the expected deterministic artifact signature.`
								),
							]
						: [],
			warnings:
				readinessInput.preview == null
					? [
							createIssue(
								'EXPORT_PREVIEW_MISSING',
								'No preview has been generated yet to ground export reproducibility.'
							),
						]
					: readinessInput.exportBundle == null
						? [
								createIssue(
									'EXPORT_REPRODUCIBILITY_PENDING',
									'No export bundle has been generated to confirm reproducibility yet.'
								),
							]
						: [],
		},
	];
	return suites;
}
