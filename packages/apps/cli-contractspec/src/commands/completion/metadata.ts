import type { Argument, Option } from 'commander';

const PATH_HINT_PATTERN =
	/(path|file|dir|directory|output|source|registry|blueprint|catalog|implementation|repo-root|runner-import|executor|contexts?)/i;
const DIRECTORY_HINT_PATTERN = /(dir|directory|output)/i;

const GENERIC_OPTION_VALUES: Record<string, string[]> = {
	provider: ['claude', 'openai', 'ollama', 'custom'],
	scope: ['workspace', 'package'],
	mode: ['short', 'deliberate'],
	audience: ['product', 'eng', 'qa'],
};

const COMMAND_OPTION_VALUES: Record<string, string[]> = {
	'build:agentMode': [
		'simple',
		'cursor',
		'claude-code',
		'openai-codex',
		'opencode',
	],
	'create:type': [
		'operation',
		'event',
		'presentation',
		'form',
		'feature',
		'theme',
		'workflow',
		'data-view',
		'migration',
		'telemetry',
		'experiment',
		'app-config',
		'integration',
		'knowledge',
	],
	'execution-lanes complete:mode': ['short', 'deliberate'],
	'execution-lanes plan:mode': ['short', 'deliberate'],
	'execution-lanes plan:nextLane': ['complete.persistent', 'team.coordinated'],
	'execution-lanes team:mode': ['short', 'deliberate'],
	'import:framework': [
		'nestjs',
		'express',
		'fastify',
		'hono',
		'elysia',
		'trpc',
		'next-api',
	],
	'openapi import:formatter': ['biome', 'dprint', 'custom'],
	'openapi import:schemaFormat': [
		'contractspec',
		'zod',
		'json-schema',
		'graphql',
	],
	'openapi import:syncMode': ['import', 'sync', 'validate'],
	'registry add:kind': ['command', 'query'],
	'test generate:framework': ['vitest', 'jest'],
	'validate:agentMode': ['simple', 'claude-code', 'openai-codex', 'opencode'],
	'view:audience': ['product', 'eng', 'qa'],
};

export function resolveOptionValues(
	commandPath: string[],
	option: Option
): string[] | undefined {
	const attributeName = option.attributeName();
	const scopedKey = `${commandPath.join(' ')}:${attributeName}`;
	return (
		COMMAND_OPTION_VALUES[scopedKey] ?? GENERIC_OPTION_VALUES[attributeName]
	);
}

export function isPathLikeOption(option: Option): boolean {
	return matchesPathHint([
		option.attributeName(),
		option.long,
		option.flags,
		option.description,
	]);
}

export function optionPrefersDirectories(option: Option): boolean {
	return matchesPathHint([option.attributeName(), option.long, option.flags])
		? DIRECTORY_HINT_PATTERN.test(
				`${option.attributeName()} ${option.long ?? ''} ${option.flags}`
			)
		: false;
}

export function isPathLikeArgument(argument: Argument): boolean {
	return matchesPathHint([argument.name(), argument.description]);
}

export function argumentPrefersDirectories(argument: Argument): boolean {
	return DIRECTORY_HINT_PATTERN.test(
		`${argument.name()} ${argument.description ?? ''}`
	);
}

function matchesPathHint(parts: Array<string | undefined>): boolean {
	return PATH_HINT_PATTERN.test(parts.filter(Boolean).join(' '));
}
