import type {
	HarnessRunRecord,
	HarnessScenarioRegistry,
	HarnessScenarioSpec,
	HarnessSuiteRegistry,
} from '@contractspec/lib.contracts-spec';
import { randomUUID } from 'crypto';
import { evaluateHarnessAssertions } from '../assertions/engine';
import {
	createHarnessReplayBundle,
	type HarnessReplayBundle,
} from '../replay/bundle';
import type {
	HarnessReplaySink,
	HarnessRunScenarioInput,
	HarnessScenarioEvaluationResult,
	HarnessSuiteEvaluationResult,
} from '../types';
import { HarnessRunner } from './runner';

export interface HarnessEvaluationRunnerOptions {
	runner: HarnessRunner;
	scenarioRegistry?: HarnessScenarioRegistry;
	suiteRegistry?: HarnessSuiteRegistry;
	replaySink?: HarnessReplaySink;
	now?: () => Date;
	idFactory?: () => string;
}

export class HarnessEvaluationRunner {
	private readonly now: () => Date;
	private readonly idFactory: () => string;

	constructor(private readonly options: HarnessEvaluationRunnerOptions) {
		this.now = options.now ?? (() => new Date());
		this.idFactory = options.idFactory ?? (() => randomUUID());
	}

	async runScenarioEvaluation(
		input: HarnessRunScenarioInput
	): Promise<HarnessScenarioEvaluationResult> {
		const execution = await this.options.runner.runScenario(input);
		const assertions = evaluateHarnessAssertions({
			scenario: input.scenario,
			steps: execution.run.steps,
			artifacts: execution.artifacts,
		});
		const bundle = createHarnessReplayBundle({
			run: execution.run,
			assertions,
			artifacts: execution.artifacts,
			now: this.now,
		});
		const replayBundleUri = await this.options.replaySink?.save(bundle);
		return {
			evaluationId: this.idFactory(),
			run: execution.run,
			artifacts: execution.artifacts,
			assertions,
			replayBundleUri,
			status: this.resolveStatus({
				run: execution.run,
				assertions,
				scenario: input.scenario,
			}),
		};
	}

	async runSuiteEvaluation(input: {
		suiteKey: string;
		version?: string;
		mode?: HarnessRunScenarioInput['mode'];
		target?: HarnessRunScenarioInput['target'];
		context?: HarnessRunScenarioInput['context'];
	}): Promise<HarnessSuiteEvaluationResult> {
		const suite = this.options.suiteRegistry?.get(
			input.suiteKey,
			input.version
		);
		if (!suite) throw new Error(`Unknown harness suite ${input.suiteKey}`);

		const evaluations = [];
		for (const entry of suite.scenarios) {
			const scenario = this.options.scenarioRegistry?.get(
				entry.scenario.key,
				entry.scenario.version
			);
			if (!scenario) {
				throw new Error(`Unknown harness scenario ${entry.scenario.key}`);
			}
			evaluations.push(
				await this.runScenarioEvaluation({
					scenario,
					suiteKey: suite.meta.key,
					mode: input.mode,
					target: input.target,
					context: input.context,
				})
			);
		}

		const passedScenarios = evaluations.filter(
			(item) => item.status === 'passed'
		).length;
		const failedScenarios = evaluations.filter(
			(item) => item.status === 'failed'
		).length;
		const blockedScenarios = evaluations.filter(
			(item) => item.status === 'blocked'
		).length;
		const evidenceCount = evaluations.reduce(
			(total, item) => total + item.artifacts.length,
			0
		);
		return {
			suite,
			evaluations,
			summary: {
				suiteKey: suite.meta.key,
				totalScenarios: evaluations.length,
				passedScenarios,
				failedScenarios,
				blockedScenarios,
				evidenceCount,
				passRate:
					evaluations.length === 0 ? 0 : passedScenarios / evaluations.length,
				flakeRate: 0,
			},
		};
	}

	async saveReplayBundle(bundle: HarnessReplayBundle) {
		return this.options.replaySink?.save(bundle);
	}

	private resolveStatus(input: {
		run: HarnessRunRecord;
		assertions: HarnessScenarioEvaluationResult['assertions'];
		scenario: HarnessScenarioSpec;
	}) {
		if (input.run.status === 'failed') return 'failed';

		const blockedSteps = input.run.steps.filter(
			(step) => step.status === 'blocked'
		).length;
		const maxBlockedSteps = input.scenario.success?.maxBlockedSteps ?? 0;
		if (input.run.status === 'blocked' && blockedSteps > maxBlockedSteps) {
			return 'blocked';
		}

		const requireAllAssertions =
			input.scenario.success?.requireAllAssertions ?? true;
		if (input.assertions.length === 0) return 'passed';
		if (requireAllAssertions) {
			return input.assertions.some((assertion) => assertion.status === 'failed')
				? 'failed'
				: 'passed';
		}

		return input.assertions.some((assertion) => assertion.status === 'passed')
			? 'passed'
			: 'failed';
	}
}
