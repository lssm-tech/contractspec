import type {
	AgentPromptBundle,
	AgentTarget,
	GeneratedReleaseManifest,
	GeneratedReleaseManifestEntry,
	UpgradePlan,
	UpgradePlanStep,
	UpgradeStepLevel,
} from "./release-types";
import { compareVersions } from "./utils";

function maxPackageVersion(entry: GeneratedReleaseManifestEntry): string | null {
	if (entry.version) {
		return entry.version;
	}

	const versions = entry.packages
		.map((pkg) => pkg.version)
		.filter((version): version is string => typeof version === "string");

	if (versions.length === 0) {
		return null;
	}

	return versions.reduce((max, current) =>
		compareVersions(current, max) === 1 ? current : max,
	);
}

export function sortReleaseManifest(
	manifest: GeneratedReleaseManifest
): GeneratedReleaseManifestEntry[] {
	return [...manifest.releases].sort((left, right) => {
		const dateOrder = new Date(right.date).getTime() - new Date(left.date).getTime();
		if (dateOrder !== 0) {
			return dateOrder;
		}

		const leftVersion = maxPackageVersion(left);
		const rightVersion = maxPackageVersion(right);
		if (leftVersion && rightVersion) {
			return compareVersions(rightVersion, leftVersion);
		}
		if (leftVersion) {
			return -1;
		}
		if (rightVersion) {
			return 1;
		}
		return left.slug.localeCompare(right.slug);
	});
}

export function countUpgradePlanStepLevels(steps: UpgradePlanStep[]): Record<
	UpgradeStepLevel,
	number
> {
	return steps.reduce(
		(counts, step) => {
			counts[step.level] += 1;
			return counts;
		},
		{ auto: 0, assisted: 0, manual: 0 }
	);
}

export function dedupeUpgradePlanSteps(
	steps: UpgradePlanStep[]
): UpgradePlanStep[] {
	const byId = new Map<string, UpgradePlanStep>();

	for (const step of steps) {
		const existing = byId.get(step.id);
		if (!existing) {
			byId.set(step.id, {
				...step,
				instructions: [...step.instructions],
				packages: step.packages ? [...step.packages] : undefined,
				autofixes: step.autofixes ? [...step.autofixes] : undefined,
			});
			continue;
		}

		existing.instructions = Array.from(
			new Set([...existing.instructions, ...step.instructions])
		);
		existing.packages = Array.from(
			new Set([...(existing.packages ?? []), ...(step.packages ?? [])])
		);
		existing.autofixes = Array.from(
			new Map(
				[...(existing.autofixes ?? []), ...(step.autofixes ?? [])].map((fix) => [
					fix.id,
					fix,
				])
			).values()
		);
	}

	return Array.from(byId.values());
}

export function createAgentPromptBundles(
	plan: UpgradePlan,
	agentTargets: AgentTarget[],
	renderPrompt: (agent: AgentTarget, plan: UpgradePlan) => string
): AgentPromptBundle[] {
	return agentTargets.map((agent) => ({
		agent,
		title: `Upgrade guide for ${agent}`,
		prompt: renderPrompt(agent, plan),
	}));
}
