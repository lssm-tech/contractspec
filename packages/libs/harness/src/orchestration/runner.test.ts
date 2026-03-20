import { describe, expect, it } from 'bun:test';
import {
	defineHarnessScenario,
	defineHarnessSuite,
	HarnessScenarioRegistry,
	HarnessSuiteRegistry,
	type HarnessTargetRef,
} from '@contractspec/lib.contracts-spec';
import type {
	HarnessArtifactQuery,
	HarnessExecutionAdapter,
	HarnessStepExecutionInput,
	HarnessStepExecutionResult,
	HarnessStoredArtifact,
	HarnessTargetResolver,
} from '../types';
import { HarnessEvaluationRunner } from './evaluation-runner';
import { HarnessRunner } from './runner';

class MemoryArtifactStore {
	private readonly items: HarnessStoredArtifact[] = [];
	async put(artifact: HarnessStoredArtifact) {
		this.items.push(artifact);
		return artifact;
	}
	async get(id: string) {
		return this.items.find((item) => item.artifactId === id);
	}
	async list(query: HarnessArtifactQuery = {}) {
		return this.items.filter((item) => {
			if (query.runId && item.runId !== query.runId) return false;
			if (query.stepId && item.stepId !== query.stepId) return false;
			if (query.kind && item.kind !== query.kind) return false;
			return true;
		});
	}
}

const targetResolver: HarnessTargetResolver = {
	async resolve() {
		return {
			targetId: crypto.randomUUID(),
			kind: 'preview' as HarnessTargetRef['kind'],
			isolation: 'preview' as HarnessTargetRef['isolation'],
			environment: 'preview',
			baseUrl: 'https://example.test',
			allowlistedDomains: ['example.test'],
		};
	},
};

function scriptedAdapter(
	mode: HarnessExecutionAdapter['mode'],
	handler: (
		input: HarnessStepExecutionInput
	) => Promise<HarnessStepExecutionResult>
): HarnessExecutionAdapter {
	return {
		mode,
		supports: () => true,
		execute: handler,
	};
}

