import type { HarnessRunRecord } from '@contractspec/lib.contracts-spec';
import { randomUUID } from 'crypto';
import { normalizeArtifacts } from '../evidence/normalizer';
import { canFallbackToVisual, classifyHarnessStep } from '../policy/classifier';
import type {
	HarnessExecutionAdapter,
	HarnessRecordedStep,
	HarnessRunnerOptions,
	HarnessRunScenarioInput,
	HarnessRunScenarioResult,
	HarnessScenarioHookExecutionResult,
	HarnessStoredArtifact,
} from '../types';

export class HarnessRunner {
	private readonly adapters: HarnessExecutionAdapter[];
	private readonly now: () => Date;
	private readonly idFactory: () => string;
	private readonly defaultMode;

	constructor(private readonly options: HarnessRunnerOptions) {
		this.adapters = options.adapters;
		this.now = options.now ?? (() => new Date());
		this.idFactory = options.idFactory ?? (() => randomUUID());
		this.defaultMode = options.defaultMode ?? 'deterministic-browser';
	}

	async runScenario(
		input: HarnessRunScenarioInput
	): Promise<HarnessRunScenarioResult> {
		const context = input.context ?? {};
		const target = await this.options.targetResolver.resolve({
			explicitTargetId: input.target?.targetId,
			preferredTargets: input.scenario.target.preferredTargets,
			isolation: input.target?.isolation ?? input.scenario.target.isolation,
			baseUrl: input.target?.baseUrl,
			allowlistedDomains:
				input.target?.allowlistedDomains ??
				input.scenario.target.allowlistedDomains,
			metadata: context.metadata,
		});

		const run: HarnessRunRecord = {
			runId: this.idFactory(),
			status: 'running',
			mode: input.mode ?? this.defaultMode,
			scenarioKey: input.scenario.meta.key,
			suiteKey: input.suiteKey,
			controlPlaneExecutionId: context.controlPlaneExecutionId,
			target,
			steps: [],
			createdAt: this.now().toISOString(),
			updatedAt: this.now().toISOString(),
		};
		const artifacts: HarnessStoredArtifact[] = [];

		if (this.requiresHookExecutor(input.scenario)) {
			this.recordHookBlocked(run);
		} else {
			try {
				await this.executeHooks({
					artifacts,
					context,
					phase: 'setup',
					run,
					scenario: input.scenario,
					target,
				});
				if (run.status === 'running') {
					for (const step of input.scenario.steps) {
						await this.executeStep({
							artifacts,
							context,
							input,
							run,
							step,
							target,
						});
					}
				}
			} finally {
				await this.executeHooks({
					artifacts,
					context,
					phase: 'reset',
					run,
					scenario: input.scenario,
					target,
				});
			}
		}

		run.evidenceCount = artifacts.length;
		run.updatedAt = this.now().toISOString();
		run.status = this.resolveRunStatus(run);
		return { run, artifacts };
	}

	private resolveRunStatus(run: HarnessRunRecord) {
		if (run.steps.some((step) => step.status === 'failed')) return 'failed';
		if (run.steps.some((step) => step.status === 'blocked')) return 'blocked';
		return 'completed';
	}

	private async executeStep(input: {
		artifacts: HarnessStoredArtifact[];
		context: HarnessRunScenarioInput['context'];
		input: HarnessRunScenarioInput;
		run: HarnessRunRecord;
		step: HarnessRunScenarioInput['scenario']['steps'][number];
		target: HarnessRunRecord['target'];
	}) {
		const { context = {}, run, step, target } = input;
		const stepId = this.idFactory();
		const mode = step.mode ?? input.input.mode ?? this.defaultMode;
		const decision = classifyHarnessStep({
			scenario: input.input.scenario,
			step,
		});
		const recordedStep: HarnessRecordedStep = {
			stepId,
			stepKey: step.key,
			runId: run.runId,
			mode,
			actionClass: step.actionClass,
			verdict: decision.verdict,
			requiresApproval: decision.requiresApproval,
			status: 'pending',
		};
		run.steps.push(recordedStep);

		if (!input.input.scenario.allowedModes.includes(mode)) {
			recordedStep.status = 'blocked';
			recordedStep.summary = 'Requested execution mode is not allowed.';
			return;
		}

		if (decision.verdict === 'blocked') {
			recordedStep.status = 'blocked';
			recordedStep.summary = decision.reasons.join(', ');
			return;
		}

		if (decision.requiresApproval) {
			const approval = await this.options.approvalGateway?.approve({
				context,
				runId: run.runId,
				stepKey: step.key,
				actionClass: step.actionClass,
				target,
				reasons: decision.reasons,
			});
			if (!approval?.approved) {
				recordedStep.status = 'blocked';
				recordedStep.summary = approval?.reason ?? 'Approval required.';
				return;
			}
		}

		recordedStep.status = 'running';
		recordedStep.startedAt = this.now().toISOString();
		let result = await this.executeWithAdapter(mode, {
			context,
			scenario: input.input.scenario,
			runId: run.runId,
			step,
			target,
		});

		if (
			result?.status === 'unsupported' &&
			canFallbackToVisual({ scenario: input.input.scenario, currentMode: mode })
		) {
			result = await this.executeWithAdapter('visual-computer-use', {
				context,
				scenario: input.input.scenario,
				runId: run.runId,
				step: { ...step, mode: 'visual-computer-use' },
				target,
			});
			recordedStep.mode = 'visual-computer-use';
			recordedStep.metadata = { fallbackFrom: mode };
		}

		await this.storeArtifacts(
			input.artifacts,
			stepId,
			run.runId,
			result?.artifacts
		);

		recordedStep.output = result?.output;
		recordedStep.completedAt = this.now().toISOString();
		recordedStep.summary = result?.summary;
		recordedStep.metadata = {
			...(recordedStep.metadata ?? {}),
			...(result?.metadata ?? {}),
			output: result?.output,
			reasons: result?.reasons,
		};
		recordedStep.status =
			result?.status === 'completed'
				? 'completed'
				: result?.status === 'blocked'
					? 'blocked'
					: 'failed';
	}

