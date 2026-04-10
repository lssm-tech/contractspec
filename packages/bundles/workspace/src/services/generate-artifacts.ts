import path from 'path';
import type { WorkspaceAdapters } from '../ports/logger';
import { generateDocsFromSpecs } from './docs/index';
import { listSpecs } from './list';

export interface GenerateArtifactsResult {
	specsCount: number;
	docsCount: number;
}

export interface GenerateArtifactsOptions {
	scanAllSpecs?: boolean;
	specPattern?: string;
	specSearchRoot?: string;
}

export async function generateArtifacts(
	adapters: WorkspaceAdapters,
	contractsDir: string,
	generatedDir: string,
	rootPath?: string,
	options: GenerateArtifactsOptions = {}
): Promise<GenerateArtifactsResult> {
	// Check if contracts directory exists
	const contractsDirExists = await adapters.fs.exists(contractsDir);
	if (!contractsDirExists) {
		// Fallback logic
	}

	const searchPattern = options.scanAllSpecs
		? options.specPattern
		: (options.specPattern ??
			(contractsDirExists ? 'contracts/**/*.ts' : '**/*.ts'));

	const specs = await listSpecs(adapters, {
		cwd: options.specSearchRoot,
		pattern: searchPattern,
	});

	if (specs.length === 0) {
		return { specsCount: 0, docsCount: 0 };
	}

	const specFiles = specs.map((s) => s.filePath);
	const docsDir = path.join(generatedDir, 'docs');

	// We assume adapters passed are compatible with what gen docs needs
	const docsResult = await generateDocsFromSpecs(
		specFiles,
		{ outputDir: docsDir, format: 'markdown', rootPath },
		adapters
	);

	return {
		specsCount: specs.length,
		docsCount: docsResult.count,
	};
}
