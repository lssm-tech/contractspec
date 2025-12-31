/**
 * Policy-safe Knowledge Assistant (all-in-one template) — spec-first exports.
 */
export * from './feature';
export * from './seed';
export * from './orchestrator/buildAnswer';
export * from './handlers/policy-safe-knowledge-assistant.handlers';
export * from './ui';
export { default as example } from './example';

import './docs';
