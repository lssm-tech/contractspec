import { relative, resolve } from 'node:path';

export type HookPayload = string | Record<string, unknown>;
export type ContractsSpecHookEvent =
	| 'before-file-edit'
	| 'before-shell-execution'
	| 'after-file-edit';

const CONTRACTS_SPEC_PATH_PREFIX = 'packages/libs/contracts-spec/';
const CONTRACTS_SPEC_COMMAND_PATTERN =
	/(packages\/libs\/contracts-spec|@contractspec\/lib\.contracts-spec|contractspec\s+(impact|validate|connect)|turbo\s+run\s+(typecheck|test).*(contracts-spec)|changeset|git\s+push)/i;

export function extractFilePath(payload: HookPayload, cwd: string) {
	const raw =
		typeof payload === 'string'
			? payload
			: firstString(
					payload.path,
					payload.filePath,
					payload.filepath,
					payload.target,
					lookup(payload, ['file', 'path']),
					lookup(payload, ['params', 'path']),
					lookup(payload, ['params', 'filePath']),
					lookup(payload, ['tool_input', 'file_path']),
					lookup(payload, ['tool_input', 'path']),
					lookup(payload, ['toolInput', 'file_path']),
					lookup(payload, ['toolInput', 'path'])
				);
	return normalizePath(raw, cwd);
}

export function extractCommand(payload: HookPayload) {
	if (typeof payload === 'string') {
		return payload.trim();
	}

	return firstString(
		payload.command,
		payload.cmd,
		payload.shellCommand,
		lookup(payload, ['params', 'command']),
		lookup(payload, ['params', 'cmd']),
		lookup(payload, ['tool_input', 'command']),
		lookup(payload, ['toolInput', 'command'])
	);
}

export function extractPaths(payload: HookPayload, cwd: string) {
	if (typeof payload === 'string') {
		return [];
	}

	const values = [
		...stringArray(payload.paths),
		...stringArray(payload.touchedPaths),
		...stringArray(payload.files),
	];
	const filePath = extractFilePath(payload, cwd);
	if (filePath) {
		values.push(filePath);
	}

	return [
		...new Set(
			values
				.map((value) => normalizePath(value, cwd))
				.filter(Boolean) as string[]
		),
	];
}

export function commandTargetsContractsSpec(command: string) {
	return CONTRACTS_SPEC_COMMAND_PATTERN.test(command);
}

export function isContractsSpecPath(path: string) {
	return path.startsWith(CONTRACTS_SPEC_PATH_PREFIX);
}

export function slug(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function normalizePath(value: string | undefined, cwd: string) {
	if (!value) {
		return undefined;
	}
	if (!value.startsWith('/')) {
		return value.replaceAll('\\', '/');
	}

	const absolute = resolve(value);
	const relativePath = relative(cwd, absolute).replaceAll('\\', '/');
	return relativePath.startsWith('..') ? undefined : relativePath;
}

function lookup(
	value: Record<string, unknown>,
	path: string[]
): string | undefined {
	let current: unknown = value;
	for (const key of path) {
		if (!current || typeof current !== 'object' || !(key in current)) {
			return undefined;
		}
		current = (current as Record<string, unknown>)[key];
	}
	return typeof current === 'string' ? current : undefined;
}

function stringArray(value: unknown) {
	return Array.isArray(value)
		? value.filter((entry): entry is string => typeof entry === 'string')
		: [];
}

function firstString(...values: unknown[]) {
	for (const value of values) {
		if (typeof value === 'string' && value.trim().length > 0) {
			return value.trim();
		}
	}
	return undefined;
}
