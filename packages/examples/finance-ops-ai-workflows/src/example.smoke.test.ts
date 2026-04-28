import { describe, expect, test } from 'bun:test';
import example from './example';
import { FinanceOpsAiWorkflowsFeature } from './finance-ops-ai-workflows.feature';
import { runFinanceOpsAiWorkflowsReplay } from './proof';

describe('@contractspec/example.finance-ops-ai-workflows smoke', () => {
	test('publishes public beta template metadata', () => {
		expect(example.meta.key).toBe('finance-ops-ai-workflows');
		expect(example.meta.title).toBe('Finance Ops AI Workflows');
		expect(example.meta.visibility).toBe('public');
		expect(example.meta.stability).toBe('beta');
		expect(example.entrypoints.packageName).toBe(
			'@contractspec/example.finance-ops-ai-workflows'
		);
		expect(example.surfaces.templates).toBe(true);
		expect(example.surfaces.sandbox.enabled).toBe(true);
		expect(example.meta.tags).toContain('reporting');
		expect(example.meta.tags).toContain('roi');
	});

	test('registers the five governed finance operations', () => {
		expect(
			FinanceOpsAiWorkflowsFeature.operations?.map((operation) => operation.key)
		).toEqual([
			'financeOps.missionIntake.triage',
			'financeOps.cashAging.prioritize',
			'financeOps.procedureDraft.create',
			'financeOps.reportingNarrative.compose',
			'financeOps.aiAdoption.logUsage',
		]);
	});

	test('runs the replay proof across all finance workflows', async () => {
		const replay = await runFinanceOpsAiWorkflowsReplay();

		expect(replay.fixtures.cashRows).toBe(6);
		expect(replay.fixtures.kpis).toBe(5);
		expect(replay.outputs.missionPriority).toBe('high');
		expect(replay.outputs.cashDecision).toBe('review_disputes_first');
		expect(replay.safety.externalCalls).toBe(false);
		expect(replay.safety.humanReviewRequired).toBe(true);
	});
});
