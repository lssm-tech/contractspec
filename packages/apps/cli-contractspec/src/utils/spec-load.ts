import { loadAuthoredModule } from '@contractspec/bundle.workspace';

export type LoadedModule = Record<string, unknown>;
export interface LoadedSpecExport {
	exportName: string;
	value: unknown;
}

export async function loadSpecModule(filePath: string): Promise<LoadedModule> {
	return (await loadAuthoredModule(filePath)).exports as LoadedModule;
}

export function pickSpecExport(mod: LoadedModule): unknown {
	if (typeof mod.default !== 'undefined') return mod.default;
	if (typeof mod.spec !== 'undefined') return mod.spec;
	const values = Object.values(mod);
	if (values.length === 1) return values[0];
	return mod;
}

function isSpecLike(value: unknown): value is Record<string, unknown> {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const record = value as Record<string, unknown>;
	const meta =
		record.meta && typeof record.meta === 'object'
			? (record.meta as Record<string, unknown>)
			: undefined;

	if (typeof meta?.key === 'string') {
		return true;
	}

	if (typeof record.key !== 'string') {
		return false;
	}

	return (
		typeof record.kind === 'string' ||
		'io' in record ||
		'payload' in record ||
		'content' in record ||
		'definition' in record
	);
}

export function collectSpecExports(mod: LoadedModule): LoadedSpecExport[] {
	const exports: LoadedSpecExport[] = [];

	for (const [exportName, value] of Object.entries(mod)) {
		if (exportName === '__esModule' || !isSpecLike(value)) {
			continue;
		}

		exports.push({ exportName, value });
	}

	if (exports.length > 0) {
		return exports;
	}

	const fallback = pickSpecExport(mod);
	return isSpecLike(fallback)
		? [{ exportName: 'default', value: fallback }]
		: [];
}

export async function loadSpecFromFile(filePath: string): Promise<unknown> {
	const mod = await loadSpecModule(filePath);
	return pickSpecExport(mod);
}
