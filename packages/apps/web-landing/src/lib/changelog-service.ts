import {
	compareVersions,
	GeneratedReleaseManifestSchema,
} from '@contractspec/lib.contracts-spec';
import fs from 'fs';
import {
	changelogConfigToCacheKey,
	resolveChangelogConfig,
} from '@/lib/changelog-config';
import type {
	ChangelogAudienceDetail,
	ChangelogEntry,
	ChangelogManifest,
	ChangelogMigrationInstruction,
	ChangelogPackageDetail,
	ChangelogReleaseDetail,
	ChangelogReleaseEntryDetail,
	ChangelogReleaseSummary,
	ChangelogUpgradeStep,
} from '@/lib/changelog-types';

interface ChangelogDataset {
	key: string;
	manifest: ChangelogManifest;
	detailsByVersion: Map<string, ChangelogReleaseDetail>;
	legacyEntries: ChangelogEntry[];
}

interface ReleaseAccumulator {
	version: string;
	date: string;
	isBreaking: boolean;
	packages: Map<string, ChangelogPackageDetail>;
	changes: Map<
		string,
		{
			text: string;
			packages: Set<string>;
			layers: Set<string>;
			occurrences: number;
		}
	>;
	audiences: Map<string, ChangelogAudienceDetail>;
	deprecations: Set<string>;
	migrationInstructions: Map<string, ChangelogMigrationInstruction>;
	upgradeSteps: Map<string, ChangelogUpgradeStep>;
	releases: ChangelogReleaseEntryDetail[];
}

let cachedDataset: ChangelogDataset | null = null;

export async function getChangelogManifest(): Promise<ChangelogManifest> {
	return getDataset().manifest;
}

export async function getChangelogReleaseByVersion(
	version: string
): Promise<ChangelogReleaseDetail | null> {
	return getDataset().detailsByVersion.get(version) ?? null;
}

export async function getChangelogVersions(): Promise<string[]> {
	return getDataset().manifest.releases.map((entry) => entry.version);
}

export async function getAggregatedChangelog(): Promise<ChangelogEntry[]> {
	return getDataset().legacyEntries;
}

function getDataset(): ChangelogDataset {
	const config = resolveChangelogConfig();
	const key = changelogConfigToCacheKey(config);
	if (cachedDataset && cachedDataset.key === key) {
		return cachedDataset;
	}

	const manifestPath = config.generatedManifestPath;
	if (!fs.existsSync(manifestPath)) {
		throw new Error(
			`Missing canonical release manifest at ${manifestPath}. Run \`contractspec release build\` before building the website.`
		);
	}

	const manifest = GeneratedReleaseManifestSchema.parse(
		JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
	);
	const releases = new Map<string, ReleaseAccumulator>();

	for (const release of manifest.releases) {
		const packages = release.packages
			.map((pkg) => ({
				name: pkg.name,
				packageSlug:
					pkg.name
						.split('/')
						.pop()
						?.replace(/^app\.|^lib\.|^module\.|^bundle\.|^integration\./, '') ??
					pkg.name,
				layer: inferLayer(pkg.name),
				changes: [
					release.summary,
					...release.upgradeSteps.map((step) => step.summary),
					...release.migrationInstructions.map(
						(instruction) => instruction.summary
					),
					...release.deprecations,
				].filter(Boolean),
			}))
			.filter((pkg) =>
				config.includeLayers.includes(pkg.layer)
					? !config.excludeLayers.includes(pkg.layer)
					: config.includeLayers.length === 0
			);
		if (packages.length === 0) {
			continue;
		}

		const entry: ChangelogReleaseEntryDetail = {
			slug: release.slug,
			summary: release.summary,
			isBreaking: release.isBreaking,
			packages,
			audiences: release.audiences.map((audience) => ({
				kind: audience.kind,
				summary: audience.summary,
				affectedPackages: audience.affectedPackages ?? [],
				affectedRuntimes: audience.affectedRuntimes ?? [],
				affectedFrameworks: audience.affectedFrameworks ?? [],
			})),
			deprecations: [...release.deprecations],
			migrationInstructions: release.migrationInstructions.map(
				(instruction) => ({
					...instruction,
				})
			),
			upgradeSteps: release.upgradeSteps.map((step) => ({
				...step,
				packages: step.packages ?? release.packages.map((pkg) => pkg.name),
			})),
		};
		const accumulator = upsertAccumulator(
			releases,
			release.version,
			release.date,
			release.isBreaking
		);
		accumulator.releases.push(entry);
		for (const pkg of entry.packages) {
			accumulator.packages.set(pkg.name, pkg);
			for (const changeText of pkg.changes) {
				upsertChange(accumulator, changeText, pkg.name, pkg.layer);
			}
		}
		for (const audience of entry.audiences) {
			accumulator.audiences.set(audience.kind, audience);
		}
		for (const deprecation of entry.deprecations) {
			accumulator.deprecations.add(deprecation);
		}
		for (const instruction of entry.migrationInstructions) {
			accumulator.migrationInstructions.set(instruction.id, instruction);
		}
		for (const step of entry.upgradeSteps) {
			accumulator.upgradeSteps.set(step.id, step);
		}
	}

	const details = Array.from(releases.values())
		.sort((left, right) => sortReleases(right, left))
		.map(toDetail);
	const summaries: ChangelogReleaseSummary[] = details.map((detail) => ({
		version: detail.version,
		date: detail.date,
		isBreaking: detail.isBreaking,
		packageCount: detail.packageCount,
		changeCount: detail.changeCount,
		layers: detail.layers,
		highlights: detail.highlights,
		releaseCount: detail.releaseCount,
	}));

	cachedDataset = {
		key,
		manifest: {
			generatedAt: manifest.generatedAt,
			totalReleases: summaries.length,
			availableLayers: Array.from(
				new Set(summaries.flatMap((release) => release.layers))
			).sort((a, b) => a.localeCompare(b)),
			config: {
				includeLayers: [...config.includeLayers],
				excludeLayers: [...config.excludeLayers],
				defaultPageSize: config.defaultPageSize,
			},
			releases: summaries,
		},
		detailsByVersion: new Map(
			details.map((detail) => [detail.version, detail])
		),
		legacyEntries: details.map((detail) => ({
			version: detail.version,
			date: detail.date,
			isBreaking: detail.isBreaking,
			packages: detail.packages.map((pkg) => ({
				name: pkg.name,
				changes: pkg.changes.map((change) => `- ${change}`),
			})),
		})),
	};

	return cachedDataset;
}

