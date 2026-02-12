// Main exports
export * from './agent';
export * from './spec';
export * from './types';

// Sub-module exports
export * from './tools';
export * from './schema';
export * from './knowledge';
export * from './session';
export * from './telemetry';
export * from './approval';
export * from './i18n';

// External SDK integration
export * from './providers';
export * from './exporters';
export * from './interop';

// Re-export commonly used AI SDK types for convenience
export type {
  LanguageModel,
  Tool,
  ModelMessage,
  StepResult,
  LanguageModelUsage,
  ToolSet,
  generateText,
} from 'ai';

// Re-export AI SDK v6 Agent
export { Experimental_Agent as ToolLoopAgent } from 'ai';
