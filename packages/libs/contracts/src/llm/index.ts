/**
 * LLM Integration Module
 *
 * Provides tools for exporting ContractSpec artifacts to LLM-friendly formats,
 * generating implementation prompts for AI coding agents, and verifying
 * implementations against specifications.
 *
 * @module @lssm/lib.contracts/llm
 */

// Types
export type {
  LLMExportFormat,
  AgentType,
  VerificationTier,
  SpecExportOptions,
  FeatureExportOptions,
  SpecExportResult,
  FeatureExportResult,
  ImplementationPlan,
  VerificationIssue,
  VerificationReport,
  AgentPrompt,
  SpecLookup,
  FeatureLookup,
  BatchExportOptions,
  ExportableItem,
} from './types';

// Exporters
export {
  operationSpecToContextMarkdown,
  operationSpecToFullMarkdown,
  operationSpecToAgentPrompt,
  featureToMarkdown,
  presentationToMarkdown,
  eventToMarkdown,
  docBlockToMarkdown,
  exportSpec,
  exportFeature,
} from './exporters';

// Prompts
export {
  AGENT_SYSTEM_PROMPTS,
  generateImplementationPrompt,
  generateTestPrompt,
  generateReviewPrompt,
  generateVerificationPrompt,
  generateImplementationPlan,
  formatPlanForAgent,
  generateFixViolationsPrompt,
} from './prompts';
