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

	it('runs setup hooks and reset hooks even when a scenario step fails', async () => {
		const calls: string[] = [];
		const runner = new HarnessRunner({
			targetResolver,
			artifactStore: new MemoryArtifactStore(),
			hookExecutor: {
				async execute(input) {
					calls.push(`${input.phase}:${input.hook.operation.key}`);
					return { status: 'completed', summary: `${input.phase} done` };
				},
			},
			adapters: [
				scriptedAdapter('deterministic-browser', async () => ({
					status: 'failed',
					summary: 'Step failed',
				})),
			],
		});
		const scenario = defineHarnessScenario({
			meta: {
				key: 'qa.hooks.failure',
				version: '1.0.0',
				title: 'Hooks failure',
				description: 'Hooks still reset after failure',
				domain: 'harness',
				owners: ['platform.harness'],
				tags: ['qa'],
				stability: 'experimental',
			},
			target: { allowlistedDomains: ['example.test'] },
			allowedModes: ['deterministic-browser'],
			setup: [{ operation: { key: 'fixtures.seed', version: '1.0.0' } }],
			reset: [{ operation: { key: 'fixtures.reset', version: '1.0.0' } }],
			steps: [
				{
					key: 'fail',
					description: 'Fail',
					actionClass: 'read',
					intent: 'Fail the scenario',
				},
			],
			assertions: [],
		});

		const result = await runner.runScenario({ scenario });

		expect(result.run.status).toBe('failed');
		expect(calls).toEqual(['setup:fixtures.seed', 'reset:fixtures.reset']);
		expect(result.run.steps.map((step) => step.stepKey)).toEqual([
			'__setup:fixtures.seed',
			'fail',
			'__reset:fixtures.reset',
		]);
	});

	it('blocks hook scenarios clearly when no hook executor is configured', async () => {
		const runner = new HarnessRunner({
			targetResolver,
			artifactStore: new MemoryArtifactStore(),
			adapters: [],
		});
		const scenario = defineHarnessScenario({
			meta: {
				key: 'qa.hooks.missing',
				version: '1.0.0',
				title: 'Missing hooks',
				description: 'Missing hook executor',
				domain: 'harness',
				owners: ['platform.harness'],
				tags: ['qa'],
				stability: 'experimental',
			},
			target: { allowlistedDomains: ['example.test'] },
			allowedModes: ['deterministic-browser'],
			setup: [{ operation: { key: 'fixtures.seed', version: '1.0.0' } }],
			steps: [],
			assertions: [],
		});

		const result = await runner.runScenario({ scenario });

		expect(result.run.status).toBe('blocked');
		expect(result.run.steps[0]?.summary).toContain('hook executor');
	});

	it('evaluates required evidence and optional assertion success rules', async () => {
		const runner = new HarnessRunner({
			targetResolver,
			artifactStore: new MemoryArtifactStore(),
			adapters: [
				scriptedAdapter('deterministic-browser', async () => ({
					status: 'completed',
					summary: 'Done',
					artifacts: [{ kind: 'step-summary', summary: 'Only text' }],
				})),
			],
		});
		const scenario = defineHarnessScenario({
			meta: {
				key: 'qa.evidence.required',
				version: '1.0.0',
				title: 'Evidence required',
				description: 'Missing required screenshot',
				domain: 'harness',
				owners: ['platform.harness'],
				tags: ['qa'],
				stability: 'experimental',
			},
			target: { allowlistedDomains: ['example.test'] },
			allowedModes: ['deterministic-browser'],
			requiredEvidence: ['screenshot'],
			steps: [
				{
					key: 'open',
					description: 'Open',
					actionClass: 'read',
					intent: 'Open',
					expectedEvidence: ['dom-snapshot'],
				},
			],
			assertions: [
				{
					key: 'open-completed',
					type: 'step-status',
					source: 'open',
					match: 'completed',
				},
			],
			success: { requireAllAssertions: false },
		});
		const evaluationRunner = new HarnessEvaluationRunner({ runner });

		const result = await evaluationRunner.runScenarioEvaluation({ scenario });

		expect(result.status).toBe('passed');
		expect(
			result.assertions.map((assertion) => assertion.assertionKey)
		).toEqual([
			'open-completed',
			'required-evidence:screenshot',
			'expected-evidence:open:dom-snapshot',
		]);
		expect(
			result.assertions.filter((assertion) => assertion.status === 'failed')
		).toHaveLength(2);
	});

	it('honors maxBlockedSteps while resolving evaluation status', async () => {
		const runner = new HarnessRunner({
			targetResolver,
			artifactStore: new MemoryArtifactStore(),
			adapters: [],
		});
		const scenario = defineHarnessScenario({
			meta: {
				key: 'qa.blocked.tolerance',
				version: '1.0.0',
				title: 'Blocked tolerance',
				description: 'Allow one blocked login',
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
			],
			assertions: [],
			success: { maxBlockedSteps: 1 },
		});
		const evaluationRunner = new HarnessEvaluationRunner({ runner });

		const result = await evaluationRunner.runScenarioEvaluation({ scenario });

		expect(result.run.status).toBe('blocked');
		expect(result.status).toBe('passed');
	});

	it('passes suite mode, target, and context into scenario evaluations', async () => {
		const seen: Array<{
			mode: string;
			baseUrl: string | undefined;
			workspaceId: string | undefined;
		}> = [];
		const runner = new HarnessRunner({
			targetResolver: {
				async resolve(request) {
					return {
						targetId: 'target-suite',
						kind: 'preview',
						isolation: 'preview',
						environment: 'preview',
						baseUrl: request.baseUrl,
						allowlistedDomains: request.allowlistedDomains,
					};
				},
			},
			artifactStore: new MemoryArtifactStore(),
			adapters: [
				scriptedAdapter('visual-computer-use', async (input) => {
					seen.push({
						mode: input.step.mode ?? 'missing',
						baseUrl: input.target.baseUrl,
						workspaceId: input.context.workspaceId,
					});
					return { status: 'completed', summary: 'Visual ok' };
				}),
			],
		});
		const scenario = defineHarnessScenario({
			meta: {
				key: 'qa.suite.propagation',
				version: '1.0.0',
				title: 'Suite propagation',
				description: 'Propagates suite options',
				domain: 'harness',
				owners: ['platform.harness'],
				tags: ['qa'],
				stability: 'experimental',
			},
			target: { allowlistedDomains: ['example.test'] },
			allowedModes: ['visual-computer-use'],
			steps: [
				{
					key: 'inspect',
					description: 'Inspect',
					actionClass: 'read',
					intent: 'Inspect',
				},
			],
			assertions: [],
		});
		const suite = defineHarnessSuite({
			meta: {
				key: 'qa.suite.propagation',
				version: '1.0.0',
				title: 'Suite propagation',
				description: 'Suite',
				domain: 'harness',
				owners: ['platform.harness'],
				tags: ['qa'],
				stability: 'experimental',
			},
			scenarios: [{ scenario: { key: scenario.meta.key, version: '1.0.0' } }],
		});
		const evaluationRunner = new HarnessEvaluationRunner({
			runner,
			scenarioRegistry: new HarnessScenarioRegistry([scenario]),
			suiteRegistry: new HarnessSuiteRegistry([suite]),
		});

		await evaluationRunner.runSuiteEvaluation({
			suiteKey: suite.meta.key,
			mode: 'visual-computer-use',
			target: { baseUrl: 'https://custom.example.test' },
			context: { workspaceId: 'workspace-1' },
		});

		expect(seen).toEqual([
			{
				mode: 'missing',
				baseUrl: 'https://custom.example.test',
				workspaceId: 'workspace-1',
			},
		]);
	});
});
