import type { EvidenceArtifact } from '@contractspec/lib.contracts-spec';
import { createHash, randomUUID } from 'crypto';
import type { HarnessCapturedArtifact, HarnessStoredArtifact } from '../types';

function hashArtifact(input: HarnessCapturedArtifact) {
	const source = JSON.stringify({
		kind: input.kind,
		uri: input.uri,
		summary: input.summary,
		body:
			typeof input.body === 'string'
				? input.body
				: Buffer.isBuffer(input.body)
					? input.body.toString('base64')
					: (input.body ?? null),
	});
	return createHash('sha256').update(source).digest('hex');
}

export function normalizeArtifact(input: {
	runId: string;
	stepId?: string;
	artifact: HarnessCapturedArtifact;
	now?: () => Date;
	idFactory?: () => string;
}): HarnessStoredArtifact {
	const artifactId = input.idFactory?.() ?? randomUUID();
	const createdAt = (input.now?.() ?? new Date()).toISOString();
	const normalized: EvidenceArtifact = {
		artifactId,
		kind: input.artifact.kind,
		runId: input.runId,
		stepId: input.stepId,
		uri: input.artifact.uri ?? `artifact://${artifactId}`,
		contentType: input.artifact.contentType,
		hash: input.artifact.hash ?? hashArtifact(input.artifact),
		summary: input.artifact.summary,
		createdAt,
		metadata: input.artifact.metadata,
	};

	return {
		...normalized,
		body: input.artifact.body,
	};
}

export function normalizeArtifacts(input: {
	runId: string;
	stepId?: string;
	artifacts: HarnessCapturedArtifact[] | undefined;
	now?: () => Date;
	idFactory?: () => string;
}) {
	return (input.artifacts ?? []).map((artifact) =>
		normalizeArtifact({
			runId: input.runId,
			stepId: input.stepId,
			artifact,
			now: input.now,
			idFactory: input.idFactory,
		})
	);
}
