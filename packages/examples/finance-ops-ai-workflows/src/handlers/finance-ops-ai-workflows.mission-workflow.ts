import {
	buildDocumentsToRequest,
	buildExecutiveQuestions,
	buildMissingInformation,
	buildMissionRisks,
	buildThirtySixtyNinetyPlan,
	classifyMissionPriority,
	classifyMissionType,
} from './finance-ops-ai-workflows.mission-rules';
import type { MissionIntakeInput } from './finance-ops-ai-workflows.types';
import {
	buildSafetyNotes,
	normalizeText,
	toJson,
} from './finance-ops-ai-workflows.utils';

export function triageMissionIntake(input: MissionIntakeInput) {
	const text = normalizeText([
		input.situationSummary,
		input.painPoints,
		input.requestedOutcome,
		input.urgency,
		input.availableDocuments,
		input.knownSystems,
	]);
	const priority = classifyMissionPriority(text, input.painPoints);
	const missionType = classifyMissionType(text);
	const risks = buildMissionRisks(text);
	const documents = buildDocumentsToRequest(text);

	return {
		missionType,
		priority,
		riskSummary: `${priority} priority ${missionType} draft for ${input.clientName}. ${risks.length} risk areas need executive validation.`,
		risksJson: toJson(risks),
		missingInformationJson: toJson(buildMissingInformation(input)),
		documentsToRequestJson: toJson(documents),
		questionsForExecutiveJson: toJson(buildExecutiveQuestions()),
		thirtySixtyNinetyPlanJson: toJson(buildThirtySixtyNinetyPlan()),
		suggestedNextWorkflow: documents.some((doc) => doc.includes('aged'))
			? 'financeOps.cashAging.prioritize'
			: 'financeOps.procedureDraft.create',
		humanReviewRequired: true as const,
		safetyNotes: buildSafetyNotes([
			'Mission triage is a review draft for scoping, not a mandate or advice.',
		]),
	};
}
