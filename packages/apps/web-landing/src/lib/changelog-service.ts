import { GeneratedReleaseManifestSchema } from '@contractspec/lib.contracts-spec';
import fs from 'fs';
import {
	changelogConfigToCacheKey,
	resolveChangelogConfig,
} from '@/lib/changelog-config';
import {
	type ParsedPackageRelease,
	parseChangelogReleases,
} from '@/lib/changelog-parser';
import type {
	ChangelogEntry,
	ChangelogManifest,
	ChangelogPackageDetail,
	ChangelogReleaseDetail,
} from '@/lib/changelog-types';

interface ReleaseAccumulator {
	version: string;
	date: string;
	isBreaking: boolean;
	packageMap: Map<string, ChangelogPackageDetail>;
	changeMap: Map<string, ChangelogChangeDetailAccumulator>;
}
interface ChangelogChangeDetailAccumulator {
	text: string;
	packages: Set<string>;
	layers: Set<string>;
	occurrences: number;
}
interface ChangelogDataset {
	key: string;
	manifest: ChangelogManifest;
	detailsByVersion: Map<string, ChangelogReleaseDetail>;
	legacyEntries: ChangelogEntry[];
}
let cachedDataset: ChangelogDataset | null = null;

function compareVersions(a: string, b: string): number {
	const [aMajor, aMinor, aPatch] = a
		.split('.')
		.map((part) => Number(part))
		.map((part) => (Number.isFinite(part) ? part : 0));
	const [bMajor, bMinor, bPatch] = b
		.split('.')
		.map((part) => Number(part))
		.map((part) => (Number.isFinite(part) ? part : 0));
	if (aMajor !== bMajor) {
		return bMajor - aMajor;
	}
	if (aMinor !== bMinor) {
		return bMinor - aMinor;
	}
	return bPatch - aPatch;
}

function sortReleaseKeys(a: ReleaseAccumulator, b: ReleaseAccumulator): number {
	const dateOrder = new Date(b.date).getTime() - new Date(a.date).getTime();
	if (dateOrder !== 0) {
		return dateOrder;
	}
	return compareVersions(a.version, b.version);
}

function upsertReleaseAccumulator(
	map: Map<string, ReleaseAccumulator>,
	release: ParsedPackageRelease
): ReleaseAccumulator {
	const existing = map.get(release.version);
	if (existing) {
		if (release.date > existing.date) {
			existing.date = release.date;
		}
		if (release.isBreaking) {
			existing.isBreaking = true;
		}
		return existing;
	}
	const created: ReleaseAccumulator = {
		version: release.version,
		date: release.date,
		isBreaking: release.isBreaking,
		packageMap: new Map<string, ChangelogPackageDetail>(),
		changeMap: new Map<string, ChangelogChangeDetailAccumulator>(),
	};
	map.set(release.version, created);
	return created;
}

function addPackageChanges(
	accumulator: ReleaseAccumulator,
	release: ParsedPackageRelease
): void {
	const existingPackage = accumulator.packageMap.get(release.packageName);
	const packageDetails: ChangelogPackageDetail = existingPackage ?? {
		name: release.packageName,
		packageSlug: release.packageSlug,
		layer: release.layer,
		changes: [],
	};
	for (const changeText of release.changes) {
		if (!packageDetails.changes.includes(changeText)) {
			packageDetails.changes.push(changeText);
		}

		const existingChange = accumulator.changeMap.get(changeText);
		if (!existingChange) {
			accumulator.changeMap.set(changeText, {
				text: changeText,
				packages: new Set([release.packageName]),
				layers: new Set([release.layer]),
				occurrences: 1,
			});
			continue;
		}

		existingChange.packages.add(release.packageName);
		existingChange.layers.add(release.layer);
		existingChange.occurrences += 1;
	}
	accumulator.packageMap.set(release.packageName, packageDetails);
}

function convertAccumulatorToDetail(
	accumulator: ReleaseAccumulator
): ChangelogReleaseDetail {
	const packages = Array.from(accumulator.packageMap.values())
		.map((entry) => ({
			...entry,
			changes: [...entry.changes].sort((a, b) => a.localeCompare(b)),
		}))
		.sort((a, b) => a.name.localeCompare(b.name));

	const changes = Array.from(accumulator.changeMap.values())
		.map((entry) => ({
			text: entry.text,
			packages: Array.from(entry.packages).sort((a, b) => a.localeCompare(b)),
			layers: Array.from(entry.layers).sort((a, b) => a.localeCompare(b)),
			occurrences: entry.occurrences,
		}))
		.sort((a, b) => {
			if (b.occurrences !== a.occurrences) {
				return b.occurrences - a.occurrences;
			}
			return a.text.localeCompare(b.text);
		});
	const layers = Array.from(new Set(packages.map((entry) => entry.layer))).sort(
		(a, b) => a.localeCompare(b)
	);
	return {
		version: accumulator.version,
		date: accumulator.date,
		isBreaking: accumulator.isBreaking,
		packageCount: packages.length,
		changeCount: changes.length,
		layers,
		highlights: changes.slice(0, 3).map((entry) => entry.text),
		changes,
		packages,
	};
}

