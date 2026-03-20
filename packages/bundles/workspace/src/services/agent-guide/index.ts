/**
 * Agent Guide Service
 *
 * Provides tools for generating implementation guidance for AI coding agents.
 * Supports multiple agent types: Claude Code, Cursor CLI, and generic MCP agents.
 *
 * @module @contractspec/bundle.workspace/services/agent-guide
 */

// Adapters
export {
	agentAdapters,
	ClaudeCodeAdapter,
	CursorCLIAdapter,
	claudeCodeAdapter,
	cursorCLIAdapter,
	GenericMCPAdapter,
	genericMCPAdapter,
	getAgentAdapter,
	listAgentTypes,
} from './adapters';

// Service
export {
	AgentGuideService,
	agentGuideService,
	createAgentGuideService,
} from './agent-guide-service';
// Types
export type {
	AgentAdapter,
	AgentGuideConfig,
	FormatOptions,
	GuideOptions,
	GuideResult,
} from './types';
