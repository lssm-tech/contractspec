# Agent Adapters

ContractSpec provides specialized adapters for different AI coding agents.

## Claude Code Adapter

Optimized for Anthropic Claude's extended thinking and code generation.

Features:
- Structured markdown with clear sections
- Checklists for steps and verification
- Icons for file operations (📝 create, ✏️ modify)
- System prompt for ContractSpec context

Usage:
```typescript
const guideService = createAgentGuideService({ defaultAgent: 'claude-code' });
const result = guideService.generateGuide(spec, { agent: 'claude-code' });
// result.prompt.systemPrompt - Claude system context
// result.prompt.taskPrompt - Task-specific instructions
```

## Cursor CLI Adapter

Optimized for Cursor's background/composer mode.

Features:
- Compact format for context efficiency
- .mdc cursor rules generation
- Integration with Cursor's file system
- Concise step lists

Generate Cursor Rules:
```typescript
const cursorRules = guideService.generateAgentConfig(spec, 'cursor-cli');
// Save to .cursor/rules/my-spec.mdc
```

## Generic MCP Adapter

Works with any MCP-compatible agent (Cline, Aider, etc.).

Features:
- Standard markdown format
- Table-based metadata
- JSON resource format support
- Prompt message format

The generic adapter is the default and works across all agents.

## Choosing an Adapter

| Agent | Best For | Key Features |
|-------|----------|--------------|
| Claude Code | Complex implementations | Extended thinking, detailed steps |
| Cursor CLI | IDE-integrated work | Cursor rules, compact format |
| Generic MCP | Any MCP agent | Universal compatibility |
