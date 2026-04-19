/**
 * Dependency analysis service.
 */

import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec';
import {
	addContractNode,
	buildReverseEdges,
	type ContractGraph,
	type ContractNode,
	createContractGraph,
	detectCycles,
	findMissingDependencies,
	parseImportedSpecNames,
	toDot,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';
import { discoverSpecFiles } from './discover';

/**
 * Options for dependency analysis.
 */
export interface AnalyzeDepsOptions {
	/**
	 * File pattern to search.
	 */
	pattern?: string;
	config?: ResolvedContractsrcConfig;
}

/**
 * Result of dependency analysis.
 */
export interface AnalyzeDepsResult {
	graph: ContractGraph;
	total: number;
	cycles: string[][];
	missing: { contract: string; missing: string[] }[];
}

/**
 * Analyze contract dependencies.
 */
export async function analyzeDeps(
	adapters: { fs: FsAdapter },
	options: AnalyzeDepsOptions = {}
): Promise<AnalyzeDepsResult> {
	const { fs } = adapters;

	const files = await discoverSpecFiles(fs, {
		config: options.config,
		pattern: options.pattern,
	});
	const graph = createContractGraph();

	for (const file of files) {
		const content = await fs.readFile(file);
		const relativePath = fs.relative('.', file);

		// Dependency analysis works on file-level imports, so keep the node naming
		// aligned with imported file stems instead of matching nested schema "name"
		// fields, which frequently point at IO models rather than the spec module.
		const finalName =
			fs
				.basename(file)
				.replace(/\.[jt]s$/, '')
				.replace(
					/\.(contracts|contract|command|query|operation|operations|event|presentation|workflow|data-view|migration|telemetry|experiment|app-config|integration|knowledge)$/,
					''
				) || 'unknown';
		const dependencies = parseImportedSpecNames(content, file);

		addContractNode(graph, finalName, relativePath, dependencies);
	}

	buildReverseEdges(graph);

	const cycles = detectCycles(graph);
	const missing = findMissingDependencies(graph);

	return {
		graph,
		total: graph.size,
		cycles,
		missing,
	};
}

/**
 * Get contract node by name.
 */
export function getContractNode(
	graph: ContractGraph,
	name: string
): ContractNode | undefined {
	return graph.get(name);
}

/**
 * Export graph as DOT format.
 */
export function exportGraphAsDot(graph: ContractGraph): string {
	return toDot(graph);
}

/**
 * Get graph statistics.
 */
export function getGraphStats(graph: ContractGraph): {
	total: number;
	withDeps: number;
	withoutDeps: number;
	used: number;
	unused: number;
} {
	const all = Array.from(graph.values());
	const withDeps = all.filter((c) => c.dependencies.length > 0);
	const withoutDeps = all.filter((c) => c.dependencies.length === 0);
	const used = all.filter((c) => c.dependents.length > 0);
	const unused = all.filter((c) => c.dependents.length === 0);

	return {
		total: graph.size,
		withDeps: withDeps.length,
		withoutDeps: withoutDeps.length,
		used: used.length,
		unused: unused.length,
	};
}
