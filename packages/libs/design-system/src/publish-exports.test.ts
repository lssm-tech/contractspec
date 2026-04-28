import { describe, expect, it } from 'bun:test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type ExportEntry = string | Record<string, string>;

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(
	readFileSync(join(packageRoot, 'package.json'), 'utf8')
) as {
	publishConfig: {
		exports: Record<string, ExportEntry>;
	};
};

const relativeImportPattern =
	/\b(?:import|export)\s+(?:[^'"]*?from\s*)?["'](\.{1,2}\/[^"']+)["']|import\(\s*["'](\.{1,2}\/[^"']+)["']\s*\)/g;

function resolveExport(subpath: string, conditions: string[]): string {
	const entry = packageJson.publishConfig.exports[subpath];
	if (typeof entry === 'string') {
		return entry;
	}

	if (!entry) {
		throw new Error(`Missing publish export ${subpath}`);
	}

	const active = new Set(conditions);
	for (const [condition, target] of Object.entries(entry)) {
		if (condition === 'types' && !active.has('types')) {
			continue;
		}

		if (condition === 'default' || active.has(condition)) {
			return target;
		}
	}

	throw new Error(`No matching publish export for ${subpath}`);
}

function listJsFiles(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = join(directory, entry.name);
		if (entry.isDirectory()) {
			return listJsFiles(entryPath);
		}

		return entry.name.endsWith('.js') ? [entryPath] : [];
	});
}

function resolveMetroRelativeImport(
	importer: string,
	specifier: string,
	platform: 'ios' | 'android'
): string | null {
	const base = resolve(dirname(importer), specifier);
	if (extname(base)) {
		return existsSync(base) ? base : null;
	}

	const suffixes = [`.${platform}`, '.native', ''];
	for (const suffix of suffixes) {
		for (const candidate of [
			`${base}${suffix}.js`,
			join(base, `index${suffix}.js`),
		]) {
			if (existsSync(candidate)) {
				return candidate;
			}
		}
	}

	return null;
}

function collectNativeClosureMisses(platform: 'ios' | 'android'): string[] {
	const nativeDir = join(packageRoot, 'dist/native');
	const files = listJsFiles(nativeDir);
	const misses: string[] = [];

	for (const file of files) {
		const source = readFileSync(file, 'utf8');
		for (const match of source.matchAll(relativeImportPattern)) {
			const specifier = match[1] ?? match[2];
			if (!specifier) {
				continue;
			}

			if (!resolveMetroRelativeImport(file, specifier, platform)) {
				misses.push(`${file.replace(`${packageRoot}/`, '')} -> ${specifier}`);
			}
		}
	}

	return misses;
}

describe('design-system publish exports', () => {
	it('keeps the root export web/default only', () => {
		const rootExport = packageJson.publishConfig.exports['.'];

		expect(rootExport).not.toHaveProperty('ios');
		expect(rootExport).not.toHaveProperty('android');
		expect(rootExport).not.toHaveProperty('react-native');
		expect(resolveExport('.', ['react-native'])).toBe('./dist/index.js');
	});

	it('resolves representative public subpaths per platform condition', () => {
		expect(resolveExport('./components/atoms/Button', ['browser'])).toBe(
			'./dist/browser/components/atoms/Button.js'
		);
		expect(
			resolveExport('./components/atoms/Button', ['ios', 'react-native'])
		).toBe('./dist/native/components/atoms/Button.native.js');
		expect(
			resolveExport('./components/atoms/Link', ['android', 'react-native'])
		).toBe('./dist/native/components/atoms/Link.native.js');
		expect(resolveExport('./components/atoms/Link', ['browser'])).toBe(
			'./dist/browser/components/atoms/Link.web.js'
		);
		expect(
			resolveExport('./components/data-table/DataTable', ['react-native'])
		).toBe('./dist/native/components/data-table/DataTable.native.js');
		expect(
			resolveExport('./components/object-reference/ObjectReferenceHandler', [
				'react-native',
			])
		).toBe(
			'./dist/native/components/object-reference/ObjectReferenceHandler.native.js'
		);
		expect(resolveExport('./components/object-reference', ['browser'])).toBe(
			'./dist/browser/components/object-reference/index.js'
		);
		expect(
			resolveExport('./components/object-reference', ['react-native'])
		).toBe('./dist/native/components/object-reference/index.native.js');
		expect(
			resolveExport('./components/object-reference/actions', ['bun'])
		).toBe('./dist/components/object-reference/actions.js');
	});

	it('emits a closed native dist graph for Metro-style relative resolution', () => {
		const nativeDist = join(packageRoot, 'dist/native');
		if (!existsSync(nativeDist)) {
			return;
		}

		expect(listJsFiles(nativeDist).length).toBeGreaterThan(0);
		expect(collectNativeClosureMisses('ios')).toEqual([]);
		expect(collectNativeClosureMisses('android')).toEqual([]);
	});
});
