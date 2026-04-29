import { describe, expect, it } from 'bun:test';
import type { PwaAppManifestSpec } from '@contractspec/lib.contracts-spec/pwa';
import {
	createPwaUpdateCheckHandler,
	evaluatePwaUpdateCheck,
	resolvePwaUpdatePolicy,
} from './pwa-update';

const manifest: PwaAppManifestSpec = {
	meta: {
		key: 'customer.portal',
		appId: 'portal',
		version: '1.0.0',
		description: 'Customer portal PWA.',
		owners: ['platform.web'],
		tags: ['pwa'],
		stability: 'beta',
	},
	currentRelease: '1.2.0',
	defaultUpdatePolicy: {
		mode: 'optional',
		checkIntervalMs: 60_000,
		message: 'A new version is available.',
	},
	releases: [
		{ version: '1.0.0' },
		{ version: '1.2.0', updatePolicy: { mode: 'required' } },
	],
};

const now = () => new Date('2026-04-29T00:00:00.000Z');

describe('PWA update server helpers', () => {
	it('uses release overrides over app defaults', () => {
		const policy = resolvePwaUpdatePolicy(manifest, manifest.releases[1]);

		expect(policy).toEqual({
			mode: 'required',
			checkIntervalMs: 60_000,
			message: 'A new version is available.',
		});
	});

	it('returns a required blocking update when the release overrides policy', () => {
		const output = evaluatePwaUpdateCheck(
			manifest,
			{ appId: 'portal', currentVersion: '1.0.0' },
			{ now }
		);

		expect(output).toMatchObject({
			updateAvailable: true,
			update: 'required',
			blocking: true,
			latestVersion: '1.2.0',
			checkedAt: '2026-04-29T00:00:00.000Z',
		});
	});

	it('returns no update when the current version is current', () => {
		const output = evaluatePwaUpdateCheck(
			manifest,
			{ appId: 'portal', currentVersion: '1.2.0' },
			{ now }
		);

		expect(output.updateAvailable).toBe(false);
		expect(output.update).toBe('none');
		expect(output.blocking).toBe(false);
	});

	it('returns contract failure when a manifest cannot be resolved', async () => {
		const handler = createPwaUpdateCheckHandler(() => undefined, { now });
		const result = await handler({ appId: 'missing', currentVersion: '1.0.0' });

		expect(result).toMatchObject({
			ok: false,
			code: 'PWA_APP_NOT_FOUND',
		});
	});
});
