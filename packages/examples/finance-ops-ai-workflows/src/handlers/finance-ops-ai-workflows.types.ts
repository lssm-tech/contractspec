export type DataRisk = 'low' | 'medium' | 'high';
export type QualityRating = 'low' | 'medium' | 'high';
export type MissionPriority = 'low' | 'medium' | 'high';
export type CashPriority = 'dispute' | 'high' | 'medium' | 'low';
export type AdoptionNextStep =
	| 'policy_review'
	| 'standardize'
	| 'train'
	| 'abandon_or_redesign'
	| 'monitor';

export interface MissionIntakeInput {
	clientName: string;
	companyContext: string;
	companySize: string;
	revenueBand?: string;
	industry?: string;
	situationSummary: string;
	painPoints: string;
	requestedOutcome: string;
	urgency: string;
	dataSensitivity: string;
	knownSystems?: string;
	availableDocuments?: string;
}

export interface CashAgingInput {
	snapshotId: string;
	snapshotDate?: string;
	currency: string;
	rowsJson: string;
	reviewOwner?: string;
	dataSensitivity: string;
}

export interface CashAgingRow {
	clientName: string;
	invoiceId: string;
	dueDate: string;
	amount: number | string;
	owner?: string;
	disputeStatus?: string;
	notes?: string;
}

export interface ProcedureDraftInput {
	procedureName: string;
	processArea: string;
	rawNotes: string;
	stakeholders?: string;
	frequency?: string;
	knownRisks?: string;
	dataSensitivity: string;
}

export interface ReportingNarrativeInput {
	reportingPeriod: string;
	currency: string;
	kpiSnapshotJson: string;
	knownContext?: string;
	audience: string;
	dataSensitivity: string;
}

export interface KpiSnapshotRow {
	metric: string;
	currentValue?: number | string;
	previousValue?: number | string;
	targetValue?: number | string;
	unit?: string;
	owner?: string;
	notes?: string;
}

export interface AiAdoptionUsageInput {
	workflowKey: string;
	team: string;
	useCase: string;
	timeBeforeMinutes: number | string;
	timeAfterMinutes: number | string;
	dataRisk: string;
	humanValidated: boolean | string;
	qualityRating: string;
	notes?: string;
}

export interface MissionIntakeResult {
	missionType: string;
	priority: MissionPriority;
	riskSummary: string;
	risksJson: string;
	missingInformationJson: string;
	documentsToRequestJson: string;
	questionsForExecutiveJson: string;
	thirtySixtyNinetyPlanJson: string;
	suggestedNextWorkflow: string;
	humanReviewRequired: true;
	safetyNotes: string;
}

export interface CashAgingResult {
	referenceDate: string;
	currency: string;
	totalExposure: number;
	overdueExposure: number;
	disputedExposure: number;
	topPrioritiesJson: string;
	actionsJson: string;
	executiveSummary: string;
	workflowDecision: string;
	humanReviewRequired: true;
	safetyNotes: string;
}

export interface ProcedureDraftResult {
	procedureTitle: string;
	purpose: string;
	scope: string;
	rolesAndResponsibilitiesJson: string;
	stepByStepProcedureJson: string;
	controlsJson: string;
	kpisJson: string;
	openQuestionsJson: string;
	trainingNotes: string;
	humanReviewRequired: true;
	safetyNotes: string;
}

export interface ReportingNarrativeResult {
	period: string;
	executiveSummary: string;
	varianceHighlightsJson: string;
	questionsForReviewJson: string;
	recommendedFollowUpsJson: string;
	confidenceNotes: string;
	humanReviewRequired: true;
	safetyNotes: string;
}

export interface AiAdoptionUsageResult {
	usageLogId: string;
	estimatedMinutesSaved: number;
	estimatedHoursSaved: number;
	roiSummary: string;
	recommendedNextStep: AdoptionNextStep;
	requiresPolicyReview: boolean;
	standardizationCandidate: boolean;
	safetyNotes: string;
}
