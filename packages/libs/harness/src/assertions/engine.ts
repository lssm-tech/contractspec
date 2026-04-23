import { deepStrictEqual } from 'node:assert';
import type {
	HarnessAssertionResult,
	HarnessScenarioSpec,
} from '@contractspec/lib.contracts-spec';
import type { HarnessRecordedStep, HarnessStoredArtifact } from '../types';

function countMatches(
	assertion: HarnessScenarioSpec['assertions'][number],
	steps: HarnessRecordedStep[],
	artifacts: HarnessStoredArtifact[]
) {
	if (assertion.source == null) return artifacts.length;
	return (
		artifacts.filter((artifact) => artifact.kind === assertion.source).length ||
		steps.filter((step) => step.stepKey === assertion.source).length
	);
}

function matchText(
	assertion: HarnessScenarioSpec['assertions'][number],
	steps: HarnessRecordedStep[],
	artifacts: HarnessStoredArtifact[]
) {
	const needle = String(assertion.match ?? '');
	const candidates = [
		...steps
			.filter(
				(step) => assertion.source == null || step.stepKey === assertion.source
			)
			.map((step) => step.summary ?? ''),
		...artifacts
			.filter(
				(artifact) =>
					assertion.source == null || artifact.kind === assertion.source
			)
			.map((artifact) => artifact.summary ?? ''),
	];
	return candidates.some((value) => value.includes(needle));
}

function matchJson(
	assertion: HarnessScenarioSpec['assertions'][number],
	steps: HarnessRecordedStep[]
) {
	const target = steps.find((step) => step.stepKey === assertion.source);
	try {
		deepStrictEqual(target?.metadata?.output, assertion.match);
		return true;
	} catch {
		return false;
	}
}

function matchVisualDiff(
	assertion: HarnessScenarioSpec['assertions'][number],
	artifacts: HarnessStoredArtifact[]
) {
	const candidates = artifacts.filter(
		(artifact) =>
			artifact.kind === 'visual-diff' &&
			(assertion.source == null ||
				artifact.stepId === assertion.source ||
				artifact.summary?.includes(assertion.source))
	);
	const thresholds =
		typeof assertion.match === 'object' && assertion.match !== null
			? (assertion.match as { maxDiffBytes?: number; maxDiffRatio?: number })
			: {};

	for (const artifact of candidates) {
		const metadata = artifact.metadata ?? {};
		if (metadata['status'] === 'passed') return true;
		const diffBytes =
			typeof metadata['diffBytes'] === 'number'
				? metadata['diffBytes']
				: undefined;
		const diffRatio =
			typeof metadata['diffRatio'] === 'number'
				? metadata['diffRatio']
				: undefined;
		const bytesPass =
			thresholds.maxDiffBytes == null ||
			(diffBytes != null && diffBytes <= thresholds.maxDiffBytes);
		const ratioPass =
			thresholds.maxDiffRatio == null ||
			(diffRatio != null && diffRatio <= thresholds.maxDiffRatio);
		if (bytesPass && ratioPass) return true;
	}

	return false;
}

export function evaluateHarnessAssertions(input: {
	scenario: HarnessScenarioSpec;
	steps: HarnessRecordedStep[];
	artifacts: HarnessStoredArtifact[];
}): HarnessAssertionResult[] {
	const authoredResults: HarnessAssertionResult[] =
		input.scenario.assertions.map((assertion): HarnessAssertionResult => {
			switch (assertion.type) {
				case 'artifact': {
					const artifacts = input.artifacts.filter(
						(artifact) =>
							assertion.source == null || artifact.kind === assertion.source
					);
					return {
						assertionKey: assertion.key,
						status: artifacts.length > 0 ? 'passed' : 'failed',
						message:
							artifacts.length > 0
								? undefined
								: 'No matching artifact was captured.',
						evidenceArtifactIds: artifacts.map(
							(artifact) => artifact.artifactId
						),
					};
				}
				case 'step-status': {
					const step = input.steps.find(
						(candidate) => candidate.stepKey === assertion.source
					);
					const passed = step?.status === assertion.match;
					return {
						assertionKey: assertion.key,
						status: passed ? 'passed' : 'failed',
						message: passed
							? undefined
							: `Step status ${step?.status ?? 'missing'} did not match ${String(assertion.match)}.`,
					};
				}
				case 'text-match': {
					const passed = matchText(assertion, input.steps, input.artifacts);
					return {
						assertionKey: assertion.key,
						status: passed ? 'passed' : 'failed',
						message: passed
							? undefined
							: 'Expected text was not found in step or artifact summaries.',
					};
				}
				case 'json-match': {
					const passed = matchJson(assertion, input.steps);
					return {
						assertionKey: assertion.key,
						status: passed ? 'passed' : 'failed',
						message: passed
							? undefined
							: 'Structured output did not match the assertion payload.',
					};
				}
				case 'count': {
					const count = countMatches(assertion, input.steps, input.artifacts);
					const passed =
						(assertion.min == null || count >= assertion.min) &&
						(assertion.max == null || count <= assertion.max) &&
						(typeof assertion.match !== 'number' || count === assertion.match);
					return {
						assertionKey: assertion.key,
						status: passed ? 'passed' : 'failed',
						message: passed
							? undefined
							: `Observed count ${count} did not satisfy the assertion.`,
					};
				}
				case 'visual-diff': {
					const passed = matchVisualDiff(assertion, input.artifacts);
					return {
						assertionKey: assertion.key,
						status: passed ? 'passed' : 'failed',
						message: passed
							? undefined
							: 'No visual diff artifact satisfied the assertion thresholds.',
						evidenceArtifactIds: input.artifacts
							.filter((artifact) => artifact.kind === 'visual-diff')
							.map((artifact) => artifact.artifactId),
					};
				}
				default:
					return {
						assertionKey: assertion.key,
						status: 'failed',
						message: `Unsupported assertion type ${assertion.type}.`,
					};
			}
		});
	return [...authoredResults, ...evaluateRequiredEvidence(input)];
}

function evaluateRequiredEvidence(input: {
	scenario: HarnessScenarioSpec;
	steps: HarnessRecordedStep[];
	artifacts: HarnessStoredArtifact[];
}): HarnessAssertionResult[] {
	const results: HarnessAssertionResult[] = [];
	for (const kind of input.scenario.requiredEvidence ?? []) {
		const matching = input.artifacts.filter(
			(artifact) => artifact.kind === kind
		);
		results.push({
			assertionKey: `required-evidence:${kind}`,
			status: matching.length > 0 ? 'passed' : 'failed',
			message:
				matching.length > 0
					? undefined
					: `Required evidence ${kind} was not captured.`,
			evidenceArtifactIds: matching.map((artifact) => artifact.artifactId),
		});
	}

	for (const scenarioStep of input.scenario.steps) {
		const recordedStep = input.steps.find(
			(step) => step.stepKey === scenarioStep.key
		);
		for (const kind of scenarioStep.expectedEvidence ?? []) {
			const matching = input.artifacts.filter(
				(artifact) =>
					artifact.kind === kind && artifact.stepId === recordedStep?.stepId
			);
			results.push({
				assertionKey: `expected-evidence:${scenarioStep.key}:${kind}`,
				status: matching.length > 0 ? 'passed' : 'failed',
				message:
					matching.length > 0
						? undefined
						: `Expected evidence ${kind} was not captured for step ${scenarioStep.key}.`,
				evidenceArtifactIds: matching.map((artifact) => artifact.artifactId),
			});
		}
	}

	return results;
}
