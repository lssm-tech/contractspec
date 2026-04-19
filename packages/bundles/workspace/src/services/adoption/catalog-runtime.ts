import { createCatalogEntry as entry } from './catalog-entry';
import type { AdoptionCatalogEntry } from './types';

export const RUNTIME_CATALOG_ENTRIES: AdoptionCatalogEntry[] = [
	entry(
		'runtime.react-client',
		'@contractspec/lib.contracts-runtime-client-react',
		'runtime',
		'adapter',
		100,
		['runtime', 'react', 'forms', 'rendering'],
		['react client adapters', 'form rendering', 'feature rendering'],
		'React runtime adapters for ContractSpec forms and feature rendering.',
		{ platforms: ['web'] }
	),
	entry(
		'runtime.rest',
		'@contractspec/lib.contracts-runtime-server-rest',
		'runtime',
		'adapter',
		95,
		['runtime', 'rest', 'server', 'http'],
		['REST handlers', 'HTTP adapters', 'server endpoints'],
		'REST server adapters for Next, Express, Elysia, and generic server code.',
		{ runtimes: ['node'] }
	),
	entry(
		'runtime.graphql',
		'@contractspec/lib.contracts-runtime-server-graphql',
		'runtime',
		'adapter',
		95,
		['runtime', 'graphql', 'pothos', 'server'],
		['GraphQL adapters', 'typed GraphQL contract exposure'],
		'GraphQL runtime adapter for Pothos-based servers.',
		{ runtimes: ['node'] }
	),
	entry(
		'runtime.mcp',
		'@contractspec/lib.contracts-runtime-server-mcp',
		'runtime',
		'adapter',
		95,
		['runtime', 'mcp', 'tools', 'resources', 'prompts'],
		['MCP servers', 'tool/resource registration'],
		'MCP runtime adapter for ContractSpec-backed tools, resources, and prompts.',
		{ runtimes: ['node'] }
	),
	entry(
		'runtime.presentation-react',
		'@contractspec/lib.presentation-runtime-react',
		'runtime',
		'primitive',
		85,
		['runtime', 'presentation', 'react', 'tables'],
		['React presentation rendering', 'contract-backed view helpers'],
		'React presentation runtime helpers for ContractSpec-driven UI rendering.'
	),
	entry(
		'runtime.presentation-core',
		'@contractspec/lib.presentation-runtime-core',
		'runtime',
		'primitive',
		80,
		['runtime', 'presentation', 'transform', 'core'],
		['platform-agnostic presentation rendering', 'transform pipelines'],
		'Platform-agnostic presentation transform engine.'
	),
	entry(
		'runtime.harness',
		'@contractspec/lib.harness',
		'runtime',
		'primitive',
		75,
		['runtime', 'harness', 'replay', 'evaluation'],
		['proof-backed verification', 'evaluation workflows', 'replay'],
		'Harness orchestration, evidence, policy, replay, and evaluation runtime.'
	),
	entry(
		'runtime.harness-runtime',
		'@contractspec/integration.harness-runtime',
		'runtime',
		'adapter',
		70,
		['runtime', 'harness', 'browser', 'sandbox', 'mcp'],
		['browser and sandbox-backed harness targets'],
		'Runtime adapters for browser, sandbox, artifact, and MCP-backed harness targets.'
	),
];
