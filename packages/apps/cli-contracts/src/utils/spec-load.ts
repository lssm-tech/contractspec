import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { detectRuntime } from './runtime';
import { loadTypeScriptModule } from './module-loader';

export type LoadedModule = Record<string, unknown>;

export async function loadSpecModule(
  filePath: string
): Promise<LoadedModule> {
  const runtime = detectRuntime();
  const absolute = resolve(process.cwd(), filePath);

  if (runtime === 'bun') {
    const url = pathToFileURL(absolute).href;
    const mod = await import(url);
    return mod as LoadedModule;
  }

  // Node path: execute transpiled CommonJS in a VM sandbox
  const mod = await loadTypeScriptModule(absolute);
  return (mod ?? {}) as LoadedModule;
}

export function pickSpecExport(mod: LoadedModule): unknown {
  if (typeof mod.default !== 'undefined') return mod.default;
  if (typeof mod.spec !== 'undefined') return mod.spec;
  const values = Object.values(mod);
  if (values.length === 1) return values[0];
  return mod;
}


