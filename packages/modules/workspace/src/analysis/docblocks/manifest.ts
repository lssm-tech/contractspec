import fs from 'node:fs';
import path from 'node:path';
import type { PackageDocManifest } from '@contractspec/lib.contracts-spec/docs';
import { extractModuleDocData } from './evaluator';

function shouldIgnoreSourceFile(filePath: string): boolean {
	return (
		!/\.[cm]?[jt]sx?$/.test(filePath) ||
		filePath.endsWith('.d.ts') ||
		filePath.endsWith('.test.ts') ||
		filePath.endsWith('.generated.ts') ||
		filePath.includes(`${path.sep}dist${path.sep}`)
	);
}

function listSourceFiles(srcRoot: string): string[] {
	return fs
		.readdirSync(srcRoot, { withFileTypes: true })
		.flatMap((entry) => {
			const absolutePath = path.join(srcRoot, entry.name);
			if (entry.isDirectory()) {
				return listSourceFiles(absolutePath);
			}
			return shouldIgnoreSourceFile(absolutePath) ? [] : [absolutePath];
		})
		.sort((left, right) => left.localeCompare(right));
}

function toSourceModule(srcRoot: string, filePath: string): string {
	return path
		.relative(srcRoot, filePath)
		.replace(/\\/g, '/')
		.replace(/\.[cm]?[jt]sx?$/, '');
}

export function buildPackageDocManifest(options: {
	packageName: string;
	srcRoot: string;
}): PackageDocManifest {
	const { packageName, srcRoot } = options;
	const allSourceFiles = listSourceFiles(srcRoot);

	for (const filePath of allSourceFiles) {
		if (filePath.endsWith('.docblock.ts')) {
			throw new Error(
				`Standalone DocBlock sources are not allowed: ${filePath}`
			);
		}

		if (filePath.includes(`${path.sep}docs${path.sep}tech${path.sep}`)) {
			throw new Error(`docs/tech source files are not allowed: ${filePath}`);
		}
	}

	const entries: PackageDocManifest['blocks'] = [];
	const seenIds = new Map<string, string>();
	const seenRoutes = new Map<string, string>();
	const docRefs = new Map<string, string[]>();

	for (const filePath of allSourceFiles) {
		const sourceText = fs.readFileSync(filePath, 'utf8');
		const sourceModule = toSourceModule(srcRoot, filePath);
		const moduleData = extractModuleDocData(sourceText, filePath, sourceModule);

		for (const entry of moduleData.entries) {
			const sourceRef = `${entry.sourceModule}:${entry.exportName}`;
			const priorId = seenIds.get(entry.id);
			if (priorId) {
				throw new Error(
					`Duplicate DocBlock id ${entry.id} in ${sourceRef} and ${priorId}`
				);
			}
			seenIds.set(entry.id, sourceRef);

			if (entry.block.route) {
				const priorRoute = seenRoutes.get(entry.block.route);
				if (priorRoute) {
					throw new Error(
						`Duplicate DocBlock route ${entry.block.route} in ${sourceRef} and ${priorRoute}`
					);
				}
				seenRoutes.set(entry.block.route, sourceRef);
			}

			entries.push(entry);
		}

		if (moduleData.docRefs.length > 0) {
			docRefs.set(sourceModule, moduleData.docRefs);
		}
	}

	for (const [sourceModule, refs] of docRefs) {
		for (const ref of refs) {
			if (!seenIds.has(ref)) {
				throw new Error(
					`Missing DocBlock reference ${ref} from ${sourceModule}`
				);
			}
		}
	}

	entries.sort((left, right) => left.id.localeCompare(right.id));

	return {
		packageName,
		generatedAt: new Date().toISOString(),
		blocks: entries,
	};
}
