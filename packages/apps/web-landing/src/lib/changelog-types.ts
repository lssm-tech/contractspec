export interface ChangelogAudienceDetail {
	kind: string;
	summary: string;
	affectedPackages: string[];
	affectedRuntimes: string[];
	affectedFrameworks: string[];
}

export interface ChangelogMigrationInstruction {
	id: string;
	title: string;
	summary: string;
	required: boolean;
	when?: string;
	steps: string[];
}

export interface ChangelogUpgradeStep {
	id: string;
	title: string;
	summary: string;
	level: 'auto' | 'assisted' | 'manual';
	instructions: string[];
	packages: string[];
}

export interface ChangelogChangeDetail {
	text: string;
	packages: string[];
	layers: string[];
	occurrences: number;
}

export interface ChangelogPackageDetail {
	name: string;
	packageSlug: string;
	layer: string;
	changes: string[];
}

export interface ChangelogReleaseEntryDetail {
	slug: string;
	summary: string;
	isBreaking: boolean;
	packages: ChangelogPackageDetail[];
	audiences: ChangelogAudienceDetail[];
	deprecations: string[];
	migrationInstructions: ChangelogMigrationInstruction[];
	upgradeSteps: ChangelogUpgradeStep[];
}

export interface ChangelogReleaseSummary {
	version: string;
	date: string;
	isBreaking: boolean;
	packageCount: number;
	changeCount: number;
	layers: string[];
	highlights: string[];
	releaseCount: number;
}

export interface ChangelogReleaseDetail extends ChangelogReleaseSummary {
	changes: ChangelogChangeDetail[];
	packages: ChangelogPackageDetail[];
	audiences: ChangelogAudienceDetail[];
	deprecations: string[];
	migrationInstructions: ChangelogMigrationInstruction[];
	upgradeSteps: ChangelogUpgradeStep[];
	releases: ChangelogReleaseEntryDetail[];
}

export interface ChangelogManifest {
	generatedAt: string;
	totalReleases: number;
	availableLayers: string[];
	config: {
		includeLayers: string[];
		excludeLayers: string[];
		defaultPageSize: number;
	};
	releases: ChangelogReleaseSummary[];
}

export interface ChangelogEntry {
	version: string;
	date: string;
	isBreaking: boolean;
	packages: {
		name: string;
		changes: string[];
	}[];
}
