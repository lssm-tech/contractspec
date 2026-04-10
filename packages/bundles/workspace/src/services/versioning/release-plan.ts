import {
	type AgentPromptBundle,
	type AgentTarget,
	compareVersions,
	countUpgradePlanStepLevels,
	createAgentPromptBundles,
	dedupeUpgradePlanSteps,
	type GeneratedReleaseManifest,
	type GeneratedReleaseManifestEntry,
	sortReleaseManifest,
	type UpgradePackageTarget,
	type UpgradePlan,
} from '@contractspec/lib.contracts-spec';

export interface InstalledPackageVersion {
	name: string;
	currentVersion?: string;
}

export function selectUpgradeReleases(
	manifest: GeneratedReleaseManifest,
	packages: InstalledPackageVersion[]
): GeneratedReleaseManifestEntry[] {
	if (packages.length === 0) {
		return sortReleaseManifest(manifest);
	}

	const packageVersions = new Map(
		packages.map((pkg) => [pkg.name, pkg.currentVersion ?? '0.0.0'])
	);

	return sortReleaseManifest({
		...manifest,
		releases: manifest.releases.filter((release) =>
			release.packages.some((pkg) => {
				const currentVersion = packageVersions.get(pkg.name);
				if (!currentVersion || !pkg.version) {
					return false;
				}
				return compareVersions(pkg.version, currentVersion) === 1;
			})
		),
	});
}

export function createUpgradePlan(
	manifest: GeneratedReleaseManifest,
	packages: InstalledPackageVersion[],
	agentTargets: AgentTarget[],
	renderPrompt: (agent: AgentTarget, plan: UpgradePlan) => string
): UpgradePlan {
	const releases = selectUpgradeReleases(manifest, packages);
	const targetPackages = buildUpgradeTargets(releases, packages);
	const steps = dedupeUpgradePlanSteps(
		releases.flatMap((release) => release.upgradeSteps)
	);
	const counts = countUpgradePlanStepLevels(steps);

	const basePlan: UpgradePlan = {
		generatedAt: new Date().toISOString(),
		targetPackages,
		releases,
		steps,
		autofixCount: counts.auto,
		manualCount: counts.manual,
		assistedCount: counts.assisted,
		agentPrompts: [],
	};

	const agentPrompts: AgentPromptBundle[] = createAgentPromptBundles(
		basePlan,
		agentTargets,
		renderPrompt
	);

	return {
		...basePlan,
		agentPrompts,
	};
}

function buildUpgradeTargets(
	releases: GeneratedReleaseManifestEntry[],
	packages: InstalledPackageVersion[]
): UpgradePackageTarget[] {
	const currentVersions = new Map(
		packages.map((pkg) => [pkg.name, pkg.currentVersion])
	);
	const targets = new Map<string, UpgradePackageTarget>();

	for (const release of releases) {
		for (const pkg of release.packages) {
			const current = currentVersions.get(pkg.name);
			const existing = targets.get(pkg.name);
			if (!existing) {
				targets.set(pkg.name, {
					name: pkg.name,
					currentVersion: current,
					targetVersion: pkg.version,
				});
				continue;
			}

			if (
				pkg.version &&
				existing.targetVersion &&
				compareVersions(pkg.version, existing.targetVersion) === 1
			) {
				existing.targetVersion = pkg.version;
			}
		}
	}

	return Array.from(targets.values()).sort((left, right) =>
		left.name.localeCompare(right.name)
	);
}
