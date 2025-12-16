/**
 * Locale/Jurisdiction Gate Example
 *
 * Fail-closed gating for assistant calls: locale + jurisdiction + kbSnapshotId +
 * allowedScope must be explicit, and answers must cite a KB snapshot.
 */
export * from './entities';
export * from './contracts';
export * from './events';
export * from './policy';
export * from './handlers';
export * from './locale-jurisdiction-gate.feature';
export { default as example } from './example';

import './docs';
