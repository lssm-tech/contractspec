import type { DocBlock } from '../docs/types';
import type { OwnerShipMeta } from '../ownership';

export type PwaUpdateMode = 'optional' | 'required' | 'disabled';
export type PwaUpdateAvailability = 'none' | 'optional' | 'required';

export interface PwaUpdatePolicy {
	mode: PwaUpdateMode;
	checkIntervalMs?: number;
	gracePeriodMs?: number;
	message?: string;
	minSupportedVersion?: string;
}

export interface PwaRelease {
	version: string;
	buildId?: string;
	releasedAt?: string | Date;
	updatePolicy?: Partial<PwaUpdatePolicy>;
	notes?: string;
}

export interface PwaAppManifestMeta extends OwnerShipMeta {
	appId: string;
}

export interface PwaAppManifestSpec {
	meta: PwaAppManifestMeta;
	currentRelease: string;
	defaultUpdatePolicy: PwaUpdatePolicy;
	releases: PwaRelease[];
	offline?: {
		supported: boolean;
		cacheName?: string;
	};
}

export interface PwaUpdateCheckInputValue {
	appId: string;
	currentVersion: string;
	currentBuildId?: string;
	platform?: string;
	lastCheckedAt?: string | Date;
}

export interface PwaUpdateCheckOutputValue {
	appId: string;
	currentVersion: string;
	latestVersion: string;
	updateAvailable: boolean;
	update: PwaUpdateAvailability;
	blocking: boolean;
	policy: PwaUpdatePolicy;
	release?: PwaRelease;
	checkedAt: string | Date;
	message?: string;
}

export const definePwaAppManifest = (
	spec: PwaAppManifestSpec
): PwaAppManifestSpec => spec;

export const tech_contracts_pwa_updates_DocBlocks: DocBlock[] = [
	{
		id: 'docs.tech.contracts.pwa-updates',
		title: 'PWA update management',
		summary:
			'Configure frontend update checks with app defaults and release overrides.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/tech/contracts/pwa-updates',
		tags: ['tech', 'contracts', 'pwa', 'updates'],
		body: `# PWA update management

PWA manifests describe the latest frontend release and the policy a runtime should apply when a browser is running an older version.

Use \`defaultUpdatePolicy\` for application-wide behavior and \`release.updatePolicy\` when a release needs a stricter or looser policy. Host applications still own service worker registration and activation; ContractSpec standardizes the API contract, decision state, and update prompt behavior.
`,
	},
];
