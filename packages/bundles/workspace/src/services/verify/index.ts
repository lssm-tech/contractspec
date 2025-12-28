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

// Types
export type {
  VerifyConfig,
  VerifyOptions,
  VerifyInput,
  VerifyResult,
  StructureCheck,
  BehaviorCheck,
  AIReviewResult,
  FieldMapping,
  FieldMatchType,
  IntentAlignment,
  SemanticVerificationResult,
} from './types';

// Main service
export {
  VerifyService,
  createVerifyService,
  verifyService,
} from './verify-service';

// Individual verifiers (for direct use)
export { verifyStructure } from './structure-verifier';
export { verifyBehavior } from './behavior-verifier';
export {
  verifyWithAI,
  createQuickAIReview,
  verifySemanticFields,
  verifyWithAIEnhanced,
} from './ai-verifier';
