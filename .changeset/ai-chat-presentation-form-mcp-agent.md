---
"@contractspec/module.ai-chat": minor
---

feat(ai-chat): presentation/form rendering, MCP tools, agent mode

- **Presentation/Form rendering**: Host-driven `presentationRenderer` and `formRenderer` for tool results with `presentationKey` or `formKey`; `ToolResultRenderer` component
- **MCP tools**: `mcpServers` option on `useChat`; tools from `createMcpToolsets` merged into chat; cleanup on unmount
- **Agent mode**: `agentMode: { agent }` with `ChatAgentAdapter`; `createChatAgentAdapter` to wrap `ContractSpecAgent`; chat uses agent for generation instead of ChatService
- Exports: `ToolResultRenderer`, `isPresentationToolResult`, `isFormToolResult`, `createChatAgentAdapter`, `ChatAgentAdapter`
