/**
 * Shared context types / interface.
 *
 * Runtime-specific implementations live in:
 * - `./context.node.ts` (Node.js / Bun)
 * - `./context.browser.ts` (Browser, via Zone.js)
 *
 * This file must remain free of runtime-specific imports so it can be safely
 * referenced in any compilation context.
 */
export type { ContextData, TraceContext } from './types';

export interface LogContextApi {
  run<T>(context: import('./types').ContextData, fn: () => T): T;
  extend<T>(
    additionalContext: Partial<import('./types').ContextData>,
    fn: () => T
  ): T;
  set(key: string, value: unknown): void;
  get<T>(key: string): T | undefined;
  getContext(): import('./types').ContextData;
  setTrace(trace: import('./types').TraceContext): void;
  getCurrentTrace(): import('./types').TraceContext | undefined;
  generateId(): string;
}
