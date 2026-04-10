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
		const artifacts = [];

		for (const step of input.scenario.steps) {
			const stepId = this.idFactory();
			const mode = step.mode ?? input.mode ?? this.defaultMode;
			const decision = classifyHarnessStep({ scenario: input.scenario, step });
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

			if (!input.scenario.allowedModes.includes(mode)) {
				recordedStep.status = 'blocked';
				recordedStep.summary = 'Requested execution mode is not allowed.';
				continue;
			}

			if (decision.verdict === 'blocked') {
				recordedStep.status = 'blocked';
				recordedStep.summary = decision.reasons.join(', ');
				continue;
			}

			if (decision.requiresApproval) {
				const approval = await this.options.approvalGateway?.approve({
					context,
					runId: run.runId,
					stepKey: step.key,
					actionClass: step.actionClass,
					reasons: decision.reasons,
				});
				if (!approval?.approved) {
					recordedStep.status = 'blocked';
					recordedStep.summary = approval?.reason ?? 'Approval required.';
					continue;
				}
			}

			recordedStep.status = 'running';
			recordedStep.startedAt = this.now().toISOString();
			let result = await this.executeWithAdapter(mode, {
				context,
				scenario: input.scenario,
				runId: run.runId,
				step,
				target,
			});

			if (
				result?.status === 'unsupported' &&
				canFallbackToVisual({ scenario: input.scenario, currentMode: mode })
			) {
				result = await this.executeWithAdapter('visual-computer-use', {
					context,
					scenario: input.scenario,
					runId: run.runId,
					step: { ...step, mode: 'visual-computer-use' },
					target,
				});
				recordedStep.mode = 'visual-computer-use';
				recordedStep.metadata = { fallbackFrom: mode };
			}

			const normalized = normalizeArtifacts({
				runId: run.runId,
				stepId,
				artifacts: result?.artifacts,
				now: this.now,
				idFactory: this.idFactory,
			});
			for (const artifact of normalized) {
				artifacts.push(await this.options.artifactStore.put(artifact));
			}

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
