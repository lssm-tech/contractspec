/**
 * LLM Integration Module
 *
 * Provides tools for exporting ContractSpec artifacts to LLM-friendly formats,
 * generating implementation prompts for AI coding agents, and verifying
 * implementations against specifications.
 *
 * @module @contractspec/lib.contracts-spec/llm
 */
// Exporters
export {
	docBlockToMarkdown,
	eventToMarkdown,
	exportFeature,
	exportSpec,
	featureToMarkdown,
	operationSpecToAgentPrompt,
	operationSpecToContextMarkdown,
	operationSpecToFullMarkdown,
	presentationToMarkdown,
} from './exporters';
// Prompts
export {
	AGENT_SYSTEM_PROMPTS,
	formatPlanForAgent,
	generateFixViolationsPrompt,
	generateImplementationPlan,
	generateImplementationPrompt,
	generateReviewPrompt,
	generateTestPrompt,
	generateVerificationPrompt,
} from './prompts';
// Types
export type {
	AgentPrompt,
	AgentType,
	BatchExportOptions,
	ExportableItem,
	FeatureExportOptions,
	FeatureExportResult,
	FeatureLookup,
	ImplementationPlan,
	LLMExportFormat,
	SpecExportOptions,
	SpecExportResult,
	SpecLookup,
	VerificationIssue,
	VerificationReport,
	VerificationTier,
} from './types';
