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

export interface ChangelogReleaseSummary {
  version: string;
  date: string;
  isBreaking: boolean;
  packageCount: number;
  changeCount: number;
  layers: string[];
  highlights: string[];
}

export interface ChangelogReleaseDetail extends ChangelogReleaseSummary {
  changes: ChangelogChangeDetail[];
  packages: ChangelogPackageDetail[];
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
