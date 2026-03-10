# Subagents

Agents can delegate work to subagents via `subagentRef` on `AgentToolConfig`. The main agent acts as an orchestrator; subagent tools act as workers.

## Usage

1. Register subagents in `subagentRegistry` (Map of agentId → ToolLoopAgent).
2. In `AgentSpec.tools`, add `{ name: 'research', subagentRef: { agentId: 'research-agent', toModelSummary: true } }`.
3. Pass `subagentRegistry` to `ContractSpecAgent.create` or `createAgentFactory`.

## Streaming

Subagent tools use `createSubagentTool` which streams `UIMessage` parts back to the orchestrator. The tool adapter supports `AsyncGenerator` handlers for preliminary results.

## Passing conversation history

Opt-in via `passConversationHistory: true` on `SubagentRef`. Defeats context isolation; use sparingly. Requires the subagent to support `generate({ messages })` (e.g. ToolLoopAgent, ContractSpecAgent). Streaming is disabled when history is passed.

## Execution model

The model may invoke multiple subagent tools in a single turn. Tool calls are executed sequentially by the agent loop (not truly parallel). For parallel execution, the model would need to call tools in separate turns or use a different orchestration pattern.

## Caveats

Subagent tools cannot use `needsApproval`. `requiresApproval` and `automationSafe` on `AgentToolConfig` are ignored when `subagentRef` is set (AI SDK limitation).

## References

- [AI SDK Subagents](https://ai-sdk.dev/docs/agents/subagents)
- [AI SDK Workflows (orchestrator-worker)](https://ai-sdk.dev/docs/agents/workflows#orchestrator-worker)
