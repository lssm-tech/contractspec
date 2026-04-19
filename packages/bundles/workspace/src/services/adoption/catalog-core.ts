import { createCatalogEntry as entry } from './catalog-entry';
import type { AdoptionCatalogEntry } from './types';

export const CORE_CATALOG_ENTRIES: AdoptionCatalogEntry[] = [
	entry(
		'contracts.spec',
		'@contractspec/lib.contracts-spec',
		'contracts',
		'primitive',
		100,
		['contracts', 'specs', 'operations', 'events', 'policies'],
		['new contracts', 'spec-first APIs', 'shared contract registries'],
		'Core ContractSpec contract declarations, registries, policy, workflow, and shared spec types.'
	),
	entry(
		'contracts.schema',
		'@contractspec/lib.schema',
		'contracts',
		'primitive',
		90,
		['schema', 'validation', 'io-models', 'json-schema'],
		['shared schema models', 'multi-surface I/O definitions'],
		'Schema definitions for ContractSpec multi-surface consistency.'
	),
	entry(
		'integrations.contracts',
		'@contractspec/lib.contracts-integrations',
		'integrations',
		'primitive',
		100,
		['integrations', 'providers', 'capabilities', 'connections'],
		[
			'provider contracts',
			'integration metadata',
			'runtime capability definitions',
		],
		'Integration definitions for providers, capabilities, connection models, and runtime metadata.'
	),
	entry(
		'integrations.providers-impls',
		'@contractspec/integration.providers-impls',
		'integrations',
		'adapter',
		90,
		['integrations', 'providers', 'implementations', 'sdk-bridges'],
		['provider implementations', 'existing vendor bridges'],
		'Concrete provider implementations layered over ContractSpec integration contracts.'
	),
	entry(
		'integrations.runtime',
		'@contractspec/integration.runtime',
		'integrations',
		'adapter',
		80,
		['runtime', 'integrations', 'managed', 'local', 'hybrid'],
		['runtime composition', 'integration execution', 'provider orchestration'],
		'Runtime composition helpers for integration execution.'
	),
];
