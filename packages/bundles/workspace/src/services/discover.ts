import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec';
import type { MaybeArray } from '@contractspec/lib.utils-typescript';
import {
	type SpecScanResult,
	scanAllSpecsFromSource,
	scanSpecSource,
} from '@contractspec/module.workspace';
import micromatch from 'micromatch';
import { DEFAULT_SPEC_PATTERNS } from '../adapters';
import type { FsAdapter } from '../ports/fs';
import { isLibraryDefinitionFile, isTestFile } from '../utils';

export interface DiscoverSpecsOptions {
	pattern?: string;
	paths?: string[];
	cwd?: string;
	type?: MaybeArray<string>;
	config?: ResolvedContractsrcConfig;
}

function splitConventionPaths(value?: string): string[] {
	return (value ?? '')
		.split('|')
		.map((entry) => entry.trim().replace(/^\.?\//, ''))
		.filter(Boolean);
}

function createConfigAwarePatterns(
	config?: ResolvedContractsrcConfig
): string[] {
	const packageRoots =
		config?.packages && config.packages.length > 0 ? config.packages : ['**'];
	const conventionPaths = [
		...splitConventionPaths(config?.conventions.models),
		...splitConventionPaths(config?.conventions.operations),
		...splitConventionPaths(config?.conventions.events),
		...splitConventionPaths(config?.conventions.presentations),
		...splitConventionPaths(config?.conventions.forms),
	];

	return [
		...new Set(
			packageRoots.flatMap((packageRoot) => {
				const prefix = packageRoot === '**' ? '' : `${packageRoot}/`;
				const scopedDefaults = DEFAULT_SPEC_PATTERNS.map(
					(pattern) => `${prefix}${pattern}`
				);
				const scopedConventions = conventionPaths.map(
					(pattern) => `${prefix}${pattern}/**/*.ts`
				);
				return [...scopedDefaults, ...scopedConventions];
			})
		),
	];
}

function shouldIncludeSpec(
	spec: SpecScanResult,
	options: DiscoverSpecsOptions,
	types: string[]
): boolean {
	if (spec.specType === 'unknown') {
		return false;
	}

	if (options.type && !types.includes(spec.specType)) {
		return false;
	}

	return true;
}

function sortSpecs(left: SpecScanResult, right: SpecScanResult): number {
	const fileCompare = left.filePath.localeCompare(right.filePath);
	if (fileCompare !== 0) {
		return fileCompare;
	}

	const lineCompare =
		(left.declarationLine ?? Number.MAX_SAFE_INTEGER) -
		(right.declarationLine ?? Number.MAX_SAFE_INTEGER);
	if (lineCompare !== 0) {
		return lineCompare;
	}

	return (left.discoveryId ?? left.key ?? '').localeCompare(
		right.discoveryId ?? right.key ?? ''
	);
}

export async function discoverSpecFiles(
	fs: FsAdapter,
	options: DiscoverSpecsOptions = {}
): Promise<string[]> {
	if (options.paths && options.paths.length > 0) {
		return [...new Set(options.paths)].sort((left, right) =>
			left.localeCompare(right)
		);
	}

	if (options.pattern) {
		return fs.glob({ cwd: options.cwd, pattern: options.pattern });
	}

	return fs.glob({
		cwd: options.cwd,
		patterns: createConfigAwarePatterns(options.config),
	});
}

export async function discoverSpecs(
	adapters: { fs: FsAdapter },
	options: DiscoverSpecsOptions = {}
): Promise<SpecScanResult[]> {
	const files = await discoverSpecFiles(adapters.fs, options);
	const specTypesToSearch = options.type
		? Array.isArray(options.type)
			? options.type
			: [options.type]
		: [];
	const results: SpecScanResult[] = [];

	for (const file of files) {
		if (
			options.config?.excludePackages &&
			micromatch.isMatch(file, options.config.excludePackages, {
				contains: true,
			})
		) {
			continue;
		}

		if (
			file.includes('node_modules') ||
			file.includes('/dist/') ||
			isTestFile(file, options.config) ||
			isLibraryDefinitionFile(file)
		) {
			continue;
		}

		try {
			const content = await adapters.fs.readFile(file);
			const discovered = scanAllSpecsFromSource(content, file);
			const specs =
				discovered.length > 0 ? discovered : [scanSpecSource(content, file)];

			for (const spec of specs) {
				if (shouldIncludeSpec(spec, options, specTypesToSearch)) {
					results.push(spec);
				}
			}
		} catch {
			// Ignore unreadable files during discovery.
		}
	}

	return results.sort(sortSpecs);
}
