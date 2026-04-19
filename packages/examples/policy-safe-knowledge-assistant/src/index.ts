/**
 * Policy-safe Knowledge Assistant (all-in-one template) — spec-first exports.
 */

export { default as example } from './example';
export * from './handlers/policy-safe-knowledge-assistant.handlers';
export * from './orchestrator/buildAnswer';
export * from './policy-safe-knowledge-assistant.feature';
export * from './seed';
export * from './ui';

import './docs';

export * from './example';
