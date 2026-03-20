/**
 * Hooks service module.
 *
 * Provides hook execution for git hooks configured in .contractsrc.json.
 */

export { getAvailableHooks, runHook } from './hooks-service';
export * from './types';
