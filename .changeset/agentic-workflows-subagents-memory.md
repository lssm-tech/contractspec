---
"@contractspec/lib.ai-agent": minor
"@contractspec/lib.contracts-spec": minor
"@contractspec/module.ai-chat": minor
---

feat(agents): agentic workflows — subagents, memory tools, and next steps

- **Subagents**: `createSubagentTool`, async generator execute, `SubagentRef`, streaming + toModelOutput
- **Memory tools**: `AgentMemoryStore`, `InMemoryAgentMemoryStore`, `createAnthropicMemoryTool`, `memoryTools` + `agentMemoryStore` config
- **needsApproval**: Validation warning when subagent has requiresApproval/automationSafe (AI SDK limitation)
- **passConversationHistory**: Opt-in `SubagentRef.passConversationHistory`; subagent `generate({ messages })` support
- **DocBlocks**: Subagent caveats, execution model, Mem0/Hindsight optional add-ons; knowledge agent memory
- **ai-chat**: `preliminary`/`nestedParts` on ChatToolCall; UIMessagePartRenderer for nested subagent output
