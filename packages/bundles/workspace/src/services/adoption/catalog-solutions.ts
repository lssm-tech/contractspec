import { createCatalogEntry as entry } from './catalog-entry';
import type { AdoptionCatalogEntry } from './types';

export const SOLUTION_CATALOG_ENTRIES: AdoptionCatalogEntry[] = [
	entry(
		'solutions.ai-chat',
		'@contractspec/module.ai-chat',
		'solutions',
		'module',
		60,
		['solutions', 'module', 'chat', 'agent-ui'],
		['feature-complete AI chat surfaces', 'reusable chat modules'],
		'Reusably packaged AI chat system.'
	),
	entry(
		'solutions.provider-ranking',
		'@contractspec/module.provider-ranking',
		'solutions',
		'module',
		55,
		['solutions', 'module', 'provider-ranking', 'benchmarks'],
		['ranking pipelines', 'provider benchmark workflows'],
		'Provider ranking pipelines, storage, and orchestration.'
	),
	entry(
		'solutions.bundle-workspace',
		'@contractspec/bundle.workspace',
		'solutions',
		'bundle',
		50,
		['solutions', 'bundle', 'workspace', 'automation'],
		['workspace services', 'setup', 'doctor', 'connect'],
		'Workspace bundle powering CLI, validation, generation, and setup flows.'
	),
	entry(
		'solutions.bundle-library',
		'@contractspec/bundle.library',
		'solutions',
		'bundle',
		45,
		['solutions', 'bundle', 'docs', 'mcp', 'templates'],
		[
			'docs surfaces',
			'MCP handlers',
			'library-style composed product surfaces',
		],
		'Library bundle for docs, templates, and MCP-facing product surfaces.'
	),
	entry(
		'solutions.example-minimal',
		'@contractspec/example.minimal',
		'solutions',
		'example',
		30,
		['solutions', 'example', 'starter', 'minimal'],
		['reference implementations', 'scaffolding references', 'how-to examples'],
		'Minimal example showing baseline ContractSpec usage.'
	),
];
