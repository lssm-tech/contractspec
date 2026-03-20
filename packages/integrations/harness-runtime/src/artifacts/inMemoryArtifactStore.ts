import type {
	HarnessArtifactQuery,
	HarnessArtifactStore,
	HarnessStoredArtifact,
} from '../types';

export class InMemoryHarnessArtifactStore implements HarnessArtifactStore {
	private readonly items = new Map<string, HarnessStoredArtifact>();

	async put(artifact: HarnessStoredArtifact) {
		this.items.set(artifact.artifactId, artifact);
		return artifact;
	}

	async get(artifactId: string) {
		return this.items.get(artifactId);
	}

	async list(query: HarnessArtifactQuery = {}) {
		return [...this.items.values()].filter((artifact) => {
			if (query.runId && artifact.runId !== query.runId) return false;
			if (query.stepId && artifact.stepId !== query.stepId) return false;
			if (query.kind && artifact.kind !== query.kind) return false;
			return true;
		});
	}
}
