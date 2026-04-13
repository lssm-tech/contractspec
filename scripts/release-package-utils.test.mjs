import { afterEach, describe, expect, it } from 'bun:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
	discoverPublishablePackages,
	getPackageNameSelection,
	getPreparationPackageNames,
} from './release-package-utils.js';

const tempDirs = [];

afterEach(() => {
	delete process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES;
	delete process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES_SPECIFIED;
	while (tempDirs.length > 0) {
		fs.rmSync(tempDirs.pop(), { force: true, recursive: true });
	}
});

function createTempDir(prefix) {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
	tempDirs.push(dir);
	return dir;
}

function writeJson(filePath, value) {
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

describe('discoverPublishablePackages', () => {
	it('records internal workspace dependencies from runtime sections only', () => {
		const repoRoot = createTempDir('contractspec-release-utils-');

		writeJson(path.join(repoRoot, 'package.json'), {
			name: 'workspace-root',
			private: true,
		});
		writeJson(path.join(repoRoot, 'packages/apps/cli/package.json'), {
			name: '@contractspec/app.cli-contractspec',
			version: '1.0.0',
			dependencies: {
				'@contractspec/lib.alpha': 'workspace:*',
			},
			optionalDependencies: {
				'@contractspec/lib.optional': 'workspace:*',
			},
			peerDependencies: {
				'@contractspec/lib.peer': 'workspace:*',
			},
			devDependencies: {
				'@contractspec/lib.dev-only': 'workspace:*',
			},
		});
		writeJson(
			path.join(repoRoot, 'packages/apps-registry/contractspec/package.json'),
			{
				name: 'contractspec',
				version: '1.0.0',
				dependencies: {
					'@contractspec/app.cli-contractspec': 'workspace:*',
				},
			}
		);
		writeJson(path.join(repoRoot, 'packages/libs/alpha/package.json'), {
			name: '@contractspec/lib.alpha',
			version: '1.0.0',
		});
		writeJson(path.join(repoRoot, 'packages/libs/optional/package.json'), {
			name: '@contractspec/lib.optional',
			version: '1.0.0',
		});
		writeJson(path.join(repoRoot, 'packages/libs/peer/package.json'), {
			name: '@contractspec/lib.peer',
			version: '1.0.0',
		});
		writeJson(path.join(repoRoot, 'packages/libs/dev-only/package.json'), {
			name: '@contractspec/lib.dev-only',
			version: '1.0.0',
		});

		const packages = discoverPublishablePackages(repoRoot, {
			log: () => {},
			warn: () => {},
		});
		const cliPackage = packages.find(
			(pkg) => pkg.name === '@contractspec/app.cli-contractspec'
		);

		expect(cliPackage?.internalWorkspaceDependencies).toEqual([
			'@contractspec/lib.alpha',
			'@contractspec/lib.optional',
			'@contractspec/lib.peer',
		]);
	});
});

describe('getPreparationPackageNames', () => {
	it('expands transitive internal workspace dependencies for requested packages', () => {
		const packages = [
			{
				name: '@contractspec/lib.alpha',
				internalWorkspaceDependencies: ['@contractspec/lib.beta'],
			},
			{
				name: '@contractspec/lib.beta',
				internalWorkspaceDependencies: ['@contractspec/lib.gamma'],
			},
			{
				name: '@contractspec/lib.gamma',
				internalWorkspaceDependencies: [],
			},
		];

		expect(
			getPreparationPackageNames(['@contractspec/lib.alpha'], packages)
		).toEqual([
			'@contractspec/lib.alpha',
			'@contractspec/lib.beta',
			'@contractspec/lib.gamma',
		]);
	});

	it('adds CLI smoke roots and de-duplicates their full closure', () => {
		const packages = [
			{
				name: '@contractspec/app.cli-contractspec',
				internalWorkspaceDependencies: ['@contractspec/lib.alpha'],
			},
			{
				name: 'contractspec',
				internalWorkspaceDependencies: ['@contractspec/app.cli-contractspec'],
			},
			{
				name: '@contractspec/lib.alpha',
				internalWorkspaceDependencies: ['@contractspec/lib.beta'],
			},
			{
				name: '@contractspec/lib.beta',
				internalWorkspaceDependencies: [],
			},
		];

		expect(
			getPreparationPackageNames(
				['@contractspec/app.cli-contractspec'],
				packages
			)
		).toEqual([
			'@contractspec/app.cli-contractspec',
			'contractspec',
			'@contractspec/lib.alpha',
			'@contractspec/lib.beta',
		]);
	});

	it('keeps unknown requested packages while expanding known ones', () => {
		const packages = [
			{
				name: '@contractspec/lib.alpha',
				internalWorkspaceDependencies: ['@contractspec/lib.beta'],
			},
			{
				name: '@contractspec/lib.beta',
				internalWorkspaceDependencies: [],
			},
		];

		expect(
			getPreparationPackageNames(
				['@contractspec/lib.alpha', '@contractspec/lib.missing'],
				packages
			)
		).toEqual([
			'@contractspec/lib.alpha',
			'@contractspec/lib.missing',
			'@contractspec/lib.beta',
		]);
	});
});

describe('getPackageNameSelection', () => {
	it('treats an empty env override as unspecified', () => {
		process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES = '';

		expect(getPackageNameSelection()).toEqual({
			packageNames: [],
			packageNamesSpecified: false,
		});
	});

	it('treats a whitespace-only env override as unspecified', () => {
		process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES = '   ';

		expect(getPackageNameSelection()).toEqual({
			packageNames: [],
			packageNamesSpecified: false,
		});
	});

	it('keeps a non-empty env override as an explicit selection', () => {
		process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES =
			'contractspec,@contractspec/app.cli-contractspec';

		expect(getPackageNameSelection()).toEqual({
			packageNames: ['contractspec', '@contractspec/app.cli-contractspec'],
			packageNamesSpecified: true,
		});
	});

	it('keeps an explicit empty options override as a no-op selection', () => {
		process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES = 'contractspec';

		expect(
			getPackageNameSelection({
				packageNamesSpecified: true,
				packageNames: [],
			})
		).toEqual({
			packageNames: [],
			packageNamesSpecified: true,
		});
	});

	it('treats an explicit empty env override as a no-op selection', () => {
		process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES = '';
		process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES_SPECIFIED = '1';

		expect(getPackageNameSelection()).toEqual({
			packageNames: [],
			packageNamesSpecified: true,
		});
	});

	it('treats an explicit selection flag without names as a no-op selection', () => {
		process.env.CONTRACTSPEC_RELEASE_PACKAGE_NAMES_SPECIFIED = 'true';

		expect(getPackageNameSelection()).toEqual({
			packageNames: [],
			packageNamesSpecified: true,
		});
	});
});
