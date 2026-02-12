/**
 * Typed message keys for the ai-agent i18n system.
 *
 * All translatable strings in the package are referenced by these keys.
 * Organized by domain: agent, knowledge, tool, error, export, provider, interop, approval, log.
 *
 * @module i18n/keys
 */

// ─────────────────────────────────────────────────────────────────────────────
// LLM System Prompts & Instructions
// ─────────────────────────────────────────────────────────────────────────────

export const AGENT_KEYS = {
  /** JSON runner: "You MUST output valid JSON ONLY." */
  'agent.json.rules.validJsonOnly': 'agent.json.rules.validJsonOnly',
  /** JSON runner: "Do not wrap the output in markdown fences." */
  'agent.json.rules.noMarkdownFences': 'agent.json.rules.noMarkdownFences',
  /** JSON runner: "Do not include commentary or explanation." */
  'agent.json.rules.noCommentary': 'agent.json.rules.noCommentary',
  /** JSON runner: "Use double quotes for all keys and string values." */
  'agent.json.rules.doubleQuotes': 'agent.json.rules.doubleQuotes',
  /** JSON runner: "Do not include trailing commas." */
  'agent.json.rules.noTrailingCommas': 'agent.json.rules.noTrailingCommas',
  /** JSON runner default spec description */
  'agent.json.defaultDescription': 'agent.json.defaultDescription',
  /** JSON runner default system prompt */
  'agent.json.systemPrompt': 'agent.json.systemPrompt',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Knowledge Injection
// ─────────────────────────────────────────────────────────────────────────────

export const KNOWLEDGE_KEYS = {
  /** "# Reference Knowledge" */
  'knowledge.header': 'knowledge.header',
  /** "The following information is provided for your reference..." */
  'knowledge.description': 'knowledge.description',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Tool Descriptions (LLM-facing)
// ─────────────────────────────────────────────────────────────────────────────

export const TOOL_KEYS = {
  /** Knowledge tool main description */
  'tool.knowledge.description': 'tool.knowledge.description',
  /** "Available knowledge spaces:" */
  'tool.knowledge.availableSpaces': 'tool.knowledge.availableSpaces',
  /** "Knowledge space" fallback description */
  'tool.knowledge.spaceDefault': 'tool.knowledge.spaceDefault',
  /** "The question or search query to find relevant information" */
  'tool.knowledge.param.query': 'tool.knowledge.param.query',
  /** "Specific knowledge space to query..." */
  'tool.knowledge.param.spaceKey': 'tool.knowledge.param.spaceKey',
  /** "Maximum number of results to return" */
  'tool.knowledge.param.topK': 'tool.knowledge.param.topK',
  /** "No relevant information found..." */
  'tool.knowledge.noResults': 'tool.knowledge.noResults',
  /** "[Source {index} - {space}] (relevance: {score}%)" */
  'tool.knowledge.sourceLabel': 'tool.knowledge.sourceLabel',
  /** "Execute {name}" fallback tool description */
  'tool.fallbackDescription': 'tool.fallbackDescription',
  /** "The message or query to send to the agent" */
  'tool.mcp.param.message': 'tool.mcp.param.message',
  /** "Optional session ID to continue a conversation" */
  'tool.mcp.param.sessionId': 'tool.mcp.param.sessionId',
  /** "Interact with {key} agent" */
  'tool.mcp.agentDescription': 'tool.mcp.agentDescription',
  /** "Execute the {name} tool with the following arguments: {args}" */
  'tool.mcp.executePrompt': 'tool.mcp.executePrompt',
  /** "Execute {name} tool" */
  'tool.mcp.toolDescription': 'tool.mcp.toolDescription',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Interop / Spec Consumer (LLM Prompts)
// ─────────────────────────────────────────────────────────────────────────────

export const INTEROP_KEYS = {
  /** "# Agent Identity" */
  'interop.prompt.agentIdentity': 'interop.prompt.agentIdentity',
  /** "You are {key} (v{version})." */
  'interop.prompt.youAre': 'interop.prompt.youAre',
  /** "## Description" */
  'interop.prompt.description': 'interop.prompt.description',
  /** "## Instructions" */
  'interop.prompt.instructions': 'interop.prompt.instructions',
  /** "## Available Tools" */
  'interop.prompt.availableTools': 'interop.prompt.availableTools',
  /** "You have access to the following tools:" */
  'interop.prompt.toolsIntro': 'interop.prompt.toolsIntro',
  /** "Parameters:" */
  'interop.prompt.parameters': 'interop.prompt.parameters',
  /** "## Knowledge Context" */
  'interop.prompt.knowledgeContext': 'interop.prompt.knowledgeContext',
  /** "## Additional Context" */
  'interop.prompt.additionalContext': 'interop.prompt.additionalContext',

  /** Markdown: "## Table of Contents" */
  'interop.md.toc': 'interop.md.toc',
  /** Markdown: "## Overview" */
  'interop.md.overview': 'interop.md.overview',
  /** Markdown: "## Tools" */
  'interop.md.tools': 'interop.md.tools',
  /** Markdown: "## Knowledge" */
  'interop.md.knowledge': 'interop.md.knowledge',
  /** Markdown: "## Policy" */
  'interop.md.policy': 'interop.md.policy',

  /** "- **Key**: {key}" */
  'interop.md.metaKey': 'interop.md.metaKey',
  /** "- **Version**: {version}" */
  'interop.md.metaVersion': 'interop.md.metaVersion',
  /** "- **Stability**: {stability}" */
  'interop.md.metaStability': 'interop.md.metaStability',
  /** "- **Owners**: {owners}" */
  'interop.md.metaOwners': 'interop.md.metaOwners',
  /** "- **Tags**: {tags}" */
  'interop.md.metaTags': 'interop.md.metaTags',
  /** "**Schema:**" */
  'interop.md.schema': 'interop.md.schema',
  /** "**Automation Safe**: Yes/No" */
  'interop.md.automationSafe': 'interop.md.automationSafe',
  /** "(required)" */
  'interop.md.required': 'interop.md.required',
  /** "(optional)" */
  'interop.md.optional': 'interop.md.optional',
  /** "- **Minimum Confidence**: {min}" */
  'interop.md.minConfidence': 'interop.md.minConfidence',
  /** "- **Escalation Threshold**: {threshold}" */
  'interop.md.escalationThreshold': 'interop.md.escalationThreshold',
  /** "- **Escalate on Tool Failure**: Yes" */
  'interop.md.escalateToolFailure': 'interop.md.escalateToolFailure',
  /** "- **Escalate on Timeout**: Yes" */
  'interop.md.escalateTimeout': 'interop.md.escalateTimeout',
  /** "Yes" */
  'interop.md.yes': 'interop.md.yes',
  /** "No" */
  'interop.md.no': 'interop.md.no',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Error Messages
// ─────────────────────────────────────────────────────────────────────────────

export const ERROR_KEYS = {
  /** "createAgentJsonRunner requires a model or provider config" */
  'error.jsonRunner.requiresModel': 'error.jsonRunner.requiresModel',
  /** "Missing handler for tool: {name}" */
  'error.missingToolHandler': 'error.missingToolHandler',
  /** "Unknown backend: {backend}" */
  'error.unknownBackend': 'error.unknownBackend',
  /** "Claude Agent SDK not available. Install @anthropic-ai/claude-agent-sdk" */
  'error.claudeSdk.notAvailable': 'error.claudeSdk.notAvailable',
  /** "Claude Agent SDK not installed. Run: npm install @anthropic-ai/claude-agent-sdk" */
  'error.claudeSdk.notInstalled': 'error.claudeSdk.notInstalled',
  /** "OpenCode SDK not available. Install @opencode-ai/sdk" */
  'error.opencodeSdk.notAvailable': 'error.opencodeSdk.notAvailable',
  /** "OpenCode SDK not installed. Run: npm install @opencode-ai/sdk" */
  'error.opencodeSdk.notInstalled': 'error.opencodeSdk.notInstalled',
  /** "Provider not initialized" */
  'error.providerNotInitialized': 'error.providerNotInitialized',
  /** "Agent key is required" */
  'error.agentKeyRequired': 'error.agentKeyRequired',
  /** "Agent {key} is missing a string version" */
  'error.agentMissingVersion': 'error.agentMissingVersion',
  /** "Agent {key} requires instructions" */
  'error.agentRequiresInstructions': 'error.agentRequiresInstructions',
  /** "Agent {key} must expose at least one tool" */
  'error.agentRequiresTool': 'error.agentRequiresTool',
  /** "Agent {key} has duplicate tool name: {name}" */
  'error.agentDuplicateTool': 'error.agentDuplicateTool',
  /** "Agent spec not found for {name}" */
  'error.agentSpecNotFound': 'error.agentSpecNotFound',
  /** "Spec not found: {specKey}" */
  'error.specNotFound': 'error.specNotFound',
  /** "Tool not found: {name}" */
  'error.toolNotFound': 'error.toolNotFound',
  /** "No handler registered for tool: {name}" */
  'error.noHandlerForTool': 'error.noHandlerForTool',
  /** "No handler for tool: {name}" */
  'error.noToolHandler': 'error.noToolHandler',
  /** "Unknown export format: {format}" */
  'error.unknownExportFormat': 'error.unknownExportFormat',
  /** "Handler not found for tool {name}" */
  'error.handlerNotFoundForTool': 'error.handlerNotFoundForTool',
  /** "Tool '{name}' not found or has no handler" */
  'error.toolNotFoundOrNoHandler': 'error.toolNotFoundOrNoHandler',
  /** "Tool {name} has no execute handler" */
  'error.toolNoExecuteHandler': 'error.toolNoExecuteHandler',
  /** "not registered" */
  'error.provider.notRegistered': 'error.provider.notRegistered',
  /** "dependencies not installed or not configured" */
  'error.provider.depsNotInstalled': 'error.provider.depsNotInstalled',
  /** "SDK not installed or API key not configured" */
  'error.provider.sdkNotConfigured': 'error.provider.sdkNotConfigured',
  /** "@anthropic-ai/claude-agent-sdk is not installed" */
  'error.provider.claudeSdkMissing': 'error.provider.claudeSdkMissing',
  /** "@opencode-ai/sdk is not installed" */
  'error.provider.opencodeSdkMissing': 'error.provider.opencodeSdkMissing',
  /** "SDK not installed" */
  'error.provider.sdkNotInstalled': 'error.provider.sdkNotInstalled',
  /** "Failed to create context: {error}" */
  'error.provider.contextCreation': 'error.provider.contextCreation',
  /** "Execution failed: {error}" */
  'error.provider.executionFailed': 'error.provider.executionFailed',
  /** "Stream failed: {error}" */
  'error.provider.streamFailed': 'error.provider.streamFailed',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Exporter Strings (Markdown generation)
// ─────────────────────────────────────────────────────────────────────────────

export const EXPORT_KEYS = {
  /** "# Agent Configuration" */
  'export.agentConfiguration': 'export.agentConfiguration',
  /** "## Metadata" */
  'export.metadata': 'export.metadata',
  /** "- **Name**: {name}" */
  'export.metaName': 'export.metaName',
  /** "- **Version**: {version}" */
  'export.metaVersion': 'export.metaVersion',
  /** "- **Owners**: {owners}" */
  'export.metaOwners': 'export.metaOwners',
  /** "- **Model**: {model}" */
  'export.metaModel': 'export.metaModel',
  /** "## Instructions" */
  'export.instructions': 'export.instructions',
  /** "## Available Tools" */
  'export.availableTools': 'export.availableTools',
  /** "## Tools" */
  'export.tools': 'export.tools',
  /** "## Knowledge Sources" */
  'export.knowledgeSources': 'export.knowledgeSources',
  /** "## Policy" */
  'export.policy': 'export.policy',
  /** "## Additional Context" */
  'export.additionalContext': 'export.additionalContext',
  /** "## Configuration" */
  'export.configuration': 'export.configuration',
  /** "## MCP Servers" */
  'export.mcpServers': 'export.mcpServers',
  /** "**Parameters:**" */
  'export.parameters': 'export.parameters',
  /** "requires approval" */
  'export.requiresApproval': 'export.requiresApproval',
  /** "not automation safe" */
  'export.notAutomationSafe': 'export.notAutomationSafe',
  /** "*(requires approval)*" */
  'export.requiresApprovalMd': 'export.requiresApprovalMd',
  /** "*(not automation safe)*" */
  'export.notAutomationSafeMd': 'export.notAutomationSafeMd',
  /** "(required)" */
  'export.required': 'export.required',
  /** "(optional)" */
  'export.optional': 'export.optional',
  /** "- Minimum confidence: {min}" */
  'export.minConfidence': 'export.minConfidence',
  /** "- Escalation policy is configured" */
  'export.escalationConfigured': 'export.escalationConfigured',
  /** "- Escalation policy configured" */
  'export.escalationPolicyConfigured': 'export.escalationPolicyConfigured',
  /** "- Feature flags: {flags}" */
  'export.featureFlags': 'export.featureFlags',
  /** "*Generated from ContractSpec: {key}*" */
  'export.generatedFrom': 'export.generatedFrom',
  /** "*Exported at: {date}*" */
  'export.exportedAt': 'export.exportedAt',
  /** "> Agent type: **{type}**" */
  'export.agentType': 'export.agentType',
  /** "No description" fallback */
  'export.noDescription': 'export.noDescription',

  // Validation
  /** "Spec must have a meta.key" */
  'export.validation.requiresKey': 'export.validation.requiresKey',
  /** "Spec must have instructions" */
  'export.validation.requiresInstructions':
    'export.validation.requiresInstructions',
  /** "Spec must have at least one tool" */
  'export.validation.requiresTool': 'export.validation.requiresTool',
  /** "All tools must have a name" */
  'export.validation.toolRequiresName': 'export.validation.toolRequiresName',
  /** "Tool must have a description or name" */
  'export.validation.toolRequiresDescOrName':
    'export.validation.toolRequiresDescOrName',
  /** "Tool name '{name}' should be a valid identifier..." */
  'export.validation.toolInvalidName': 'export.validation.toolInvalidName',

  // Agent type descriptions
  /** "Primary agent with full tool access for code generation and modification." */
  'export.agentType.build': 'export.agentType.build',
  /** "Restricted agent for analysis and planning..." */
  'export.agentType.plan': 'export.agentType.plan',
  /** "General-purpose subagent for complex questions..." */
  'export.agentType.general': 'export.agentType.general',
  /** "Fast subagent optimized for codebase exploration..." */
  'export.agentType.explore': 'export.agentType.explore',

  // Agent bridge markdown labels
  /** "(requires approval)" */
  'export.bridge.requiresApproval': 'export.bridge.requiresApproval',
  /** "(ask mode)" */
  'export.bridge.askMode': 'export.bridge.askMode',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Approval Workflow
// ─────────────────────────────────────────────────────────────────────────────

export const APPROVAL_KEYS = {
  /** 'Tool "{name}" requires approval' */
  'approval.toolRequiresApproval': 'approval.toolRequiresApproval',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Console / Log Messages
// ─────────────────────────────────────────────────────────────────────────────

export const LOG_KEYS = {
  /** "[UnifiedAgent] {backend} failed, falling back to {fallback}" */
  'log.unifiedAgent.fallback': 'log.unifiedAgent.fallback',
  /** 'Required knowledge space "{key}" is not available' */
  'log.knowledge.spaceNotAvailable': 'log.knowledge.spaceNotAvailable',
  /** 'Failed to load required knowledge "{key}": ...' */
  'log.knowledge.loadFailed': 'log.knowledge.loadFailed',
  /** "Failed to query knowledge space {space}: ..." */
  'log.knowledge.queryFailed': 'log.knowledge.queryFailed',
  /** "[MCPToolServer] Started {name}@{version} with {count} tools" */
  'log.mcpServer.started': 'log.mcpServer.started',
  /** "[MCPToolServer] Stopped {name}" */
  'log.mcpServer.stopped': 'log.mcpServer.stopped',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Combined Keys
// ─────────────────────────────────────────────────────────────────────────────

export const I18N_KEYS = {
  ...AGENT_KEYS,
  ...KNOWLEDGE_KEYS,
  ...TOOL_KEYS,
  ...INTEROP_KEYS,
  ...ERROR_KEYS,
  ...EXPORT_KEYS,
  ...APPROVAL_KEYS,
  ...LOG_KEYS,
} as const;

/** Union type of all message keys */
export type AgentMessageKey = keyof typeof I18N_KEYS;
