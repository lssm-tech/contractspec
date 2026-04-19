import { createCatalogEntry as entry } from './catalog-entry';
import type { AdoptionCatalogEntry } from './types';

export const SHARED_CATALOG_ENTRIES: AdoptionCatalogEntry[] = [
	entry(
		'shared.logger',
		'@contractspec/lib.logger',
		'sharedLibs',
		'primitive',
		100,
		['shared', 'logger', 'observability'],
		['structured logging', 'app and service logging'],
		'Structured logger used across ContractSpec runtimes and apps.'
	),
	entry(
		'shared.files',
		'@contractspec/lib.files',
		'sharedLibs',
		'primitive',
		90,
		['shared', 'files', 'artifacts', 'storage'],
		['file abstractions', 'artifact handling'],
		'File and artifact helpers for reusable storage-facing workflows.'
	),
	entry(
		'shared.testing',
		'@contractspec/lib.testing',
		'sharedLibs',
		'primitive',
		90,
		['shared', 'testing', 'golden-tests', 'verification'],
		['golden tests', 'safe regeneration verification'],
		'Testing helpers for proof-oriented and golden regression workflows.'
	),
	entry(
		'shared.observability',
		'@contractspec/lib.observability',
		'sharedLibs',
		'primitive',
		85,
		['shared', 'observability', 'metrics', 'tracing'],
		['structured tracing', 'metrics', 'telemetry'],
		'Tracing, metrics, and structured logging helpers.'
	),
	entry(
		'shared.identity',
		'@contractspec/lib.identity-rbac',
		'sharedLibs',
		'primitive',
		80,
		['shared', 'identity', 'rbac', 'authz'],
		['identity and RBAC helpers', 'authorization models'],
		'Identity and RBAC helpers for policy-aware systems.'
	),
	entry(
		'shared.accessibility',
		'@contractspec/lib.accessibility',
		'sharedLibs',
		'primitive',
		75,
		['shared', 'accessibility', 'ui', 'a11y'],
		['accessibility primitives', 'cross-surface a11y helpers'],
		'Accessibility helpers layered on top of ContractSpec UI surfaces.'
	),
	entry(
		'shared.ai-agent',
		'@contractspec/lib.ai-agent',
		'sharedLibs',
		'primitive',
		70,
		['shared', 'ai', 'agent', 'mcp'],
		['tool-aware agent orchestration', 'approval-backed agent workflows'],
		'AI agent orchestration with contract governance.'
	),
	entry(
		'shared.ai-providers',
		'@contractspec/lib.ai-providers',
		'sharedLibs',
		'primitive',
		65,
		['shared', 'ai', 'providers', 'models'],
		['provider resolution', 'model catalogs', 'AI integrations'],
		'Shared AI provider abstractions and model metadata.'
	),
];
