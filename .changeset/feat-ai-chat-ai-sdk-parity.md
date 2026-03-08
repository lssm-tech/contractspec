---
"@contractspec/module.ai-chat": minor
---

feat(ai-chat): Vercel AI SDK feature parity

- Switch from textStream to fullStream; map text-delta, reasoning-delta, source, tool-call, tool-result, tool-error, finish
- Replace buildPrompt with buildMessages for CoreMessage[] (streamText/generateText)
- Add tools, sendReasoning, sendSources to config; fix usage mapping (inputTokens/completionTokens)
- Extend useChat with toolsToToolSet, stream handling for reasoning/source/tool_call/tool_result
- Add requireApproval and addToolApprovalResponse for tool approval flow
- Enhance ChatMessage: sources (citation links), tool invocations (collapsible), markdown links
- Add createChatRoute and createCompletionRoute server route helpers
- Re-export useCompletion from @ai-sdk/react
- Document AI SDK parity, server routes, streamObject, AI Elements, Voice/Speech in README
