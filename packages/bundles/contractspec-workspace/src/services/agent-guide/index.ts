/**
 * Agent Guide Service
 * 
 * Provides tools for generating implementation guidance for AI coding agents.
 * Supports multiple agent types: Claude Code, Cursor CLI, and generic MCP agents.
 * 
 * @module @lssm/bundle.contractspec-workspace/services/agent-guide
 */

// Types
export type {
  AgentGuideConfig,
  GuideOptions,
  FormatOptions,
  GuideResult,
  AgentAdapter,
  VerifyInput,
  VerificationResult,
} from './types';

// Service
export {
  AgentGuideService,
  createAgentGuideService,
  agentGuideService,
} from './agent-guide-service';

// Adapters
export {
  ClaudeCodeAdapter,
  claudeCodeAdapter,
  CursorCLIAdapter,
  cursorCLIAdapter,
  GenericMCPAdapter,
  genericMCPAdapter,
  agentAdapters,
  getAgentAdapter,
  listAgentTypes,
} from './adapters';

