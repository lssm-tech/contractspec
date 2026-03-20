export { default as example } from './example';
export type {
	EvidenceLoadOptions,
	EvidenceLoadWithSignalsOptions,
} from './load-evidence';
export {
	DEFAULT_CHUNK_SIZE,
	DEFAULT_EVIDENCE_ROOT,
	DEFAULT_TRANSCRIPT_DIRS,
	loadEvidenceChunks,
	loadEvidenceChunksWithSignals,
} from './load-evidence';
export type { PosthogEvidenceOptions } from './posthog-signals';
export {
	loadPosthogEvidenceChunks,
	resolvePosthogEvidenceOptionsFromEnv,
} from './posthog-signals';
export * from './product-intent.feature';
