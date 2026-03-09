---
"@contractspec/module.ai-chat": minor
---

feat(ai-chat): export, conversation management, thinking levels, workflow tools

- Export: ChatWithExport, ChatExportToolbar — Markdown, TXT, JSON, copy; select messages for partial export
- Conversation management: ChatWithSidebar, useConversations, useMessageSelection — history, new, fork, edit, projects/tags
- Thinking levels: ThinkingLevelPicker, thinkingLevel option — instant, thinking, extra_thinking, max (Anthropic budgetTokens, OpenAI reasoningEffort)
- Workflow creation tools: createWorkflowTools, workflowToolsConfig — create_workflow_extension, compose_workflow, generate_workflow_spec_code (requires @contractspec/lib.workflow-composer)
- ModelSelector: modelSelector option for dynamic model selection by task dimension
- Local storage: createLocalStorageConversationStore for persisted conversations
- surface-runtime: moved from optional peer to direct dependency
