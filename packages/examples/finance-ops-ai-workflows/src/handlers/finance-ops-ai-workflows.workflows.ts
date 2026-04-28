import {
	recommendAdoptionStep,
	stableSlug,
} from './finance-ops-ai-workflows.adoption-rules';
import {
	isKpiSnapshotRow,
	normalizeKpiRow,
} from './finance-ops-ai-workflows.guards';
import {
	buildProcedureControls,
	buildProcedureSteps,
	buildVarianceHighlight,
} from './finance-ops-ai-workflows.procedure-reporting-rules';
import type {
	AiAdoptionUsageInput,
	ProcedureDraftInput,
	ReportingNarrativeInput,
} from './finance-ops-ai-workflows.types';
import {
	buildSafetyNotes,
	classifyDataRisk,
	classifyQuality,
	includesAny,
	normalizeBooleanLike,
	normalizeText,
	parseJsonArraySafely,
	parseNumberSafely,
	round2,
	toJson,
} from './finance-ops-ai-workflows.utils';

export { prioritizeCashAging } from './finance-ops-ai-workflows.cash-aging-workflow';
export { triageMissionIntake } from './finance-ops-ai-workflows.mission-workflow';

export function createProcedureDraft(input: ProcedureDraftInput) {
	const text = normalizeText([
		input.processArea,
		input.rawNotes,
		input.knownRisks,
	]);
	const cashLike = includesAny(text, [
		'cash',
		'receivables',
		'relance',
		'treasury',
	]);
	const reportingLike = includesAny(text, ['reporting', 'closing', 'monthly']);
	const fundingLike = includesAny(text, [
		'business plan',
		'funding',
		'subventions',
	]);

	return {
		procedureTitle: `${input.procedureName} - review draft`,
		purpose: `Structure the ${input.processArea} workflow into a repeatable, reviewable finance procedure.`,
		scope: `Applies to fictive process notes, stakeholders ${input.stakeholders ?? 'to confirm'}, and frequency ${input.frequency ?? 'to confirm'}.`,
		rolesAndResponsibilitiesJson: toJson([
			{
				role: 'Process owner',
				responsibility: 'Own procedure accuracy and final validation.',
			},
			{
				role: 'Finance reviewer',
				responsibility: 'Review controls, risks, and evidence before rollout.',
			},
			{
				role: 'Operator',
				responsibility: 'Execute documented steps and capture exceptions.',
			},
		]),
		stepByStepProcedureJson: toJson(
			buildProcedureSteps(cashLike, reportingLike, fundingLike)
		),
		controlsJson: toJson(
			buildProcedureControls(cashLike, reportingLike, fundingLike)
		),
		kpisJson: toJson([
			'Cycle time',
			'Exceptions open',
			'Review completion rate',
			'Aging of unresolved items',
		]),
		openQuestionsJson: toJson([
			'Who owns final sign-off?',
			'What thresholds require escalation?',
			'Which source system is authoritative?',
			'What evidence must be archived?',
		]),
		trainingNotes:
			'Use this as a management-validated draft for team training, not as final policy.',
		humanReviewRequired: true as const,
		safetyNotes: buildSafetyNotes([
			'Management validation required before publication.',
		]),
	};
}

export function composeReportingNarrative(input: ReportingNarrativeInput) {
	const parsed = parseJsonArraySafely(input.kpiSnapshotJson, isKpiSnapshotRow);
	const rows = parsed.rows.map(normalizeKpiRow);
	const highlights = rows.map((row) => buildVarianceHighlight(row));
	const material = highlights.filter(
		(item) => item.classification !== 'stable'
	);
	const contextMissing = !input.knownContext?.trim();

	return {
		period: input.reportingPeriod,
		executiveSummary: `${input.reportingPeriod}: ${material.length} KPI(s) need review for ${input.audience}. Data alone does not establish business causes.`,
		varianceHighlightsJson: toJson(highlights),
		questionsForReviewJson: toJson([
			'Why did the metric move?',
			'Is the data source reliable?',
			'Who owns corrective action?',
			'Is the target still valid?',
			'Does this affect cash, margin or operational capacity?',
		]),
		recommendedFollowUpsJson: toJson(
			material.map((item) => `Review ${item.metric} with ${item.owner}.`)
		),
		confidenceNotes: contextMissing
			? `Missing context for ${input.reportingPeriod}; causes are not invented. ${parsed.errors.join(' ')}`
			: `Known context considered as reviewer-provided context. ${parsed.errors.join(' ')}`,
		humanReviewRequired: true as const,
		safetyNotes: buildSafetyNotes([
			'Validate before sending to management or clients.',
		]),
	};
}

export function logAiAdoptionUsage(input: AiAdoptionUsageInput) {
	const before = parseNumberSafely(input.timeBeforeMinutes);
	const after = parseNumberSafely(input.timeAfterMinutes);
	const estimatedMinutesSaved = Math.max(before - after, 0);
	const dataRisk = classifyDataRisk(input.dataRisk);
	const quality = classifyQuality(input.qualityRating);
	const humanValidated = normalizeBooleanLike(input.humanValidated);
	const sensitiveUse = normalizeText([
		input.useCase,
		input.workflowKey,
	]).includes('sensitive');
	const requiresPolicyReview =
		dataRisk === 'high' ||
		!humanValidated ||
		sensitiveUse ||
		(input.workflowKey.includes('client_data') && dataRisk !== 'low');
	const standardizationCandidate =
		estimatedMinutesSaved > 15 &&
		dataRisk !== 'high' &&
		humanValidated &&
		quality !== 'low';
	const recommendedNextStep = recommendAdoptionStep(
		requiresPolicyReview,
		standardizationCandidate,
		estimatedMinutesSaved,
		quality
	);

	return {
		usageLogId: `finance-ops-ai-${stableSlug(input.workflowKey)}-${estimatedMinutesSaved}`,
		estimatedMinutesSaved,
		estimatedHoursSaved: round2(estimatedMinutesSaved / 60),
		roiSummary: `${input.team} saved ${estimatedMinutesSaved} minutes on ${input.useCase}; measure workflow ROI, not people.`,
		recommendedNextStep,
		requiresPolicyReview,
		standardizationCandidate,
		safetyNotes: buildSafetyNotes([
			'Track use cases and workflow ROI, not intrusive employee surveillance.',
			'Do not log confidential client content in usage logs.',
		]),
	};
}
