import {
	comparePwaVersions,
	getLatestPwaRelease,
	type PwaAppManifestSpec,
	type PwaRelease,
	type PwaUpdateCheckInputValue,
	type PwaUpdateCheckOutputValue,
	type PwaUpdatePolicy,
} from '@contractspec/lib.contracts-spec/pwa';
import { contractFail } from '@contractspec/lib.contracts-spec/results';

export type PwaManifestResolver = (
	appId: string
) => PwaAppManifestSpec | Promise<PwaAppManifestSpec | undefined> | undefined;

export interface PwaUpdateCheckOptions {
	now?: () => Date;
}

export function resolvePwaUpdatePolicy(
	manifest: PwaAppManifestSpec,
	release?: PwaRelease
): PwaUpdatePolicy {
	return {
		...manifest.defaultUpdatePolicy,
		...release?.updatePolicy,
	};
}

export function evaluatePwaUpdateCheck(
	manifest: PwaAppManifestSpec,
	input: PwaUpdateCheckInputValue,
	options?: PwaUpdateCheckOptions
): PwaUpdateCheckOutputValue {
	const latest = getLatestPwaRelease(manifest) ?? {
		version: manifest.currentRelease,
	};
	const policy = resolvePwaUpdatePolicy(manifest, latest);
	const updateAvailable =
		comparePwaVersions(latest.version, input.currentVersion) > 0;
	const belowMinimum =
		policy.minSupportedVersion != null &&
		comparePwaVersions(input.currentVersion, policy.minSupportedVersion) < 0;
	const required =
		updateAvailable && (policy.mode === 'required' || belowMinimum);
	const disabled = policy.mode === 'disabled';

	return {
		appId: manifest.meta.appId,
		currentVersion: input.currentVersion,
		latestVersion: latest.version,
		updateAvailable: updateAvailable && !disabled,
		update:
			disabled || !updateAvailable
				? 'none'
				: required
					? 'required'
					: 'optional',
		blocking: required,
		policy,
		...(updateAvailable && !disabled ? { release: latest } : {}),
		checkedAt: (options?.now?.() ?? new Date()).toISOString(),
		...(policy.message ? { message: policy.message } : {}),
	};
}

export function createPwaUpdateCheckHandler(
	resolveManifest: PwaManifestResolver,
	options?: PwaUpdateCheckOptions
) {
	return async (input: PwaUpdateCheckInputValue) => {
		const manifest = await resolveManifest(input.appId);
		if (!manifest) {
			return contractFail(
				'PWA_APP_NOT_FOUND',
				{ appId: input.appId },
				{
					status: 404,
					title: 'PWA app not found',
					detail: `No PWA manifest exists for app "${input.appId}".`,
				}
			);
		}
		return evaluatePwaUpdateCheck(manifest, input, options);
	};
}
