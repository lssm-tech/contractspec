import { afterEach, describe, expect, it, mock } from 'bun:test';
import { publishPackages, publishPreparedPackage } from './publish-packages.js';

afterEach(() => {
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

		await expect(publishPackages()).resolves.toEqual([]);
	});
});
