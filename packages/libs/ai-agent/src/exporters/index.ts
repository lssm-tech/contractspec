/**
 * Spec exporters for ContractSpec agents.
 *
 * Exporters convert ContractSpec AgentSpec definitions into formats
 * compatible with external agent SDKs.
 *
 * @example
 * ```typescript
 * import {
 *   exportToClaudeAgent,
 *   exportToOpenCode,
 * } from '@contractspec/lib.ai-agent/exporters';
 *
 * // Export to Claude Agent SDK format
 * const claudeResult = exportToClaudeAgent(agentSpec, {
 *   generateClaudeMd: true,
 * });
 *
 * // Export to OpenCode SDK format
 * const openCodeResult = exportToOpenCode(agentSpec, {
 *   agentType: 'build',
 * });
 * ```
 */

// Types
export * from './types';

// Claude Agent SDK exporter
export {
  ClaudeAgentExporter,
  exportToClaudeAgent,
  generateClaudeMd,
  validateForClaudeAgent,
} from './claude-agent-exporter';

// OpenCode SDK exporter
export {
  OpenCodeExporter,
  exportToOpenCode,
  generateOpenCodeMarkdown,
  generateOpenCodeJSON,
  validateForOpenCode,
} from './opencode-exporter';
