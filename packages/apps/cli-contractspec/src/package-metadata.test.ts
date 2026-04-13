import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const packageRoot = resolve(import.meta.dir, '..');

type PackageJson = {
	bin?: Record<string, string>;
	scripts?: Record<string, string>;
};

function readPackageJson(): PackageJson {
	return JSON.parse(
		readFileSync(join(packageRoot, 'package.json'), 'utf8')
	) as PackageJson;
}

describe('package metadata', () => {
	it('declares the contractspec bin and a node shebang source entrypoint', () => {
		const packageJson = readPackageJson();
		const cliSource = readFileSync(join(packageRoot, 'src', 'cli.ts'), 'utf8');

		expect(packageJson.bin?.contractspec).toBe('./dist/node/cli.js');
		expect(cliSource.startsWith('#!/usr/bin/env node')).toBe(true);
	});

	it('keeps release build scripts aligned with the published sourcemap policy', () => {
		const packageJson = readPackageJson();
		const npmIgnore = readFileSync(join(packageRoot, '.npmignore'), 'utf8');

		expect(packageJson.scripts?.['build:bun']).not.toContain('--sourcemap');
		expect(packageJson.scripts?.['build:node']).not.toContain('--sourcemap');
		expect(npmIgnore).toContain('*.map');
	});
});
