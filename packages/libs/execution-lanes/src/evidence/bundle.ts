import type { HarnessCapturedArtifact } from '@contractspec/lib.harness';
import { normalizeArtifacts } from '@contractspec/lib.harness/evidence/normalizer';
import {
	type EvidenceBundleRef,
	normalizeExecutionLaneEvidenceClasses,
} from '../types';
import { deepClone } from '../utils/deep-clone';
import { createId } from '../utils/id';

export interface CreateEvidenceBundleInput {
	runId: string;
	classes: string[];
	artifacts: HarnessCapturedArtifact[];
	freshForMinutes?: number;
	replayBundleUri?: string;
	summary?: string;
	metadata?: Record<string, unknown>;
	now?: () => Date;
}

export function createEvidenceBundle(
	input: CreateEvidenceBundleInput
): EvidenceBundleRef {
	const normalized = normalizeArtifacts({
		runId: input.runId,
		artifacts: input.artifacts,
		now: input.now,
		idFactory: () => createId('artifact'),
	});

	return {
		id: createId('evidence'),
		runId: input.runId,
		artifactIds: normalized.map((artifact) => artifact.artifactId),
		classes: normalizeExecutionLaneEvidenceClasses(input.classes),
		createdAt: (input.now?.() ?? new Date()).toISOString(),
		freshUntil:
			input.freshForMinutes === undefined
				? undefined
				: new Date(
						(input.now?.() ?? new Date()).getTime() +
							input.freshForMinutes * 60_000
					).toISOString(),
		replayBundleUri: input.replayBundleUri,
		summary: input.summary,
		metadata: input.metadata ? deepClone(input.metadata) : undefined,
	};
}
