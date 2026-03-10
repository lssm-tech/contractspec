# Memory tools

Memory tools let the model store and recall information across conversations. Distinct from `AgentMemoryManager` (session summarization).

## Anthropic memory

When using Anthropic models, set `memoryTools: { provider: 'anthropic' }` in `AgentSpec` and provide `agentMemoryStore` to `ContractSpecAgent.create`. The tool uses `anthropic.tools.memory_20250818` with commands: view, create, str_replace, insert, delete, rename.

## Storage backends

- `InMemoryAgentMemoryStore` — for development and testing.
- Ephemeral knowledge space — when using knowledge-backed storage, set `memoryTools.spaceKey` to an ephemeral `KnowledgeSpaceSpec` key. Configure `KnowledgeAccessGuard` with `disallowWriteCategories: ['external']` to allow ephemeral writes.

## Custom memory (operation-backed)

For `provider: 'custom'`, define operations `memory.view`, `memory.create`, etc. and add tools via `operationRef`. Handlers use `AgentMemoryStore` or `EphemeralKnowledgeBackend`.

## Optional memory providers

These are optional add-ons; no first-class `AgentSpec` fields. Consumers add them to agent tools or model.

- **Mem0** (`@mem0/vercel-ai-provider`): Wraps any LLM with memory. Use `createMem0()` and pass as model. [Mem0 provider docs](https://ai-sdk.dev/providers/community-providers/mem0).
- **Hindsight** (`@vectorize-io/hindsight-ai-sdk`): Tools `retain`, `recall`, `reflect`, etc. Use `createHindsightTools()` and add to agent tools. [Hindsight provider docs](https://ai-sdk.dev/providers/community-providers/hindsight).

## References

- [AI SDK Memory](https://ai-sdk.dev/docs/agents/memory)
- [Anthropic Memory Tool](https://console.anthropic.com/docs/en/agents-and-tools/tool-use/memory-tool)
