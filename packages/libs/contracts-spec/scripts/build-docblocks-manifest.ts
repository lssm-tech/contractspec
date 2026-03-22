import fs from 'node:fs';
import path from 'node:path';
import { buildPackageDocManifest } from '../src/docs/manifest-builder';

const pkgRoot = path.resolve(import.meta.dir, '..');
const srcRoot = path.join(pkgRoot, 'src');
const outFile = path.join(srcRoot, 'docs', 'docblocks.manifest.generated.ts');
const packageName = '@contractspec/lib.contracts-spec';

function quote(value: string): string {
	return JSON.stringify(value);
}

function renderBlock(block: unknown): string {
	const value = JSON.stringify(block, null, '\t');
	return value
		.split('\n')
		.map((line) => `\t\t\t${line}`)
		.join('\n');
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
				'\t\t\tblock: ',
				`${renderBlock(entry.block)},`,
				'\t\t},',
			].join('\n')
		)
		.join('\n');

	return [
		'import type { PackageDocManifest } from "./manifest";',
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
	console.log(
		`docs:manifest wrote ${path.relative(pkgRoot, outFile)} with ${manifest.blocks.length} DocBlocks`
	);
}

await main();
