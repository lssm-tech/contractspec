import { afterEach, describe, expect, it, mock } from 'bun:test';
import {
	publishPackages,
	publishPreparedPackage,
	resolveRequestedPackageNames,
} from './publish-packages.js';

afterEach(() => {
	delete process.env.CONTRACTSPEC_RELEASE_INCLUDE_MISSING;
	delete process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES;
	delete process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES_SPECIFIED;
});

describe('publishPreparedPackage', () => {
	it('self-heals fresh publishes when dist-tags lag behind npm publish', () => {
		const publishTarball = mock(() => {});
		const ensureDistTag = mock(() => '0.2.0');

		const result = publishPreparedPackage(
			{
				name: '@contractspec/lib.provider-runtime',
				version: '0.2.0',
				directory: 'packages/libs/provider-runtime',
				tarballPath: '/tmp/provider-runtime.tgz',
			},
			{
				dryRun: false,
				npmTag: 'latest',
				npmEnv: {},
				npmViewVersionExists: () => false,
				publishTarball,
				ensureDistTag,
			}
		);

		expect(publishTarball).toHaveBeenCalledTimes(1);
		expect(ensureDistTag).toHaveBeenCalledWith(
			'@contractspec/lib.provider-runtime',
			'0.2.0',
			'latest',
			{}
		);
		expect(result).toMatchObject({
			name: '@contractspec/lib.provider-runtime',
			version: '0.2.0',
			distTag: 'latest',
			status: 'published',
			verifiedTag: '0.2.0',
		});
	});
});

describe('publishPackages', () => {
	it('treats an explicit empty selection as a successful no-op', async () => {
		process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES = '';
		process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES_SPECIFIED = '1';
		process.env.CONTRACTSPEC_RELEASE_INCLUDE_MISSING = '0';

		await expect(publishPackages()).resolves.toEqual([]);
	});
});

describe('resolveRequestedPackageNames', () => {
	it('adds packages whose local version is missing from npm', () => {
		const packagesByName = new Map([
			[
				'@contractspec/lib.present',
				{
					name: '@contractspec/lib.present',
					version: '1.0.0',
				},
			],
			[
				'@contractspec/lib.selected',
				{
					name: '@contractspec/lib.selected',
					version: '1.0.0',
				},
			],
			[
				'@contractspec/lib.missing',
				{
					name: '@contractspec/lib.missing',
					version: '1.0.0',
				},
			],
		]);

		const packageNames = resolveRequestedPackageNames({
			selectedPackageNames: ['@contractspec/lib.selected'],
			packageNamesSpecified: true,
			packagesByName,
			npmTag: 'latest',
			npmEnv: {},
			npmViewVersionExists: (name) => name !== '@contractspec/lib.missing',
			log: () => {},
		});

		expect(packageNames).toEqual([
			'@contractspec/lib.selected',
			'@contractspec/lib.missing',
		]);
	});

	it('does not add missing packages for canary unless requested', () => {
		const packagesByName = new Map([
			[
				'@contractspec/lib.selected',
				{
					name: '@contractspec/lib.selected',
					version: '1.0.0',
				},
			],
			[
				'@contractspec/lib.missing',
				{
					name: '@contractspec/lib.missing',
					version: '1.0.0',
				},
			],
		]);

		const packageNames = resolveRequestedPackageNames({
			selectedPackageNames: ['@contractspec/lib.selected'],
			packageNamesSpecified: true,
			packagesByName,
			npmTag: 'canary',
			npmEnv: {},
			npmViewVersionExists: () => false,
			log: () => {},
		});

		expect(packageNames).toEqual(['@contractspec/lib.selected']);
	});

	it('can recover missing packages from an explicit empty stable selection', () => {
		const packagesByName = new Map([
			[
				'@contractspec/lib.present',
				{
					name: '@contractspec/lib.present',
					version: '1.0.0',
				},
			],
			[
				'@contractspec/lib.missing',
				{
					name: '@contractspec/lib.missing',
					version: '1.0.0',
				},
			],
		]);

		const packageNames = resolveRequestedPackageNames({
			selectedPackageNames: [],
			packageNamesSpecified: true,
			packagesByName,
			npmTag: 'latest',
			npmEnv: {},
			npmViewVersionExists: (name) => name !== '@contractspec/lib.missing',
			log: () => {},
		});

		expect(packageNames).toEqual(['@contractspec/lib.missing']);
	});
});