	private requiresHookExecutor(scenario: HarnessRunScenarioInput['scenario']) {
		return (
			((scenario.setup?.length ?? 0) > 0 ||
				(scenario.reset?.length ?? 0) > 0) &&
			!this.options.hookExecutor
		);
	}

	private recordHookBlocked(run: HarnessRunRecord) {
		run.steps.push({
			stepId: this.idFactory(),
			stepKey: '__harness_hooks__',
			runId: run.runId,
			mode: run.mode,
			actionClass: 'unknown',
			verdict: 'blocked',
			requiresApproval: false,
			status: 'blocked',
			summary:
				'Harness scenario hook executor is required for setup/reset hooks.',
		});
	}

	private async executeHooks(input: {
		artifacts: HarnessStoredArtifact[];
		context: HarnessRunScenarioInput['context'];
		phase: 'setup' | 'reset';
		run: HarnessRunRecord;
		scenario: HarnessRunScenarioInput['scenario'];
		target: HarnessRunRecord['target'];
	}) {
		const hooks =
			input.phase === 'setup' ? input.scenario.setup : input.scenario.reset;
		if (!hooks?.length || !this.options.hookExecutor) return;

		for (const hook of hooks) {
			const stepId = this.idFactory();
			const recordedStep: HarnessRecordedStep = {
				stepId,
				stepKey: `__${input.phase}:${hook.operation.key}`,
				runId: input.run.runId,
				mode: input.run.mode,
				actionClass: 'read',
				verdict: 'autonomous',
				requiresApproval: false,
				status: 'running',
				startedAt: this.now().toISOString(),
			};
			input.run.steps.push(recordedStep);
			const result = await this.executeHookSafely({
				context: input.context ?? {},
				scenario: input.scenario,
				runId: input.run.runId,
				hook,
				phase: input.phase,
				target: input.target,
			});
			await this.storeHookResult(
				input.artifacts,
				input.run.runId,
				stepId,
				result
			);
			recordedStep.completedAt = this.now().toISOString();
			recordedStep.output = result.output;
			recordedStep.summary = result.summary;
			recordedStep.metadata = {
				...(result.metadata ?? {}),
				output: result.output,
				reasons: result.reasons,
			};
			recordedStep.status =
				result.status === 'completed'
					? 'completed'
					: result.status === 'blocked'
						? 'blocked'
						: 'failed';
			if (input.phase === 'setup' && recordedStep.status !== 'completed') {
				input.run.status = recordedStep.status;
				return;
			}
		}
	}

	private async executeHookSafely(
		input: Parameters<
			NonNullable<HarnessRunnerOptions['hookExecutor']>['execute']
		>[0]
	): Promise<HarnessScenarioHookExecutionResult> {
		try {
			const executor = this.options.hookExecutor;
			if (!executor) {
				return {
					status: 'blocked',
					summary: 'Harness scenario hook executor is required.',
				};
			}
			return await executor.execute(input);
		} catch (error) {
			return {
				status: 'failed',
				summary: error instanceof Error ? error.message : String(error),
				reasons: ['hook_executor_error'],
			};
		}
	}

	private async storeHookResult(
		artifacts: HarnessStoredArtifact[],
		runId: string,
		stepId: string,
		result: HarnessScenarioHookExecutionResult
	) {
		await this.storeArtifacts(artifacts, stepId, runId, result.artifacts);
	}

	private async storeArtifacts(
		stored: HarnessStoredArtifact[],
		stepId: string,
		runId: string,
		artifacts: Parameters<typeof normalizeArtifacts>[0]['artifacts']
	) {
		const normalized = normalizeArtifacts({
			runId,
			stepId,
			artifacts,
			now: this.now,
			idFactory: this.idFactory,
		});
		for (const artifact of normalized) {
			stored.push(await this.options.artifactStore.put(artifact));
		}
	}

	private async executeWithAdapter(
		mode: string,
		input: Parameters<HarnessExecutionAdapter['execute']>[0]
	) {
		const adapter = this.adapters.find(
			(candidate) => candidate.mode === mode && candidate.supports(input.step)
		);
		if (!adapter) {
			return {
				status: 'unsupported' as const,
				summary: `No adapter available for ${mode}.`,
				reasons: ['adapter_missing'],
			};
		}
		return adapter.execute(input);
	}
}