function buildDataset(): ChangelogDataset {
	const config = resolveChangelogConfig();
	const key = changelogConfigToCacheKey(config);
	const generated = buildGeneratedDataset(config, key);
	if (generated) {
		return generated;
	}
	const releases = parseChangelogReleases(config);
	const map = new Map<string, ReleaseAccumulator>();
	for (const release of releases) {
		const accumulator = upsertReleaseAccumulator(map, release);
		addPackageChanges(accumulator, release);
	}

	const details = Array.from(map.values())
		.sort(sortReleaseKeys)
		.map(convertAccumulatorToDetail);
	const detailMap = new Map(details.map((entry) => [entry.version, entry]));
	const summaries = details.map((entry) => ({
		version: entry.version,
		date: entry.date,
		isBreaking: entry.isBreaking,
		packageCount: entry.packageCount,
		changeCount: entry.changeCount,
		layers: entry.layers,
		highlights: entry.highlights,
	}));

	const manifest: ChangelogManifest = {
		generatedAt: new Date().toISOString(),
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
	};

	const legacyEntries: ChangelogEntry[] = details.map((entry) => ({
		version: entry.version,
		date: entry.date,
		isBreaking: entry.isBreaking,
		packages: entry.packages.map((pkg) => ({
			name: pkg.name,
			changes: pkg.changes.map((change) => `- ${change}`),
		})),
	}));
	return {
		key,
		manifest,
		detailsByVersion: detailMap,
		legacyEntries,
	};
}

function buildGeneratedDataset(
	config: ReturnType<typeof resolveChangelogConfig>,
	key: string
): ChangelogDataset | null {
	if (!fs.existsSync(config.generatedManifestPath)) {
		return null;
	}

	try {
		const manifest = GeneratedReleaseManifestSchema.parse(
			JSON.parse(fs.readFileSync(config.generatedManifestPath, 'utf-8'))
		);
		const details = manifest.releases.map((release) => {
			const packages = release.packages.map((pkg) => ({
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
			}));
			const changes = [
				{
					text: release.summary,
					packages: release.packages.map((pkg) => pkg.name),
					layers: Array.from(
						new Set(release.packages.map((pkg) => inferLayer(pkg.name)))
					),
					occurrences: release.packages.length || 1,
				},
				...release.upgradeSteps.map((step) => ({
					text: step.summary,
					packages: step.packages ?? release.packages.map((pkg) => pkg.name),
					layers: Array.from(
						new Set(
							(step.packages ?? release.packages.map((pkg) => pkg.name)).map(
								inferLayer
							)
						)
					),
					occurrences: 1,
				})),
			];
			const layers = Array.from(new Set(packages.map((pkg) => pkg.layer))).sort(
				(a, b) => a.localeCompare(b)
			);

			return {
				version: release.version,
				date: release.date,
				isBreaking: release.isBreaking,
				packageCount: packages.length,
				changeCount: changes.length,
				layers,
				highlights: [release.summary, ...release.deprecations].slice(0, 3),
				changes,
				packages,
			};
		});
		const detailMap = new Map(details.map((entry) => [entry.version, entry]));
		const summaries = details.map((entry) => ({
			version: entry.version,
			date: entry.date,
			isBreaking: entry.isBreaking,
			packageCount: entry.packageCount,
			changeCount: entry.changeCount,
			layers: entry.layers,
			highlights: entry.highlights,
		}));

		return {
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
			detailsByVersion: detailMap,
			legacyEntries: details.map((entry) => ({
				version: entry.version,
				date: entry.date,
				isBreaking: entry.isBreaking,
				packages: entry.packages.map((pkg) => ({
					name: pkg.name,
					changes: pkg.changes.map((change) => `- ${change}`),
				})),
			})),
		};
	} catch {
		return null;
	}
}

function inferLayer(packageName: string): string {
	if (packageName.startsWith('@contractspec/app.')) {
		return 'apps';
	}
	if (packageName.startsWith('@contractspec/bundle.')) {
		return 'bundles';
	}
	if (packageName.startsWith('@contractspec/module.')) {
		return 'modules';
	}
	if (packageName.startsWith('@contractspec/integration.')) {
		return 'integrations';
	}
	if (packageName.startsWith('@contractspec/lib.')) {
		return 'libs';
	}
	return 'other';
}

function getDataset(): ChangelogDataset {
	const config = resolveChangelogConfig();
	const key = changelogConfigToCacheKey(config);
	if (cachedDataset && cachedDataset.key === key) {
		return cachedDataset;
	}
	cachedDataset = buildDataset();
	return cachedDataset;
}

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
