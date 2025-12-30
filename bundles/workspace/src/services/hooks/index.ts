/**
 * Hooks service module.
 *
 * Provides hook execution for git hooks configured in .contractsrc.json.
 */

export * from './types';
export { runHook, getAvailableHooks } from './hooks-service';
