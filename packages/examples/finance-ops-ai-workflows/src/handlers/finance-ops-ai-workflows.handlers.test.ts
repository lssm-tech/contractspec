import { describe, expect, test } from 'bun:test';
import {
	cashAgingFixture,
	missionIntakeFixture,
	procedureDraftFixture,
	reportingNarrativeFixture,
} from '../fixtures';
import {
	createFinanceOpsAiWorkflowsHandlers,
	logAiAdoptionUsage,
	prioritizeCashAging,
} from './finance-ops-ai-workflows.handlers';

describe('@contractspec/example.finance-ops-ai-workflows handlers', () => {
	test('triages cash-tension intake into a reviewed finance mission package', async () => {
		const handlers = createFinanceOpsAiWorkflowsHandlers();
		const result = await handlers.triageMissionIntake(
			missionIntakeFixture,
			{} as never
		);
		const documents = JSON.parse(result.documentsToRequestJson) as string[];

		expect(result.priority).toBe('high');
		expect(result.missionType).toBe('Cash management / finance recovery');
		expect(documents).toContain('aged receivables');
		expect(documents).toContain('monthly reporting pack');
		expect(result.humanReviewRequired).toBe(true);
		expect(result.safetyNotes).toContain('Review draft only');
	});

	test('prioritizes cash aging with deterministic dispute-first rules', async () => {
		const first = prioritizeCashAging(cashAgingFixture);
		const second = prioritizeCashAging(cashAgingFixture);
		const priorities = JSON.parse(first.topPrioritiesJson) as Array<{
			invoiceId: string;
			priority: string;
		}>;

		expect(first).toEqual(second);
		expect(first.referenceDate).toBe('2026-04-28');
		expect(first.workflowDecision).toBe('review_disputes_first');
		expect(priorities[0]).toMatchObject({
			invoiceId: 'INV-1002',
			priority: 'dispute',
		});
		expect(first.humanReviewRequired).toBe(true);
	});

	test('returns a safe cash result for invalid rowsJson', () => {
		const result = prioritizeCashAging({
			...cashAgingFixture,
			rowsJson: '{bad json',
		});

		expect(result.totalExposure).toBe(0);
		expect(result.topPrioritiesJson).toBe('[]');
		expect(result.safetyNotes).toContain('Input JSON is invalid');
		expect(result.humanReviewRequired).toBe(true);
	});

	test('creates a procedure draft with controls, roles and open questions', async () => {
		const handlers = createFinanceOpsAiWorkflowsHandlers();
		const result = await handlers.createProcedureDraft(
			procedureDraftFixture,
			{} as never
		);
		const controls = JSON.parse(result.controlsJson) as string[];

		expect(result.procedureTitle).toContain('review draft');
		expect(controls).toContain('Payment promise tracking');
		expect(result.trainingNotes).toContain('management-validated draft');
		expect(result.humanReviewRequired).toBe(true);
	});

	test('composes reporting narrative without inventing missing context', async () => {
		const handlers = createFinanceOpsAiWorkflowsHandlers();
		const result = await handlers.composeReportingNarrative(
			reportingNarrativeFixture,
			{} as never
		);
		const highlights = JSON.parse(result.varianceHighlightsJson) as Array<{
			classification: string;
		}>;

		expect(result.period).toBe('April 2026');
		expect(highlights.some((item) => item.classification !== 'stable')).toBe(
			true
		);
		expect(result.confidenceNotes).toContain('Missing context');
		expect(result.humanReviewRequired).toBe(true);
	});

	test('logs AI adoption ROI with policy and standardization decisions', () => {
		const standardize = logAiAdoptionUsage({
			workflowKey: 'financeOps.cashAging.prioritize',
			team: 'cash',
			useCase: 'cash prioritization',
			timeBeforeMinutes: 120,
			timeAfterMinutes: 45,
			dataRisk: 'low',
			humanValidated: true,
			qualityRating: 'high',
		});
		const policyReview = logAiAdoptionUsage({
			workflowKey: 'client_data.reporting',
			team: 'finance',
			useCase: 'sensitive client data narrative',
			timeBeforeMinutes: 45,
			timeAfterMinutes: 20,
			dataRisk: 'high',
			humanValidated: true,
			qualityRating: 'medium',
		});

		expect(standardize.estimatedMinutesSaved).toBe(75);
		expect(standardize.recommendedNextStep).toBe('standardize');
		expect(policyReview.requiresPolicyReview).toBe(true);
		expect(policyReview.recommendedNextStep).toBe('policy_review');
	});
});
