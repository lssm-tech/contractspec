---
"@contractspec/example.ai-chat-assistant": minor
"@contractspec/example.integration-hub": minor
"@contractspec/module.examples": minor
"@contractspec/app.web-landing": minor
---

feat(examples): full AI chat example with MCP, reasoning, and contracts

- **example.ai-chat-assistant**: New focused template with ChatWithSidebar, assistant.search contract, mock handlers, and sandbox
- **integration-hub**: Add Chat tab with IntegrationHubChat (reasoning, CoT, sources, suggestions, optional MCP)
- **web-landing**: Add /api/chat route (createChatRoute), wire both examples in sandbox
- **module.examples**: Register ai-chat-assistant in builtins
