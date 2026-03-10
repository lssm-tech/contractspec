# @contractspec/example.ai-chat-assistant

## 3.6.0

### Minor Changes

- 44b46cd: feat(examples): full AI chat example with MCP, reasoning, and contracts
  - **example.ai-chat-assistant**: New focused template with ChatWithSidebar, assistant.search contract, mock handlers, and sandbox
  - **integration-hub**: Add Chat tab with IntegrationHubChat (reasoning, CoT, sources, suggestions, optional MCP)
  - **web-landing**: Add /api/chat route (createChatRoute), wire both examples in sandbox
  - **module.examples**: Register ai-chat-assistant in builtins

- ea320ea: feat: ai-chat tooling

### Patch Changes

- Updated dependencies [6e3fe40]
- Updated dependencies [ea320ea]
- Updated dependencies [9d55d95]
  - @contractspec/lib.ai-agent@6.0.0
  - @contractspec/lib.contracts-spec@3.6.0
  - @contractspec/module.ai-chat@4.2.0
  - @contractspec/lib.schema@3.6.0
