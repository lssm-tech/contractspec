/**
 * Verification Service
 *
 * Provides tiered verification of implementations against specs.
 *
 * Tiers:
 * - Structure (Tier 1): Types, exports, imports
 * - Behavior (Tier 2): Scenarios, examples, error handling
 * - AI Review (Tier 3): Semantic compliance analysis
 *
 * @module @contractspec/bundle.workspace/services/verify
 */

export {
	createQuickAIReview,
	verifySemanticFields,
	verifyWithAI,
	verifyWithAIEnhanced,
} from './ai-verifier';
export { verifyBehavior } from './behavior-verifier';

// Individual verifiers (for direct use)
export { verifyStructure } from './structure-verifier';
// Types
export type {
	AIReviewResult,
	BehaviorCheck,
	FieldMapping,
	FieldMatchType,
	IntentAlignment,
	SemanticVerificationResult,
	StructureCheck,
	VerifyConfig,
	VerifyInput,
	VerifyOptions,
	VerifyResult,
} from './types';
// Main service
export {
	createVerifyService,
	VerifyService,
	verifyService,
} from './verify-service';
