import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
import type { FsAdapter } from '../ports/fs';

export interface LoadedAuthoredModule {
	modulePath: string;
	exports: Record<string, unknown>;
}

export interface LoadAuthoredModuleValueOptions<T> {
	description: string;
	isValue: (value: unknown) => value is T;
	instanceKeys?: string[];
	factoryKeys?: string[];
}

export async function loadAuthoredModule(
	modulePath: string,
	options: { runtime?: 'bun' | 'node' } = {}
): Promise<LoadedAuthoredModule> {
	const absolutePath = resolve(process.cwd(), modulePath);
	const runtime = options.runtime ?? detectRuntime();

	try {
		const loaded =
			runtime === 'bun'
				? await loadViaNativeImport(absolutePath)
				: await loadViaNodeFallback(absolutePath);

		return {
			modulePath: absolutePath,
			exports: loaded,
		};
	} catch (error) {
		throw new Error(formatModuleLoadError(absolutePath, error));
	}
}

export async function loadAuthoredModuleIfExists(
	modulePath: string,
	fs: FsAdapter
): Promise<LoadedAuthoredModule | null> {
	const absolutePath = resolve(process.cwd(), modulePath);
	if (!(await fs.exists(absolutePath))) {
		return null;
	}
	return loadAuthoredModule(absolutePath);
}

export async function loadAuthoredModuleExports(
	modulePath: string,
	options: { runtime?: 'bun' | 'node' } = {}
): Promise<Record<string, unknown>> {
	return (await loadAuthoredModule(modulePath, options)).exports;
}

export async function loadAuthoredModuleValue<T>(
	modulePath: string,
	options: LoadAuthoredModuleValueOptions<T>
): Promise<T> {
	const exports = await loadAuthoredModuleExports(modulePath);
	return resolveAuthoredModuleValue(exports, modulePath, options);
}

export function formatModuleLoadError(modulePath: string, error: unknown) {
	return `Failed to load authored module at ${modulePath}: ${error instanceof Error ? error.message : String(error)}`;
}

export async function resolveAuthoredModuleValue<T>(
	exports: Record<string, unknown>,
	modulePath: string,
	options: LoadAuthoredModuleValueOptions<T>
): Promise<T> {
	if (options.isValue(exports)) {
		return exports;
	}

	for (const key of options.instanceKeys ?? []) {
		if (options.isValue(exports[key])) {
			return exports[key];
		}
	}

	for (const key of options.factoryKeys ?? []) {
		const candidate = exports[key];
		if (typeof candidate !== 'function') {
			continue;
		}
		const value = await candidate();
		if (options.isValue(value)) {
			return value;
		}
	}

	throw new Error(
		`${options.description} module ${modulePath} must export a supported instance or factory.`
	);
}

async function loadViaNativeImport(
	modulePath: string
): Promise<Record<string, unknown>> {
	const url = pathToFileURL(modulePath).href;
	return (await import(url)) as Record<string, unknown>;
}

async function loadViaNodeFallback(
	modulePath: string
): Promise<Record<string, unknown>> {
	const loaded = await loadTypeScriptModule(modulePath);
	return (loaded ?? {}) as Record<string, unknown>;
}

function detectRuntime() {
	return typeof (globalThis as { Bun?: unknown }).Bun !== 'undefined'
		? 'bun'
		: 'node';
}

export const __moduleLoaderInternals = {
	formatModuleLoadError,
	resolveAuthoredModuleValue,
};

async function loadTypeScriptModule(filePath: string): Promise<unknown> {
	const source = await readFile(filePath, 'utf-8');
	const transpiled = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2020,
			esModuleInterop: true,
		},
		fileName: filePath,
	});

	const moduleExports: Record<string, unknown> = {};
	const moduleObject = { exports: moduleExports };
	const require = createRequire(filePath);

	const context = vm.createContext({
		module: moduleObject,
		exports: moduleExports,
		require,
		__dirname: dirname(filePath),
		__filename: filePath,
		process,
		console,
		Buffer,
		setTimeout,
		setImmediate,
		clearTimeout,
		clearImmediate,
	});

	const script = new vm.Script(transpiled.outputText, {
		filename: filePath,
	});
	script.runInContext(context);

	return moduleObject.exports;
}
