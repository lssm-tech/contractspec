/**
 * Locale/Jurisdiction Gate Example
 *
 * Fail-closed gating for assistant calls: locale + jurisdiction + kbSnapshotId +
 * allowedScope must be explicit, and answers must cite a KB snapshot.
 */
export * from './entities';
export * from './events';
export { default as example } from './example';
export * from './forms';
export * from './handlers';
export * from './locale-jurisdiction-gate.feature';
export * from './operations';
export * from './policy';
export * from './translations';

import './docs';
