export type RuntimeKind = 'bun' | 'node';

/**
 * Detect the current JavaScript runtime.
 */
export function detectRuntime(): RuntimeKind {
  // Bun defines a global `Bun` object.
  const isBun = typeof (globalThis as { Bun?: unknown }).Bun !== 'undefined';
  return isBun ? 'bun' : 'node';
}

/**
 * Check if running in Bun runtime.
 */
export function isBunRuntime(): boolean {
  return detectRuntime() === 'bun';
}

/**
 * Check if running in Node.js runtime.
 */
export function isNodeRuntime(): boolean {
  return detectRuntime() === 'node';
}

/**
 * Get the runtime version.
 */
export function getRuntimeVersion(): string {
  if (isBunRuntime()) {
    const Bun = (globalThis as { Bun?: { version: string } }).Bun;
    return Bun?.version ?? 'unknown';
  }
  return process.version;
}

/**
 * Get Node.js-compatible APIs that work in both runtimes.
 */
export function getCompatibleApis() {
  return {
    /**
     * Dynamic import that works in both Bun and Node.js.
     */
    dynamicImport: async <T = unknown>(specifier: string): Promise<T> => {
      // Both Bun and Node.js support dynamic import()
      return import(specifier) as Promise<T>;
    },

    /**
     * Resolve module path (uses import.meta.resolve in both runtimes).
     */
    resolveModule: (specifier: string, parent?: string): string => {
      // Both Bun and Node.js 20+ support import.meta.resolve
      if (parent) {
        return new URL(specifier, parent).href;
      }
      return specifier;
    },
  };
}
