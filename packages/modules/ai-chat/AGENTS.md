# AI Agent Guide -- `@contractspec/module.ai-chat`

Scope: `packages/modules/ai-chat/*`

AI chat interface module providing conversational UI components, hooks, and provider integrations for ContractSpec applications.

## Quick Context

- **Layer**: module
- **Consumers**: bundles (contractspec-studio), apps (web-landing, cli)

## Public Exports

- `.` -- root barrel (entities, types, re-exports)
- `./context` -- chat context providers and state
- `./core` -- core chat logic, message handling, agent-adapter, workflow-tools, surface-planner-tools
- `./presentation` -- full presentation layer barrel
- `./presentation/components` -- React chat UI components (ChatMessage, ToolResultRenderer, ChatWithSidebar, etc.)
- `./presentation/hooks` -- React hooks for chat state (useChat with mcpServers, agentMode)
- `./providers` -- AI provider adapters
- `./adapters` -- createAiSdkBundleAdapter for surface-runtime

## Key Capabilities

- **Presentation/Form rendering**: Pass `presentationRenderer` and `formRenderer` to `ChatWithSidebar`; tool results with `presentationKey` or `formKey` render via host-provided components
- **MCP tools**: Pass `mcpServers` (McpClientConfig[]) to `useChat`; tools from MCP servers are merged into chat tools
- **Agent mode**: Pass `agentMode: { agent: ChatAgentAdapter }`; use `createChatAgentAdapter` to wrap `ContractSpecAgent`; chat uses agent for generation instead of ChatService
- **Contracts context**: `contractsContext` exposes agent, data-views, operations, forms, presentations
- **Surface-runtime**: `surfacePlanConfig` enables propose-patch tool; `createAiSdkBundleAdapter` for planner integration

## Guardrails

- Depends on `lib.ai-agent`, `lib.ai-providers`, `lib.contracts-spec`, `lib.schema`, `lib.metering`, `lib.cost-tracking`, `lib.surface-runtime`
- React peer dependency (>=19.2.4); changes here affect all chat surfaces
- Metering and cost-tracking are wired in -- never bypass them

## Local Commands

- Build: `bun run build`
- Test: `bun test`
- Lint: `bun run lint`
- Dev: `bun run dev`
