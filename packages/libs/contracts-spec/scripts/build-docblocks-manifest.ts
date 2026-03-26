import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { buildPackageDocManifest } from '../src/docs/manifest-builder';

const pkgRoot = path.resolve(import.meta.dir, '..');
const srcRoot = path.join(pkgRoot, 'src');
const outFile = path.join(srcRoot, 'docs', 'docblocks.manifest.generated.ts');
const packageName = '@contractspec/lib.contracts-spec';

function quote(value: string): string {
	return `'${JSON.stringify(value).slice(1, -1).replaceAll("'", "\\'")}'`;
}

function renderLiteral(value: unknown, indentLevel = 0): string {
	const indent = '\t'.repeat(indentLevel);
	const nestedIndent = '\t'.repeat(indentLevel + 1);

	if (typeof value === 'string') {
		return quote(value);
	}

	if (
		typeof value === 'number' ||
		typeof value === 'boolean' ||
		value == null
	) {
		return String(value);
	}

	if (Array.isArray(value)) {
		if (value.length === 0) {
			return '[]';
		}
		return `[
${value.map((item) => `${nestedIndent}${renderLiteral(item, indentLevel + 1)}`).join(',\n')}
${indent}]`;
	}

	const entries = Object.entries(value as Record<string, unknown>);
	if (entries.length === 0) {
		return '{}';
	}

	return `{
${entries
	.map(([key, item]) => {
		const renderedKey = /^[A-Za-z_$][\w$]*$/.test(key) ? key : quote(key);
		return `${nestedIndent}${renderedKey}: ${renderLiteral(item, indentLevel + 1)}`;
	})
	.join(',\n')}
${indent}}`;
}

function renderManifest(
	manifest: ReturnType<typeof buildPackageDocManifest>
): string {
	const renderedEntries = manifest.blocks
		.map((entry) =>
			[
				'\t\t{',
				`\t\t\tid: ${quote(entry.id)},`,
				`\t\t\texportName: ${quote(entry.exportName)},`,
				`\t\t\tsourceModule: ${quote(entry.sourceModule)},`,
				`\t\t\tblock: ${renderLiteral(entry.block, 3)},`,
				'\t\t},',
			].join('\n')
		)
		.join('\n');

	return [
		"import type { PackageDocManifest } from './manifest';",
		'',
		'export const contractsSpecDocManifest = {',
		`\tpackageName: ${quote(manifest.packageName)},`,
		`\tgeneratedAt: ${quote(manifest.generatedAt)},`,
		'\tblocks: [',
		renderedEntries,
		'\t],',
		'} satisfies PackageDocManifest;',
		'',
	].join('\n');
}

async function main(): Promise<void> {
	const manifest = buildPackageDocManifest({
		packageName,
		srcRoot,
	});

	fs.writeFileSync(outFile, renderManifest(manifest), 'utf8');
	const formatResult = spawnSync('biome', ['check', '--write', outFile], {
		cwd: pkgRoot,
		stdio: 'inherit',
	});
	if (formatResult.status !== 0) {
		throw new Error(`Failed to format ${outFile} with biome.`);
	}
	console.log(
		`docs:manifest wrote ${path.relative(pkgRoot, outFile)} with ${manifest.blocks.length} DocBlocks`
	);
}

await main();
