import { describe, expect, test } from 'bun:test';
import { financeOpsDemoScenarios } from '../fixtures';
import { buildFinanceOpsPreviewModel } from './finance-ops-ai-workflows-preview.model';

describe('finance ops preview model', () => {
	test('builds a multi-screen demo from the default fixture loader scenario', () => {
		const model = buildFinanceOpsPreviewModel();

		expect(financeOpsDemoScenarios).toHaveLength(2);
		expect(model.screens.map((screen) => screen.id)).toEqual([
			'home',
			'mission',
			'cash',
			'procedure',
			'reporting',
			'adoption',
		]);
		expect(model.scenario.id).toBe('pme-recovery');
		expect(model.home.metrics).toHaveLength(4);
	});

	test('renders handler-computed cash priorities and adoption ROI', () => {
		const model = buildFinanceOpsPreviewModel('pme-recovery');

		expect(model.cash.result.workflowDecision).toBe('review_disputes_first');
		expect(model.cash.priorities[0]).toMatchObject({
			invoiceId: 'INV-1002',
			priority: 'dispute',
		});
		expect(model.reporting.kpis[0]).toMatchObject({
			currentValue: 1120000,
			metric: 'Revenue',
			targetValue: 1180000,
		});
		expect(model.adoption.usages[0]).toMatchObject({
			dataRisk: 'low',
			humanValidated: true,
		});
		expect(model.adoption.totalMinutesSaved).toBeGreaterThan(0);
		expect(model.adoption.recommendations).toContain('standardize');
	});

	test('switches all workflow outputs when selecting the reporting scenario', () => {
		const model = buildFinanceOpsPreviewModel('reporting-reset');

		expect(model.scenario.label).toBe('Reporting reset scenario');
		expect(model.mission.result.priority).toBe('medium');
		expect(model.reporting.result.confidenceNotes).toContain(
			'Known context considered'
		);
		expect(model.procedure.steps.length).toBeGreaterThan(0);
	});

	test('does not surface mocked-boundary checklist copy in preview content', () => {
		const model = buildFinanceOpsPreviewModel();
		const previewText = JSON.stringify({
			home: model.home,
			reviewPanel: model.reviewPanel,
			scenario: model.scenario,
			screens: model.screens,
		});

		expect(previewText).not.toContain('No LLM calls');
		expect(previewText).not.toContain('No external API calls');
		expect(previewText).not.toContain('No email sending');
		expect(previewText).not.toContain('Not financial, legal, tax');
	});
});
