/**
 * List specs service.
 */

import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec';
import type { MaybeArray } from '@contractspec/lib.utils-typescript';
import {
	type SpecScanResult,
	scanSpecSource,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';
import { discoverSpecFiles } from './discover';
import { isLibraryDefinitionFile, isTestFile } from '../utils';

/**
 * Options for listing specs.
 */
export interface ListSpecsOptions {
	/**
	 * File pattern to search.
	 */
	pattern?: string;

	/**
	 * Working directory for glob discovery.
	 */
	cwd?: string;

	/**
	 * Filter by spec type.
	 */
	type?: MaybeArray<string>;

	/**
	 * Workspace configuration
	 */
	config?: ResolvedContractsrcConfig;
}

/**
 * List all spec files in the workspace.
 */
export async function listSpecs(
	adapters: { fs: FsAdapter; scan?: typeof scanSpecSource },
	options: ListSpecsOptions = {}
): Promise<SpecScanResult[]> {
	const { fs, scan = scanSpecSource } = adapters;

	const files = await discoverSpecFiles(fs, options);
	const results: SpecScanResult[] = [];
	const specTypesToSearch = Array.isArray(options.type)
		? options.type
		: [options.type];

	for (const file of files) {
		if (isTestFile(file, options.config)) {
			continue;
		}

		// Exclude library definition files (files that define spec functions)
		if (isLibraryDefinitionFile(file)) {
			continue;
		}

		try {
			const content = await fs.readFile(file);
			const result = scan(content, file);

			if (result.specType === 'unknown') {
				continue;
			}

			if (options.type && !specTypesToSearch.includes(result.specType)) {
				continue;
			}

			results.push(result);
		} catch {
			// Ignore read errors
		}
	}

	return results;
}

/**
 * Group specs by type.
 */
export function groupSpecsByType(
	specs: SpecScanResult[]
): Map<string, SpecScanResult[]> {
	const groups = new Map<string, SpecScanResult[]>();

	for (const spec of specs) {
		const group = groups.get(spec.specType) ?? [];
		group.push(spec);
		groups.set(spec.specType, group);
	}

	return groups;
}
