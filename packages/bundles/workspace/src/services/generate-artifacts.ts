import { type ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec';
import { DEFAULT_CONTRACTSRC } from '@contractspec/lib.contracts-spec/workspace-config';
import {
	findAuthoringTargetDefinition,
	type SpecScanResult,
} from '@contractspec/module.workspace';
import path from 'path';
import type { WorkspaceAdapters } from '../ports/logger';
import { buildSpec, resolveDefaultBuildTargets } from './build';
import { discoverSpecs } from './discover';
import { generateDocsFromSpecs } from './docs/index';

export interface GenerateArtifactsResult {
	specsCount: number;
	docsCount: number;
	materializedCount: number;
}

export interface GenerateArtifactsOptions {
	scanAllSpecs?: boolean;
	specPattern?: string;
	specSearchRoot?: string;
	config?: ResolvedContractsrcConfig;
	includeRuntimeTests?: boolean;
}

export async function generateArtifacts(
	adapters: WorkspaceAdapters,
	contractsDir: string,
	generatedDir: string,
	rootPath?: string,
	options: GenerateArtifactsOptions = {}
): Promise<GenerateArtifactsResult> {
	const config = options.config;
	const specs = await discoverSpecs(adapters, {
		cwd: options.specSearchRoot,
		config,
		pattern: options.specPattern ?? inferSpecPattern(contractsDir, options),
	});

	if (specs.length === 0) {
		return { specsCount: 0, docsCount: 0, materializedCount: 0 };
	}

	const docsDir = path.join(resolveGeneratedRoot(generatedDir, config), 'docs');
	const docsResult = await generateDocsFromSpecs(
		specs.map((spec) => spec.filePath),
		{ outputDir: docsDir, format: 'markdown', rootPath },
		adapters
	);

	let materializedCount = 0;
	for (const spec of specs) {
		const definition = getTargetDefinition(spec);
		if (
			!definition ||
			definition.materialization === 'none' ||
			definition.materialization === 'docs'
		) {
			continue;
		}

		const buildResult = await buildSpec(
			spec.filePath,
			adapters,
			config ?? DEFAULT_CONTRACTSRC,
			{
				targets: resolveDefaultBuildTargets(spec.specType, {
					includeTests: Boolean(options.includeRuntimeTests),
				}),
				outputDir: config?.outputDir ?? './src',
				overwrite: false,
			}
		);

		materializedCount += buildResult.results.filter(
			(result) => result.success
		).length;
	}

	return {
		specsCount: specs.length,
		docsCount: docsResult.count,
		materializedCount,
	};
}

function getTargetDefinition(spec: SpecScanResult) {
	return findAuthoringTargetDefinition(spec.specType);
}

function inferSpecPattern(
	contractsDir: string,
	options: GenerateArtifactsOptions
) {
	if (options.config && !options.specPattern) {
		return undefined;
	}
	if (options.scanAllSpecs) {
		return options.specPattern;
	}
	return contractsDir ? `${normalize(contractsDir)}/**/*.ts` : undefined;
}

function resolveGeneratedRoot(
	generatedDir: string,
	config?: ResolvedContractsrcConfig
) {
	const configuredRoots = (config?.connect?.policy?.generatedPaths ?? [])
		.map(resolveGeneratedRootFromPattern)
		.filter(Boolean);
	if (configuredRoots.length > 0) {
		return configuredRoots[0] as string;
	}
	if (config?.outputDir && config.outputDir !== './src') {
		return normalize(config.outputDir);
	}
	return generatedDir;
}

function globRoot(pattern: string) {
	return normalize(pattern.split(/[\[*?{]/, 1)[0] ?? '').replace(/\/$/, '');
}

function resolveGeneratedRootFromPattern(pattern: string) {
	const root = globRoot(pattern);
	return root.endsWith('/docs') ? root.replace(/\/docs$/, '') : root;
}

function normalize(value: string) {
	return value.replaceAll('\\', '/').replace(/^\.\//, '');
}
