import { describe, expect, test } from 'bun:test';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { dirname, relative, resolve } from 'path';
import { fileURLToPath } from 'url';

const srcDir = dirname(fileURLToPath(import.meta.url));

const runtimeReExportPattern =
	/export\s+(?:\*|\{(?!\s*type\b)[^}]+\})\s+from\s+['"](\.[^'"]+)['"]/g;
const nodeCryptoImportPattern =
	/import\s+(?!type\b)[\s\S]*?\s+from\s+['"](?:node:)?crypto['"]|(?:require|import)\(\s*['"](?:node:)?crypto['"]\s*\)/;
const allowedStaticCryptoImportPattern =
	/^control-plane\/skills\/(?:signer|verifier)\.ts$|^control-plane\/skills\.test\.ts$/;

function collectRuntimeReExports(entry: string, seen = new Set<string>()) {
	if (seen.has(entry)) {
		return seen;
	}
	seen.add(entry);

	const source = readFileSync(entry, 'utf8');
	for (const match of source.matchAll(runtimeReExportPattern)) {
		const specifier = match[1];
		if (!specifier) {
			continue;
		}
		const resolved = resolveRelativeModule(entry, specifier);
		if (resolved) {
			collectRuntimeReExports(resolved, seen);
		}
	}

	return seen;
}

function resolveRelativeModule(importer: string, specifier: string) {
	const base = resolve(dirname(importer), specifier);
	const candidates = [`${base}.ts`, resolve(base, 'index.ts')];
	return candidates.find((candidate) => existsSync(candidate));
}

function listSourceFiles(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = resolve(directory, entry.name);
		if (entry.isDirectory()) {
			return listSourceFiles(path);
		}
		return entry.isFile() && path.endsWith('.ts') ? [path] : [];
	});
}

describe('root browser surface', () => {
	test('does not statically re-export Node crypto modules', () => {
		const reachableFiles = [
			...collectRuntimeReExports(resolve(srcDir, 'index.ts')),
		];
		const cryptoBearingFiles = reachableFiles.filter((file) =>
			nodeCryptoImportPattern.test(readFileSync(file, 'utf8'))
		);

		expect(cryptoBearingFiles.map((file) => relative(srcDir, file))).toEqual(
			[]
		);
	});

	test('keeps static Node crypto imports isolated to skill signing modules', () => {
		const cryptoBearingFiles = listSourceFiles(srcDir)
			.map((file) => relative(srcDir, file))
			.filter((file) =>
				nodeCryptoImportPattern.test(
					readFileSync(resolve(srcDir, file), 'utf8')
				)
			)
			.filter((file) => !allowedStaticCryptoImportPattern.test(file));

		expect(cryptoBearingFiles).toEqual([]);
	});
});
