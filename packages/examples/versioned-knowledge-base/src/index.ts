/**
 * Versioned Knowledge Base Example
 *
 * Curated KB with immutable sources, reviewable rule versions, and published snapshots.
 */
export * from './entities';
export * from './events';
export { default as example } from './example';
export * from './handlers';
export * from './knowledge-snapshot-publication.migration';
export * from './operations';
export * from './versioned-knowledge-base.feature';

import './docs';

export * from './example';