describe('HarnessRunner', () => {
	it('runs read-only inspection and captures evidence', async () => {
		const store = new MemoryArtifactStore();
		const runner = new HarnessRunner({
			targetResolver,
			artifactStore: store,
			adapters: [
				scriptedAdapter('deterministic-browser', async ({ step, target }) => ({
					status: 'completed',
					summary: `Opened ${target.baseUrl}/${step.key}`,
					artifacts: [{ kind: 'screenshot', summary: 'Dashboard visible' }],
				})),
			],
		});
		const scenario = defineHarnessScenario({
			meta: {
				key: 'qa.dashboard.inspect',
				version: '1.0.0',
				title: 'Inspect dashboard',
				description: 'Verify key UI exists',
				domain: 'harness',
				owners: ['platform.harness'],
				tags: ['qa'],
				stability: 'experimental',
			},
			target: { allowlistedDomains: ['example.test'] },
			allowedModes: ['deterministic-browser'],
			steps: [
				{
					key: 'open-dashboard',
					description: 'Open dashboard',
					actionClass: 'read',
					intent: 'Inspect dashboard',
					expectedEvidence: ['screenshot'],
				},
			],
			assertions: [{ key: 'has-shot', type: 'artifact', source: 'screenshot' }],
		});

		const result = await runner.runScenario({ scenario });
		expect(result.run.status).toBe('completed');
		expect(result.artifacts).toHaveLength(1);
	});

	it('requires approval for login and form submission flows', async () => {
		const store = new MemoryArtifactStore();
		const approvals: string[] = [];
		const runner = new HarnessRunner({
			targetResolver,
			artifactStore: store,
			approvalGateway: {
				async approve(input) {
					approvals.push(input.stepKey);
					return { approved: true, approverId: 'reviewer-1' };
				},
			},
			adapters: [
				scriptedAdapter('deterministic-browser', async ({ step }) => ({
					status: 'completed',
					summary: `${step.key} complete`,
					artifacts: [{ kind: 'step-summary', summary: `${step.key} ok` }],
				})),
			],
		});
		const scenario = defineHarnessScenario({
			meta: {
				key: 'qa.login.create',
				version: '1.0.0',
				title: 'Login and create',
				description: 'Login then create entity',
				domain: 'harness',
				owners: ['platform.harness'],
				tags: ['qa'],
				stability: 'experimental',
			},
			target: { allowlistedDomains: ['example.test'] },
			allowedModes: ['deterministic-browser'],
			steps: [
				{
					key: 'login',
					description: 'Login',
					actionClass: 'login',
					intent: 'Authenticate',
				},
				{
					key: 'create-entity',
					description: 'Create entity',
					actionClass: 'form-submit',
					intent: 'Submit form',
					mutatesState: true,
				},
			],
			assertions: [{ key: 'count', type: 'count', min: 2 }],
		});

		const result = await runner.runScenario({ scenario });
		expect(result.run.status).toBe('completed');
		expect(approvals).toEqual(['login', 'create-entity']);
	});

	it('falls back to visual mode when deterministic mode is unsupported', async () => {
		const runner = new HarnessRunner({
			targetResolver,
			artifactStore: new MemoryArtifactStore(),
			adapters: [
				scriptedAdapter('deterministic-browser', async () => ({
					status: 'unsupported',
					reasons: ['canvas_ui'],
				})),
				scriptedAdapter('visual-computer-use', async () => ({
					status: 'completed',
					summary: 'Visual fallback worked',
					artifacts: [{ kind: 'screenshot', summary: 'Canvas captured' }],
				})),
			],
		});
		const scenario = defineHarnessScenario({
			meta: {
				key: 'qa.canvas.fallback',
				version: '1.0.0',
				title: 'Canvas fallback',
				description: 'Use visual fallback',
				domain: 'harness',
				owners: ['platform.harness'],
				tags: ['qa'],
				stability: 'experimental',
			},
			target: { allowlistedDomains: ['example.test'] },
			allowedModes: ['deterministic-browser', 'visual-computer-use'],
			steps: [
				{
					key: 'open-canvas',
					description: 'Open canvas',
					actionClass: 'read',
					intent: 'Inspect canvas',
				},
			],
			assertions: [{ key: 'shot', type: 'artifact', source: 'screenshot' }],
		});

		const result = await runner.runScenario({ scenario });
		expect(result.run.steps[0]?.mode).toBe('visual-computer-use');
		expect(result.run.status).toBe('completed');
	});

	it('evaluates scenarios and suites without state leakage across runs', async () => {
		const store = new MemoryArtifactStore();
		const runner = new HarnessRunner({
			targetResolver,
			artifactStore: store,
			adapters: [
				scriptedAdapter('code-execution', async ({ step, target }) => ({
					status: 'completed',
					summary: `Ran ${step.key} on ${target.targetId}`,
					output: { ok: true },
					artifacts: [
						{ kind: 'step-summary', summary: 'Loop and branch passed' },
					],
				})),
			],
		});
		const scenario = defineHarnessScenario({
			meta: {
				key: 'qa.code.exec',
				version: '1.0.0',
				title: 'Code execution',
				description: 'Loop and branch validation',
				domain: 'harness',
				owners: ['platform.harness'],
				tags: ['qa'],
				stability: 'experimental',
			},
			target: {},
			allowedModes: ['code-execution'],
			steps: [
				{
					key: 'validate-script',
					description: 'Run validation script',
					actionClass: 'code-exec-read',
					intent: 'Check data with loops and branching',
					mode: 'code-execution',
				},
			],
			assertions: [
				{
					key: 'ok',
					type: 'step-status',
					source: 'validate-script',
					match: 'completed',
				},
			],
		});
		const suite = defineHarnessSuite({
			meta: {
				key: 'qa.suite',
				version: '1.0.0',
				title: 'QA Suite',
				description: 'Suite',
				domain: 'harness',
				owners: ['platform.harness'],
				tags: ['qa'],
				stability: 'experimental',
			},
			scenarios: [
				{
					scenario: { key: scenario.meta.key, version: scenario.meta.version },
				},
			],
		});
		const evaluationRunner = new HarnessEvaluationRunner({
			runner,
			scenarioRegistry: new HarnessScenarioRegistry([scenario]),
			suiteRegistry: new HarnessSuiteRegistry([suite]),
		});

		const first = await evaluationRunner.runScenarioEvaluation({ scenario });
		const second = await evaluationRunner.runScenarioEvaluation({ scenario });
		const suiteResult = await evaluationRunner.runSuiteEvaluation({
			suiteKey: suite.meta.key,
		});

		expect(first.run.target.targetId).not.toBe(second.run.target.targetId);
		expect(suiteResult.summary.totalScenarios).toBe(1);
		expect(suiteResult.summary.passRate).toBe(1);
	});
});
