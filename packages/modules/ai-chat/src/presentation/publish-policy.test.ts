import { describe, expect, it } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type ExportEntry = string | Record<string, string>;

const presentationRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const packageRoot = resolve(presentationRoot, '../..');
const packageJson = JSON.parse(
	readFileSync(join(packageRoot, 'package.json'), 'utf8')
) as {
	publishConfig: {
		exports: Record<string, ExportEntry>;
	};
};

const designSystemRootImportPattern =
	/(?:from\s+|import\(\s*)["']@contractspec\/lib\.design-system["']/;

function listSourceFiles(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = join(directory, entry.name);
		if (entry.isDirectory()) {
			return listSourceFiles(entryPath);
		}

		return ['.ts', '.tsx'].includes(extname(entry.name)) ? [entryPath] : [];
	});
}

describe('ai-chat presentation publish policy', () => {
	it('uses precise design-system subpaths at package boundaries', () => {
		const offenders = listSourceFiles(presentationRoot)
			.filter((file) => !file.endsWith('.test.ts'))
			.filter((file) =>
				designSystemRootImportPattern.test(readFileSync(file, 'utf8'))
			)
			.map((file) => file.replace(`${packageRoot}/`, ''));

		expect(offenders).toEqual([]);
	});

	it('does not advertise presentation entrypoints as native-compatible', () => {
		for (const subpath of ['./presentation', './presentation/components']) {
			const entry = packageJson.publishConfig.exports[subpath];
			expect(entry).toBeDefined();
			expect(entry).toHaveProperty('browser');
			expect(entry).not.toHaveProperty('ios');
			expect(entry).not.toHaveProperty('android');
			expect(entry).not.toHaveProperty('react-native');
		}
	});
});
