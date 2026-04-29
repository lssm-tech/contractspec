import { afterEach, describe, expect, it, mock } from 'bun:test';
import {
	ensureDistTag,
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
		const ensureDistTag = mock(() => ({
			distTagVerification: 'deferred-to-manifest',
		}));

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
			distTagVerification: 'deferred-to-manifest',
		});
		expect(result).not.toHaveProperty('verifiedTag');
	});
});

describe('ensureDistTag', () => {
	it('returns immediate evidence when the registry tag is already current', () => {
		const calls = [];
		const logs = [];
		const waits = [];

		const result = ensureDistTag(
			'@contractspec/lib.provider-runtime',
			'0.2.0',
			'latest',
			{},
			{
				runCommand: (command, args, options) => {
					calls.push({ command, args, options });
					return {
						status: 0,
						stdout: '{"latest":"0.2.0"}\n',
						stderr: '',
					};
				},
				log: (message) => logs.push(message),
				sleep: (delayMs) => waits.push(delayMs),
			}
		);

		expect(result).toEqual({
			verifiedTag: '0.2.0',
			distTagVerification: 'immediate',
		});
		expect(calls).toHaveLength(1);
		expect(calls[0].args).toEqual([
			'view',
			'@contractspec/lib.provider-runtime',
			'dist-tags',
			'--json',
		]);
		expect(logs).toEqual([]);
		expect(waits).toEqual([]);
	});

	it('updates stale tags without post-add polling or sleep', () => {
		const calls = [];
		const logs = [];
		const waits = [];

		const result = ensureDistTag(
			'@contractspec/lib.provider-runtime',
			'0.2.0',
			'latest',
			{},
			{
				runCommand: (command, args, options) => {
					calls.push({ command, args, options });
					if (args[0] === 'view') {
						return {
							status: 0,
							stdout: '{"latest":"0.1.0"}\n',
							stderr: '',
						};
					}
					return { status: 0, stdout: '', stderr: '' };
				},
				log: (message) => logs.push(message),
				sleep: (delayMs) => waits.push(delayMs),
			}
		);

		expect(result).toEqual({
			distTagVerification: 'deferred-to-manifest',
		});
		expect(calls.map((call) => call.args[0])).toEqual(['view', 'dist-tag']);
		expect(calls[1].args).toEqual([
			'dist-tag',
			'add',
			'@contractspec/lib.provider-runtime@0.2.0',
			'latest',
		]);
		expect(calls[1].options).toMatchObject({
			capture: true,
			echoCaptured: true,
		});
		expect(logs).toEqual([
			'[publish] Updating dist-tag latest -> @contractspec/lib.provider-runtime@0.2.0 (was 0.1.0)',
		]);
		expect(waits).toEqual([]);
	});

	it('retries transient read and add failures before succeeding', () => {
		const calls = [];
		const waits = [];
		let addAttempt = 0;
		let viewAttempt = 0;

		const result = ensureDistTag(
			'@contractspec/lib.provider-runtime',
			'0.2.0',
			'latest',
			{},
			{
				retryCount: 3,
				retryDelayMs: 25,
				runCommand: (command, args, options) => {
					calls.push({ command, args, options });
					if (args[0] === 'view') {
						viewAttempt += 1;
						if (viewAttempt === 1) {
							return {
								status: 1,
								stdout: '',
								stderr: 'npm error code ECONNRESET',
							};
						}
						return {
							status: 0,
							stdout: '{"latest":"0.1.0"}\n',
							stderr: '',
						};
					}

					addAttempt += 1;
					if (addAttempt === 1) {
						throw new Error(
							'Command failed (npm dist-tag add): npm error code ECONNRESET'
						);
					}
					return { status: 0, stdout: '', stderr: '' };
				},
				log: () => {},
				sleep: (delayMs) => waits.push(delayMs),
			}
		);

		expect(result).toEqual({
			distTagVerification: 'deferred-to-manifest',
		});
		expect(calls.map((call) => call.args[0])).toEqual([
			'view',
			'view',
			'dist-tag',
			'view',
			'dist-tag',
		]);
		expect(waits).toEqual([25, 50]);
	});

	it('does not retry non-retryable dist-tag add failures', () => {
		const calls = [];

		expect(() =>
			ensureDistTag(
				'@contractspec/lib.provider-runtime',
				'0.2.0',
				'latest',
				{},
				{
					retryCount: 3,
					retryDelayMs: 25,
					runCommand: (command, args, options) => {
						calls.push({ command, args, options });
						if (args[0] === 'view') {
							return {
								status: 0,
								stdout: '{"latest":"0.1.0"}\n',
								stderr: '',
							};
						}
						throw new Error('Command failed (npm dist-tag add): forbidden');
					},
					log: () => {},
					sleep: () => {},
				}
			)
		).toThrow('forbidden');

		expect(calls.map((call) => call.args[0])).toEqual(['view', 'dist-tag']);
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
