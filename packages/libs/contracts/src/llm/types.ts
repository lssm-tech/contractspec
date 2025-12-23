/**
 * Types for LLM integration module.
 * Defines export formats, agent types, and verification structures.
 */

import type { AnyOperationSpec } from '../operations/';
import type { FeatureModuleSpec } from '../features';
import type { PresentationSpec } from '../presentations/presentations.v2';
import type { EventSpec } from '../events';
import type { AnySchemaModel } from '@lssm/lib.schema';
import type { DocBlock } from '../docs/types';

/** Supported export formats for LLM consumption */
export type LLMExportFormat = 'context' | 'full' | 'prompt';

/** Supported agent types for implementation guidance */
export type AgentType = 'claude-code' | 'cursor-cli' | 'generic-mcp';

/** Verification tiers */
export type VerificationTier = 'structure' | 'behavior' | 'ai_review';

/** Options for exporting specs to markdown */
export interface SpecExportOptions {
  /** Export format: context (summary), full (all details), prompt (actionable) */
  format: LLMExportFormat;
  /** Include JSON Schema for I/O types */
  includeSchemas?: boolean;
  /** Include acceptance scenarios */
  includeScenarios?: boolean;
  /** Include examples */
  includeExamples?: boolean;
  /** Include policy details */
  includePolicy?: boolean;
  /** Include side effects (events, analytics) */
  includeSideEffects?: boolean;
}

/** Options for exporting features to markdown */
export interface FeatureExportOptions extends SpecExportOptions {
  /** Include related specs inline */
  includeRelatedSpecs?: boolean;
  /** Include related events inline */
  includeRelatedEvents?: boolean;
  /** Include related presentations inline */
  includeRelatedPresentations?: boolean;
}

/** Result of spec export */
export interface SpecExportResult {
  /** The spec that was exported */
  spec: AnyOperationSpec;
  /** Generated markdown content */
  markdown: string;
  /** Export format used */
  format: LLMExportFormat;
  /** Metadata about the export */
  meta: {
    specName: string;
    specVersion: number;
    exportedAt: string;
    wordCount: number;
  };
}

/** Result of feature export */
export interface FeatureExportResult {
  /** The feature that was exported */
  feature: FeatureModuleSpec;
  /** Generated markdown content */
  markdown: string;
  /** Export format used */
  format: LLMExportFormat;
  /** Included specs */
  includedSpecs: string[];
  /** Included events */
  includedEvents: string[];
  /** Included presentations */
  includedPresentations: string[];
}

/** Implementation plan generated for agents */
export interface ImplementationPlan {
  /** Feature/spec being implemented */
  target: {
    type: 'spec' | 'feature' | 'presentation';
    name: string;
    version: number;
  };
  /** Context section */
  context: {
    goal: string;
    description: string;
    background: string;
  };
  /** Full spec markdown */
  specMarkdown: string;
  /** Suggested file structure */
  fileStructure: {
    path: string;
    purpose: string;
    type: 'create' | 'modify';
  }[];
  /** Ordered implementation steps */
  steps: {
    order: number;
    title: string;
    description: string;
    acceptanceCriteria: string[];
  }[];
  /** Constraints to follow */
  constraints: {
    policy: string[];
    security: string[];
    pii: string[];
  };
  /** Verification checklist */
  verificationChecklist: string[];
}

/** Verification issue found during implementation check */
export interface VerificationIssue {
  /** Issue severity */
  severity: 'error' | 'warning' | 'info';
  /** Issue category */
  category:
    | 'type'
    | 'export'
    | 'import'
    | 'scenario'
    | 'example'
    | 'error_handling'
    | 'semantic';
  /** Issue message */
  message: string;
  /** Location in code if applicable */
  location?: {
    file?: string;
    line?: number;
    column?: number;
  };
  /** Suggested fix */
  suggestion?: string;
}

/** Result of implementation verification */
export interface VerificationReport {
  /** Verification tier that was run */
  tier: VerificationTier;
  /** Overall pass/fail */
  passed: boolean;
  /** Score from 0-100 */
  score: number;
  /** Issues found */
  issues: VerificationIssue[];
  /** Suggestions for improvement */
  suggestions: string[];
  /** Coverage metrics */
  coverage: {
    scenarios: { total: number; covered: number };
    errors: { total: number; handled: number };
    fields: { total: number; implemented: number };
  };
  /** Metadata about the verification */
  meta: {
    specName: string;
    specVersion: number;
    implementationPath: string;
    verifiedAt: string;
    duration: number;
  };
}

/** Agent-specific prompt format */
export interface AgentPrompt {
  /** Agent type this prompt is for */
  agent: AgentType;
  /** System prompt (if applicable) */
  systemPrompt?: string;
  /** User/task prompt */
  taskPrompt: string;
  /** Additional context resources */
  resources?: {
    uri: string;
    title: string;
    mimeType: string;
  }[];
}

/** Input for spec lookup */
export interface SpecLookup {
  name: string;
  version?: number;
}

/** Input for feature lookup */
export interface FeatureLookup {
  key: string;
}

/** Batch export options */
export interface BatchExportOptions extends SpecExportOptions {
  /** Glob pattern to match spec files */
  pattern?: string;
  /** Spec types to include */
  types?: ('command' | 'query' | 'event' | 'presentation' | 'feature')[];
  /** Output format */
  outputFormat?: 'single' | 'per-spec' | 'per-feature';
}

/** Exportable item types */
export type ExportableItem =
  | { type: 'spec'; item: AnyOperationSpec }
  | { type: 'feature'; item: FeatureModuleSpec }
  | { type: 'presentation'; item: PresentationSpec }
  | { type: 'event'; item: EventSpec<AnySchemaModel> }
  | { type: 'doc'; item: DocBlock };
