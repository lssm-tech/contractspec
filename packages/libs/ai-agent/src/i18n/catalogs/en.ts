/**
 * English (en) translation catalog for @contractspec/lib.ai-agent.
 *
 * This is the primary / reference locale. All message keys must be present here.
 *
 * @module i18n/catalogs/en
 */

import { defineTranslation } from '@contractspec/lib.contracts-spec/translations';

export const enMessages = defineTranslation({
  meta: {
    key: 'ai-agent.messages',
    version: '1.0.0',
    domain: 'ai-agent',
    description:
      'All user-facing, LLM-facing, and developer-facing strings for the ai-agent package',
    owners: ['platform'],
    stability: 'experimental',
  },
  locale: 'en',
  fallback: 'en',
  messages: {
    // ═══════════════════════════════════════════════════════════════════════════
    // LLM System Prompts & Instructions
    // ═══════════════════════════════════════════════════════════════════════════

    'agent.json.rules.validJsonOnly': {
      value: 'You MUST output valid JSON ONLY.',
      description: 'JSON runner rule: output must be valid JSON',
    },
    'agent.json.rules.noMarkdownFences': {
      value: 'Do not wrap the output in markdown fences.',
      description: 'JSON runner rule: no markdown code fences',
    },
    'agent.json.rules.noCommentary': {
      value: 'Do not include commentary or explanation.',
      description: 'JSON runner rule: no extra text',
    },
    'agent.json.rules.doubleQuotes': {
      value: 'Use double quotes for all keys and string values.',
      description: 'JSON runner rule: double quotes only',
    },
    'agent.json.rules.noTrailingCommas': {
      value: 'Do not include trailing commas.',
      description: 'JSON runner rule: no trailing commas',
    },
    'agent.json.defaultDescription': {
      value: 'JSON-only agent runner for deterministic pipelines.',
      description: 'Default description for the JSON runner spec',
    },
    'agent.json.systemPrompt': {
      value: 'You are a precise JSON generator.',
      description: 'Default system prompt for the JSON runner',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Knowledge Injection
    // ═══════════════════════════════════════════════════════════════════════════

    'knowledge.header': {
      value: '# Reference Knowledge',
      description: 'Header for injected knowledge section in system prompt',
    },
    'knowledge.description': {
      value:
        'The following information is provided for your reference. Use it to inform your responses.',
      description: 'Description below the knowledge header',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Tool Descriptions (LLM-facing)
    // ═══════════════════════════════════════════════════════════════════════════

    'tool.knowledge.description': {
      value:
        'Query knowledge bases for relevant information. Use this tool when you need to look up specific information that may not be in your context.',
      description: 'Description for the knowledge query tool shown to the LLM',
    },
    'tool.knowledge.availableSpaces': {
      value: 'Available knowledge spaces:',
      description: 'Label before listing available knowledge spaces',
    },
    'tool.knowledge.spaceDefault': {
      value: 'Knowledge space',
      description: 'Fallback description for unnamed knowledge spaces',
    },
    'tool.knowledge.param.query': {
      value: 'The question or search query to find relevant information',
      description: 'Parameter description for the query field',
    },
    'tool.knowledge.param.spaceKey': {
      value:
        'Specific knowledge space to query. If omitted, searches all available spaces.',
      description: 'Parameter description for the spaceKey field',
    },
    'tool.knowledge.param.topK': {
      value: 'Maximum number of results to return',
      description: 'Parameter description for the topK field',
    },
    'tool.knowledge.noResults': {
      value: 'No relevant information found in the knowledge bases.',
      description: 'Message when no knowledge results are found',
    },
    'tool.knowledge.sourceLabel': {
      value: '[Source {index} - {space}] (relevance: {score}%)',
      description: 'Label for each knowledge search result',
      placeholders: [
        { name: 'index', type: 'number', description: '1-based source index' },
        { name: 'space', type: 'string', description: 'Knowledge space name' },
        { name: 'score', type: 'number', description: 'Relevance percentage' },
      ],
    },
    'tool.fallbackDescription': {
      value: 'Execute {name}',
      description:
        'Fallback description when a tool has no explicit description',
      placeholders: [
        { name: 'name', type: 'string', description: 'Tool name' },
      ],
    },
    'tool.mcp.param.message': {
      value: 'The message or query to send to the agent',
      description: 'MCP server: message parameter description',
    },
    'tool.mcp.param.sessionId': {
      value: 'Optional session ID to continue a conversation',
      description: 'MCP server: sessionId parameter description',
    },
    'tool.mcp.agentDescription': {
      value: 'Interact with {key} agent',
      description: 'MCP server: agent tool description',
      placeholders: [
        { name: 'key', type: 'string', description: 'Agent spec key' },
      ],
    },
    'tool.mcp.executePrompt': {
      value: 'Execute the {name} tool with the following arguments: {args}',
      description: 'MCP server: prompt sent when executing an individual tool',
      placeholders: [
        { name: 'name', type: 'string', description: 'Tool name' },
        {
          name: 'args',
          type: 'string',
          description: 'JSON-stringified arguments',
        },
      ],
    },
    'tool.mcp.toolDescription': {
      value: 'Execute {name} tool',
      description: 'MCP server: individual tool description',
      placeholders: [
        { name: 'name', type: 'string', description: 'Tool name' },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Interop / Spec Consumer (LLM Prompts)
    // ═══════════════════════════════════════════════════════════════════════════

    'interop.prompt.agentIdentity': {
      value: '# Agent Identity',
      description: 'Section header for agent identity in LLM prompt',
    },
    'interop.prompt.youAre': {
      value: 'You are {key} (v{version}).',
      description: 'Agent identity statement in LLM prompt',
      placeholders: [
        { name: 'key', type: 'string' },
        { name: 'version', type: 'string' },
      ],
    },
    'interop.prompt.description': {
      value: '## Description',
      description: 'Section header for description',
    },
    'interop.prompt.instructions': {
      value: '## Instructions',
      description: 'Section header for instructions',
    },
    'interop.prompt.availableTools': {
      value: '## Available Tools',
      description: 'Section header for available tools',
    },
    'interop.prompt.toolsIntro': {
      value: 'You have access to the following tools:',
      description: 'Introduction before listing tools',
    },
    'interop.prompt.parameters': {
      value: 'Parameters:',
      description: 'Label before tool parameters block',
    },
    'interop.prompt.knowledgeContext': {
      value: '## Knowledge Context',
      description: 'Section header for knowledge context',
    },
    'interop.prompt.additionalContext': {
      value: '## Additional Context',
      description: 'Section header for additional context',
    },

    // Markdown generation (spec-consumer)
    'interop.md.toc': {
      value: '## Table of Contents',
      description: 'TOC header',
    },
    'interop.md.overview': {
      value: '## Overview',
      description: 'Overview header',
    },
    'interop.md.tools': { value: '## Tools', description: 'Tools header' },
    'interop.md.knowledge': {
      value: '## Knowledge',
      description: 'Knowledge header',
    },
    'interop.md.policy': { value: '## Policy', description: 'Policy header' },
    'interop.md.metaKey': {
      value: '- **Key**: `{key}`',
      description: 'Metadata line for key',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'interop.md.metaVersion': {
      value: '- **Version**: {version}',
      description: 'Metadata line for version',
      placeholders: [{ name: 'version', type: 'string' }],
    },
    'interop.md.metaStability': {
      value: '- **Stability**: {stability}',
      description: 'Metadata line for stability',
      placeholders: [{ name: 'stability', type: 'string' }],
    },
    'interop.md.metaOwners': {
      value: '- **Owners**: {owners}',
      description: 'Metadata line for owners',
      placeholders: [{ name: 'owners', type: 'string' }],
    },
    'interop.md.metaTags': {
      value: '- **Tags**: {tags}',
      description: 'Metadata line for tags',
      placeholders: [{ name: 'tags', type: 'string' }],
    },
    'interop.md.schema': { value: '**Schema:**', description: 'Schema label' },
    'interop.md.automationSafe': {
      value: '**Automation Safe**: {value}',
      description: 'Automation safe field',
      placeholders: [{ name: 'value', type: 'string' }],
    },
    'interop.md.required': {
      value: '(required)',
      description: 'Required marker',
    },
    'interop.md.optional': {
      value: '(optional)',
      description: 'Optional marker',
    },
    'interop.md.minConfidence': {
      value: '- **Minimum Confidence**: {min}',
      description: 'Minimum confidence policy line',
      placeholders: [{ name: 'min', type: 'number' }],
    },
    'interop.md.escalationThreshold': {
      value: '- **Escalation Threshold**: {threshold}',
      description: 'Escalation threshold policy line',
      placeholders: [{ name: 'threshold', type: 'number' }],
    },
    'interop.md.escalateToolFailure': {
      value: '- **Escalate on Tool Failure**: Yes',
      description: 'Escalate on tool failure policy line',
    },
    'interop.md.escalateTimeout': {
      value: '- **Escalate on Timeout**: Yes',
      description: 'Escalate on timeout policy line',
    },
    'interop.md.yes': { value: 'Yes', description: 'Yes label' },
    'interop.md.no': { value: 'No', description: 'No label' },

    // ═══════════════════════════════════════════════════════════════════════════
    // Error Messages
    // ═══════════════════════════════════════════════════════════════════════════

    'error.jsonRunner.requiresModel': {
      value: 'createAgentJsonRunner requires a model or provider config',
      description: 'Error when JSON runner has no model or provider',
    },
    'error.missingToolHandler': {
      value: 'Missing handler for tool: {name}',
      description: 'Error when a tool handler is not registered',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.unknownBackend': {
      value: 'Unknown backend: {backend}',
      description: 'Error when an unknown backend is specified',
      placeholders: [{ name: 'backend', type: 'string' }],
    },
    'error.claudeSdk.notAvailable': {
      value:
        'Claude Agent SDK not available. Install @anthropic-ai/claude-agent-sdk',
      description: 'Error when Claude Agent SDK is not available',
    },
    'error.claudeSdk.notInstalled': {
      value:
        'Claude Agent SDK not installed. Run: npm install @anthropic-ai/claude-agent-sdk',
      description: 'Error when Claude Agent SDK module is not found',
    },
    'error.opencodeSdk.notAvailable': {
      value: 'OpenCode SDK not available. Install @opencode-ai/sdk',
      description: 'Error when OpenCode SDK is not available',
    },
    'error.opencodeSdk.notInstalled': {
      value: 'OpenCode SDK not installed. Run: npm install @opencode-ai/sdk',
      description: 'Error when OpenCode SDK module is not found',
    },
    'error.providerNotInitialized': {
      value: 'Provider not initialized',
      description: 'Error when provider has not been initialized before use',
    },
    'error.agentKeyRequired': {
      value: 'Agent key is required',
      description: 'Validation error: missing agent key',
    },
    'error.agentMissingVersion': {
      value: 'Agent {key} is missing a string version',
      description: 'Validation error: version not a string',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'error.agentRequiresInstructions': {
      value: 'Agent {key} requires instructions',
      description: 'Validation error: missing instructions',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'error.agentRequiresTool': {
      value: 'Agent {key} must expose at least one tool',
      description: 'Validation error: no tools defined',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'error.agentDuplicateTool': {
      value: 'Agent {key} has duplicate tool name: {name}',
      description: 'Validation error: duplicate tool name',
      placeholders: [
        { name: 'key', type: 'string' },
        { name: 'name', type: 'string' },
      ],
    },
    'error.agentSpecNotFound': {
      value: 'Agent spec not found for {name}',
      description: 'Error when agent spec is not in the registry',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.specNotFound': {
      value: 'Spec not found: {specKey}',
      description: 'Error when a spec key is not found',
      placeholders: [{ name: 'specKey', type: 'string' }],
    },
    'error.toolNotFound': {
      value: 'Tool not found: {name}',
      description: 'Error when a tool is not found',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.noHandlerForTool': {
      value: 'No handler registered for tool: {name}',
      description: 'Error when no handler is registered for a tool',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.noToolHandler': {
      value: 'No handler for tool: {name}',
      description: 'Short error when no handler exists',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.unknownExportFormat': {
      value: 'Unknown export format: {format}',
      description: 'Error for unsupported export format',
      placeholders: [{ name: 'format', type: 'string' }],
    },
    'error.handlerNotFoundForTool': {
      value: 'Handler not found for tool {name}',
      description: 'Error in tool bridge when handler is missing',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.toolNotFoundOrNoHandler': {
      value: "Error: Tool '{name}' not found or has no handler",
      description: 'Error returned to LLM when tool execution fails',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.toolNoExecuteHandler': {
      value: 'Tool {name} has no execute handler',
      description: 'Error when tool lacks an execute function',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'error.provider.notRegistered': {
      value: 'not registered',
      description: 'Provider availability reason: not registered',
    },
    'error.provider.depsNotInstalled': {
      value: 'dependencies not installed or not configured',
      description: 'Provider availability reason: deps missing',
    },
    'error.provider.sdkNotConfigured': {
      value: 'SDK not installed or API key not configured',
      description: 'Provider availability reason: SDK or key missing',
    },
    'error.provider.claudeSdkMissing': {
      value: '@anthropic-ai/claude-agent-sdk is not installed',
      description: 'Error when Claude Agent SDK require.resolve fails',
    },
    'error.provider.opencodeSdkMissing': {
      value: '@opencode-ai/sdk is not installed',
      description: 'Error when OpenCode SDK require.resolve fails',
    },
    'error.provider.sdkNotInstalled': {
      value: 'SDK not installed',
      description: 'Generic provider error: SDK not installed',
    },
    'error.provider.contextCreation': {
      value: 'Failed to create context: {error}',
      description: 'Error during provider context creation',
      placeholders: [{ name: 'error', type: 'string' }],
    },
    'error.provider.executionFailed': {
      value: 'Execution failed: {error}',
      description: 'Error during provider execution',
      placeholders: [{ name: 'error', type: 'string' }],
    },
    'error.provider.streamFailed': {
      value: 'Stream failed: {error}',
      description: 'Error during provider streaming',
      placeholders: [{ name: 'error', type: 'string' }],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Exporter Strings (Markdown generation)
    // ═══════════════════════════════════════════════════════════════════════════

    'export.agentConfiguration': {
      value: '# Agent Configuration',
      description: 'Markdown heading',
    },
    'export.metadata': {
      value: '## Metadata',
      description: 'Markdown heading',
    },
    'export.metaName': {
      value: '- **Name**: {name}',
      description: 'Metadata line',
      placeholders: [{ name: 'name', type: 'string' }],
    },
    'export.metaVersion': {
      value: '- **Version**: {version}',
      description: 'Metadata line',
      placeholders: [{ name: 'version', type: 'string' }],
    },
    'export.metaOwners': {
      value: '- **Owners**: {owners}',
      description: 'Metadata line',
      placeholders: [{ name: 'owners', type: 'string' }],
    },
    'export.metaModel': {
      value: '- **Model**: {model}',
      description: 'Metadata line',
      placeholders: [{ name: 'model', type: 'string' }],
    },
    'export.instructions': {
      value: '## Instructions',
      description: 'Markdown heading',
    },
    'export.availableTools': {
      value: '## Available Tools',
      description: 'Markdown heading',
    },
    'export.tools': { value: '## Tools', description: 'Markdown heading' },
    'export.knowledgeSources': {
      value: '## Knowledge Sources',
      description: 'Markdown heading',
    },
    'export.policy': { value: '## Policy', description: 'Markdown heading' },
    'export.additionalContext': {
      value: '## Additional Context',
      description: 'Markdown heading',
    },
    'export.configuration': {
      value: '## Configuration',
      description: 'Markdown heading',
    },
    'export.mcpServers': {
      value: '## MCP Servers',
      description: 'Markdown heading',
    },
    'export.parameters': {
      value: '**Parameters:**',
      description: 'Parameters label',
    },
    'export.requiresApproval': {
      value: 'requires approval',
      description: 'Tool flag',
    },
    'export.notAutomationSafe': {
      value: 'not automation safe',
      description: 'Tool flag',
    },
    'export.requiresApprovalMd': {
      value: '*(requires approval)*',
      description: 'Markdown tool flag',
    },
    'export.notAutomationSafeMd': {
      value: '*(not automation safe)*',
      description: 'Markdown tool flag',
    },
    'export.required': { value: '(required)', description: 'Required marker' },
    'export.optional': { value: '(optional)', description: 'Optional marker' },
    'export.minConfidence': {
      value: '- Minimum confidence: {min}',
      description: 'Policy line',
      placeholders: [{ name: 'min', type: 'number' }],
    },
    'export.escalationConfigured': {
      value: '- Escalation policy is configured',
      description: 'Policy line for system prompt',
    },
    'export.escalationPolicyConfigured': {
      value: '- Escalation policy configured',
      description: 'Policy line for markdown export',
    },
    'export.featureFlags': {
      value: '- Feature flags: {flags}',
      description: 'Feature flags policy line',
      placeholders: [{ name: 'flags', type: 'string' }],
    },
    'export.generatedFrom': {
      value: '*Generated from ContractSpec: {key}*',
      description: 'Footer attribution line',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'export.exportedAt': {
      value: '*Exported at: {date}*',
      description: 'Footer timestamp',
      placeholders: [{ name: 'date', type: 'string' }],
    },
    'export.agentType': {
      value: '> Agent type: **{type}**',
      description: 'Agent type callout',
      placeholders: [{ name: 'type', type: 'string' }],
    },
    'export.noDescription': {
      value: 'No description',
      description: 'Fallback when tool has no description',
    },

    // Validation
    'export.validation.requiresKey': {
      value: 'Spec must have a meta.key',
      description: 'Validation error',
    },
    'export.validation.requiresInstructions': {
      value: 'Spec must have instructions',
      description: 'Validation error',
    },
    'export.validation.requiresTool': {
      value: 'Spec must have at least one tool',
      description: 'Validation error',
    },
    'export.validation.toolRequiresName': {
      value: 'All tools must have a name',
      description: 'Validation error',
    },
    'export.validation.toolRequiresDescOrName': {
      value: 'Tool must have a description or name',
      description: 'Validation error',
    },
    'export.validation.toolInvalidName': {
      value:
        "Tool name '{name}' should be a valid identifier (letters, numbers, underscores)",
      description: 'Validation error for invalid tool name',
      placeholders: [{ name: 'name', type: 'string' }],
    },

    // Agent type descriptions
    'export.agentType.build': {
      value:
        'Primary agent with full tool access for code generation and modification.',
      description: 'Build agent type description',
    },
    'export.agentType.plan': {
      value:
        'Restricted agent for analysis and planning. File edits and bash commands require approval.',
      description: 'Plan agent type description',
    },
    'export.agentType.general': {
      value:
        'General-purpose subagent for complex questions and multi-step tasks.',
      description: 'General agent type description',
    },
    'export.agentType.explore': {
      value:
        'Fast subagent optimized for codebase exploration and pattern searching.',
      description: 'Explore agent type description',
    },

    // Agent bridge markdown labels
    'export.bridge.requiresApproval': {
      value: '(requires approval)',
      description: 'Tool permission label',
    },
    'export.bridge.askMode': {
      value: '(ask mode)',
      description: 'Tool permission label',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Approval Workflow
    // ═══════════════════════════════════════════════════════════════════════════

    'approval.toolRequiresApproval': {
      value: 'Tool "{name}" requires approval',
      description: 'Default reason for tool approval requests',
      placeholders: [{ name: 'name', type: 'string' }],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // Console / Log Messages
    // ═══════════════════════════════════════════════════════════════════════════

    'log.unifiedAgent.fallback': {
      value: '[UnifiedAgent] {backend} failed, falling back to {fallback}',
      description: 'Warning when a backend fails and fallback is used',
      placeholders: [
        { name: 'backend', type: 'string' },
        { name: 'fallback', type: 'string' },
      ],
    },
    'log.knowledge.spaceNotAvailable': {
      value: 'Required knowledge space "{key}" is not available',
      description: 'Warning when a required knowledge space is missing',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'log.knowledge.loadFailed': {
      value: 'Failed to load required knowledge "{key}":',
      description: 'Warning when knowledge loading fails',
      placeholders: [{ name: 'key', type: 'string' }],
    },
    'log.knowledge.queryFailed': {
      value: 'Failed to query knowledge space {space}:',
      description: 'Warning when knowledge querying fails',
      placeholders: [{ name: 'space', type: 'string' }],
    },
    'log.mcpServer.started': {
      value: '[MCPToolServer] Started {name}@{version} with {count} tools',
      description: 'Log message when MCP tool server starts',
      placeholders: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'count', type: 'number' },
      ],
    },
    'log.mcpServer.stopped': {
      value: '[MCPToolServer] Stopped {name}',
      description: 'Log message when MCP tool server stops',
      placeholders: [{ name: 'name', type: 'string' }],
    },
  },
});
