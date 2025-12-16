/**
 * Types for the Agent Guide service.
 */

import type {
  AgentType,
  ImplementationPlan,
  AgentPrompt,
  VerificationReport,
} from '@lssm/lib.contracts/llm';
import type { AnyContractSpec } from '@lssm/lib.contracts';

/** Configuration for the agent guide service */
export interface AgentGuideConfig {
  /** Default agent to use if not specified */
  defaultAgent: AgentType;
  /** Project root path */
  projectRoot?: string;
  /** Enable verbose logging */
  verbose?: boolean;
}

/** Options for generating an implementation guide */
export interface GuideOptions {
  /** Target agent type */
  agent?: AgentType;
  /** Existing code to consider */
  existingCode?: string;
  /** Target file path for implementation */
  targetPath?: string;
  /** Include related specs */
  includeRelated?: boolean;
}

/** Options for formatting output */
export interface FormatOptions {
  /** Output format */
  format: 'markdown' | 'json' | 'cursor-rules';
  /** Include system prompt */
  includeSystemPrompt?: boolean;
}

/** Result of generating a guide */
export interface GuideResult {
  /** The generated plan */
  plan: ImplementationPlan;
  /** Formatted prompt for the target agent */
  prompt: AgentPrompt;
  /** Raw markdown for clipboard/export */
  markdown: string;
}

/** Adapter interface for specific agent types */
export interface AgentAdapter {
  /** Agent type this adapter handles */
  agentType: AgentType;
  
  /** Format a plan for this agent */
  formatPlan(plan: ImplementationPlan): AgentPrompt;
  
  /** Generate agent-specific configuration (e.g., cursor rules) */
  generateConfig?(spec: AnyContractSpec): string;
  
  /** Parse agent output to extract code */
  parseOutput?(output: string): { code?: string; errors?: string[] };
}

/** Input for verification */
export interface VerifyInput {
  /** Spec to verify against */
  spec: AnyContractSpec;
  /** Implementation code to verify */
  implementationCode: string;
  /** Implementation file path */
  implementationPath?: string;
  /** Verification tier */
  tier?: 'structure' | 'behavior' | 'ai_review';
}

/** Combined verification result across tiers */
export interface VerificationResult {
  /** Tier 1: Structure verification */
  structure?: VerificationReport;
  /** Tier 2: Behavior verification */
  behavior?: VerificationReport;
  /** Tier 3: AI review */
  aiReview?: VerificationReport;
  /** Overall pass/fail */
  passed: boolean;
  /** Combined score (average of run tiers) */
  score: number;
  /** Summary of issues across all tiers */
  summary: string;
}

