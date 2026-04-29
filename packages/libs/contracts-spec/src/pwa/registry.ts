import { compareVersions } from 'compare-versions';
import { SpecContractRegistry } from '../registry';
import type { PwaAppManifestSpec, PwaRelease } from './types';

export class PwaAppManifestRegistry extends SpecContractRegistry<
	'pwa-app',
	PwaAppManifestSpec
> {
	public constructor(items?: PwaAppManifestSpec[]) {
		super('pwa-app', items);
	}
}

export function getLatestPwaRelease(
	manifest: PwaAppManifestSpec
): PwaRelease | undefined {
	return [...manifest.releases].sort((left, right) =>
		comparePwaVersions(right.version, left.version)
	)[0];
}

export function comparePwaVersions(left: string, right: string): number {
	return compareVersions(left, right);
}
