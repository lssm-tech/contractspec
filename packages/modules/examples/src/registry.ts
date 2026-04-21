import { ExampleRegistry } from '@contractspec/lib.contracts-spec/examples/registry';
import type { ExampleSpec } from '@contractspec/lib.contracts-spec/examples/types';
import {
	EXAMPLE_SOURCE_REGISTRY as BUILTIN_EXAMPLE_SOURCES,
	EXAMPLE_REGISTRY as BUILTIN_EXAMPLES,
} from './builtins';

export interface ExampleSource {
	key: string;
	packageName: string;
	repositoryUrl: string;
	directory: string;
	defaultRef: string;
}

const EXAMPLE_KEY_PREFIX = 'examples.';

function normalizeExampleKey(key: string): string {
	return key.startsWith(EXAMPLE_KEY_PREFIX)
		? key.slice(EXAMPLE_KEY_PREFIX.length)
		: key;
}

function normalizeExample(example: ExampleSpec): ExampleSpec {
	const key = normalizeExampleKey(example.meta.key);
	if (key === example.meta.key) {
		return example;
	}

	return {
		...example,
		meta: {
			...example.meta,
			key,
		},
	};
}

// Export the ExampleRegistry class from contracts
export { ExampleRegistry } from '@contractspec/lib.contracts-spec/examples/registry';

// Create a global registry instance populated with builtins
const globalRegistry = new ExampleRegistry();
const exampleByKey = new Map<string, ExampleSpec>();
const sourceByKey = new Map<string, ExampleSource>();

// Register all builtin examples
for (const example of BUILTIN_EXAMPLES) {
	const normalizedExample = normalizeExample(example);
	globalRegistry.register(normalizedExample);
	exampleByKey.set(normalizedExample.meta.key, normalizedExample);
	exampleByKey.set(example.meta.key, normalizedExample);
}

for (const source of BUILTIN_EXAMPLE_SOURCES) {
	sourceByKey.set(source.key, source);
	sourceByKey.set(`${EXAMPLE_KEY_PREFIX}${source.key}`, source);
	sourceByKey.set(source.packageName, source);
}

/**
 * Global registry containing all builtin ContractSpec examples.
 * @deprecated Prefer using ExampleRegistry directly for custom registrations.
 */
export const EXAMPLE_REGISTRY: readonly ExampleSpec[] = globalRegistry.list();

/**
 * List all registered examples.
 */
export function listExamples(): readonly ExampleSpec[] {
	return globalRegistry.list();
}

/**
 * Return the public example id used by CLI/docs/sandbox routes.
 */
export function getExampleId(exampleOrKey: ExampleSpec | string): string {
	return normalizeExampleKey(
		typeof exampleOrKey === 'string' ? exampleOrKey : exampleOrKey.meta.key
	);
}

/**
 * Get an example by its key.
 */
export function getExample(key: string): ExampleSpec | undefined {
	return exampleByKey.get(key);
}

/**
 * Get source information for downloading or linking an example package.
 */
export function getExampleSource(key: string): ExampleSource | undefined {
	return sourceByKey.get(key);
}

/**
 * Search examples by query (matches key, title, description, tags).
 */
export function searchExamples(query: string): ExampleSpec[] {
	const normalizedQuery = normalizeExampleKey(query);
	const matches = new Map<string, ExampleSpec>();

	for (const example of globalRegistry.search(query)) {
		matches.set(example.meta.key, example);
	}

	if (normalizedQuery !== query) {
		for (const example of globalRegistry.search(normalizedQuery)) {
			matches.set(example.meta.key, example);
		}
	}

	return [...matches.values()];
}