function upsertAccumulator(
	map: Map<string, ReleaseAccumulator>,
	version: string,
	date: string,
	isBreaking: boolean
): ReleaseAccumulator {
	const existing = map.get(version);
	if (existing) {
		if (new Date(date).getTime() > new Date(existing.date).getTime()) {
			existing.date = date;
		}
		existing.isBreaking ||= isBreaking;
		return existing;
	}

	const created: ReleaseAccumulator = {
		version,
		date,
		isBreaking,
		packages: new Map(),
		changes: new Map(),
		audiences: new Map(),
		deprecations: new Set(),
		migrationInstructions: new Map(),
		upgradeSteps: new Map(),
		releases: [],
	};
	map.set(version, created);
	return created;
}

function upsertChange(
	accumulator: ReleaseAccumulator,
	text: string,
	packageName: string,
	layer: string
): void {
	const existing = accumulator.changes.get(text);
	if (!existing) {
		accumulator.changes.set(text, {
			text,
			packages: new Set([packageName]),
			layers: new Set([layer]),
			occurrences: 1,
		});
		return;
	}
	existing.packages.add(packageName);
	existing.layers.add(layer);
	existing.occurrences += 1;
}

function toDetail(accumulator: ReleaseAccumulator): ChangelogReleaseDetail {
	const packages = Array.from(accumulator.packages.values()).sort((a, b) =>
		a.name.localeCompare(b.name)
	);
	const changes = Array.from(accumulator.changes.values())
		.map((change) => ({
			text: change.text,
			packages: Array.from(change.packages).sort((a, b) => a.localeCompare(b)),
			layers: Array.from(change.layers).sort((a, b) => a.localeCompare(b)),
			occurrences: change.occurrences,
		}))
		.sort(
			(a, b) => b.occurrences - a.occurrences || a.text.localeCompare(b.text)
		);
	const layers = Array.from(new Set(packages.map((pkg) => pkg.layer))).sort(
		(a, b) => a.localeCompare(b)
	);
	const deprecations = Array.from(accumulator.deprecations).sort((a, b) =>
		a.localeCompare(b)
	);
	const highlights = Array.from(
		new Set([
			...accumulator.releases.map((release) => release.summary),
			...deprecations,
		])
	).slice(0, 3);

	return {
		version: accumulator.version,
		date: accumulator.date,
		isBreaking: accumulator.isBreaking,
		packageCount: packages.length,
		changeCount: changes.length,
		layers,
		highlights,
		releaseCount: accumulator.releases.length,
		changes,
		packages,
		audiences: Array.from(accumulator.audiences.values()),
		deprecations,
		migrationInstructions: Array.from(
			accumulator.migrationInstructions.values()
		),
		upgradeSteps: Array.from(accumulator.upgradeSteps.values()),
		releases: accumulator.releases.sort((a, b) => a.slug.localeCompare(b.slug)),
	};
}

function sortReleases(
	left: ReleaseAccumulator,
	right: ReleaseAccumulator
): number {
	const dateOrder =
		new Date(left.date).getTime() - new Date(right.date).getTime();
	if (dateOrder !== 0) {
		return dateOrder;
	}
	return compareVersions(left.version, right.version);
}

function inferLayer(packageName: string): string {
	if (packageName.startsWith('@contractspec/app.')) return 'apps';
	if (packageName.startsWith('@contractspec/bundle.')) return 'bundles';
	if (packageName.startsWith('@contractspec/module.')) return 'modules';
	if (packageName.startsWith('@contractspec/integration.'))
		return 'integrations';
	if (packageName.startsWith('@contractspec/lib.')) return 'libs';
	return 'other';
}
