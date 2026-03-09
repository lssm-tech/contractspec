# @contractspec/module.ai-chat

Website: https://contractspec.io/


**ContractSpec Vibe Coding Chat** — AI-powered conversational coding assistant for ContractSpec.

## Overview

This module provides a reusable AI chat system that can be integrated into CLI, VSCode extension, and ContractSpec Studio. It supports multiple LLM providers with full workspace context for vibe coding.

## Features

- **Multi-Provider Support**: OpenAI, Anthropic, Mistral, Google Gemini, and local Ollama
- **Three Provider Modes**: Local (Ollama), BYOK (Bring Your Own Key), Managed (API proxy)
- **Full Workspace Context**: Access specs, files, and codebase for context-aware assistance
- **Streaming Responses**: Real-time token streaming for responsive UX
- **Usage Tracking**: Integrated metering and cost tracking
- **UI Components**: React components for chat interfaces
- **Export**: Export conversations to Markdown, TXT, or JSON; select one or many messages for export
- **Conversation Management**: New conversation, history sidebar, fork, edit messages, organize with projects and tags
- **Thinking Levels**: Select reasoning depth (instant, thinking, extra thinking, max); maps to Anthropic budgetTokens and OpenAI reasoningEffort
- **Workflow Creation Tools**: Create and modify workflows conversationally via `create_workflow_extension`, `compose_workflow`, and `generate_workflow_spec_code` (requires `@contractspec/lib.workflow-composer`)
- **ModelSelector**: Dynamic model selection by task dimension (reasoning vs latency) when using `@contractspec/lib.ai-providers` ModelSelector

## Bundle Spec Alignment (07_ai_native_chat)

This module aligns with `specs/contractspec_modules_bundle_spec_2026-03-08`. `useChat` and `ChatContainer` provide the assistant slot UI for bundle surfaces. `AiChatFeature` (key `ai-chat`, version `1.0.0`) matches `ModuleBundleSpec.requires`. The `tools` option on `UseChatOptions` is wired to `streamText`; use `requireApproval: true` for tools that need user confirmation (requires server route for full support).

## Related Packages

- `@contractspec/lib.ai-providers` — Shared provider abstraction (types, factory, validation), ModelSelector for dynamic model selection
- `@contractspec/lib.workflow-composer` — Workflow composition and validation (optional; required for workflow creation tools)
- `@contractspec/lib.ai-agent` — Agent orchestration and tool execution
- `@contractspec/lib.surface-runtime` — Bundle surfaces (optional peer when used in PM workbench)

## Providers

| Provider | Local | BYOK | Managed |
|----------|-------|------|---------|
| Ollama | ✅ | - | - |
| OpenAI | - | ✅ | ✅ |
| Anthropic | - | ✅ | ✅ |
| Mistral | - | ✅ | ✅ |
| Google Gemini | - | ✅ | ✅ |

## Usage

### Basic Chat

```typescript
import { createProvider } from '@contractspec/lib.ai-providers';
import { ChatService } from '@contractspec/module.ai-chat';

const provider = createProvider({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o',
});

const chatService = new ChatService({ provider });

const response = await chatService.send({
  content: 'Help me create a new API endpoint',
});
```

### With Workspace Context

```typescript
import { createProvider } from '@contractspec/lib.ai-providers';
import { ChatService, WorkspaceContext } from '@contractspec/module.ai-chat';

const context = await WorkspaceContext.fromPath('/path/to/project');
const provider = createProvider({ provider: 'anthropic', proxyUrl: '/api/chat' });

const chatService = new ChatService({ provider, context });

// The chat now has access to specs, files, and can suggest code changes
const response = await chatService.send({
  content: 'Add validation to the user.create command',
});
```

### React Components

**With export and message selection** (recommended):

```tsx
import { ChatWithExport, ChatInput, useChat } from '@contractspec/module.ai-chat';

function VibeCodingChat() {
  const { messages, conversation, sendMessage, isLoading } = useChat({
    provider: 'openai',
    mode: 'managed',
  });

  return (
    <ChatWithExport messages={messages} conversation={conversation}>
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </ChatWithExport>
  );
}
```

`ChatWithExport` provides an export toolbar (Markdown, TXT, JSON, copy to clipboard) and message selection checkboxes. Select messages to export only those, or export all when none are selected.

**With sidebar (history, new, fork, edit, project/tags)**:

```tsx
import { ChatWithSidebar } from '@contractspec/module.ai-chat';

function FullChat() {
  return (
    <ChatWithSidebar
      systemPrompt="You are a helpful assistant."
    />
  );
}
```

`ChatWithSidebar` includes a conversation history sidebar (LocalStorage-persisted), New/Fork buttons, message edit, project/tags organization, and a **Thinking Level** picker (instant, thinking, extra thinking, max). Uses `createLocalStorageConversationStore()` by default.

**Basic (no export)**:

```tsx
import { ChatContainer, ChatMessage, ChatInput } from '@contractspec/module.ai-chat/presentation/components';
import { useChat } from '@contractspec/module.ai-chat/presentation/hooks';

function BasicChat() {
  const { messages, sendMessage, isLoading } = useChat();

  return (
    <ChatContainer>
      {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </ChatContainer>
  );
}
```

### AI SDK Parity

This module aligns with the [Vercel AI SDK](https://sdk.vercel.ai) and AI Elements feature set:

- **fullStream**: Reasoning, tools, and sources from `streamText` fullStream
- **Thinking Levels**: `thinkingLevel` option (instant, thinking, extra_thinking, max) maps to Anthropic `budgetTokens` and OpenAI `reasoningEffort`; `ThinkingLevelPicker` in `ChatWithSidebar`
- **Tools**: Pass `tools` to `ChatServiceConfig` or `useChat`; supports `requireApproval` for approval workflow; optional `workflowToolsConfig` adds workflow creation tools
- **Message parts**: `ChatMessage` renders reasoning (collapsible), sources (citations), and tool invocations
- **Markdown**: Inline links and code blocks in message content
- **Export**: `ChatWithExport` and `ChatExportToolbar` support Markdown (.md), Plain Text (.txt), and JSON (.json); select messages for partial export or export all
- **Conversation Management**: `ChatWithSidebar` provides history, new conversation, fork, edit messages; `useChat` exposes `createNewConversation`, `editMessage`, `forkConversation`, `updateConversation`; `useConversations` for listing; `createLocalStorageConversationStore()` for persistence

### Server Route (Full AI SDK + Tool Approval)

For full AI SDK compatibility including tool approval, use `createChatRoute` with `@ai-sdk/react` useChat:

```ts
// app/api/chat/route.ts (Next.js App Router)
import { createChatRoute } from '@contractspec/module.ai-chat/core';
import { createProvider } from '@contractspec/lib.ai-providers';

const provider = createProvider({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o',
});

export const POST = createChatRoute({ provider });
```

```tsx
// Client: use @ai-sdk/react useChat with DefaultChatTransport
import { useChat } from '@ai-sdk/react';

const { messages, sendMessage } = useChat({
  api: '/api/chat',
});
```

The custom `useChat` from this module works with `ChatService` for simple deployments (no tools, no approval). For tools with `requireApproval`, use the server route pattern above.

### Workflow Creation Tools

When `workflowToolsConfig` is provided, the chat can create and modify workflows via AI SDK tools:

```typescript
import { ChatService, createWorkflowTools } from '@contractspec/module.ai-chat';
import { WorkflowComposer } from '@contractspec/lib.workflow-composer';
import { createProvider } from '@contractspec/lib.ai-providers';

const baseWorkflows = [/* your WorkflowSpec[] */];
const provider = createProvider({ provider: 'anthropic', model: 'claude-sonnet-4' });

const chatService = new ChatService({
  provider,
  workflowToolsConfig: {
    baseWorkflows,
    composer: new WorkflowComposer(),
  },
});

// User can say: "Add a legal review step after validate-invoice"
// The model will call create_workflow_extension, compose_workflow, generate_workflow_spec_code
```

Tools: `create_workflow_extension` (validate extensions), `compose_workflow` (apply extensions to base), `generate_workflow_spec_code` (output TypeScript). Export `createWorkflowTools(baseWorkflows, composer)` for manual wiring.

### ModelSelector (Dynamic Model Selection)

Use `modelSelector` to pick models by task dimension (e.g. reasoning vs latency):

```typescript
import { createModelSelector } from '@contractspec/lib.ai-providers';
import { ChatService } from '@contractspec/module.ai-chat';

const modelSelector = createModelSelector(/* ranking config */);
const chatService = new ChatService({
  provider: createProvider({ /* ... */ }),
  modelSelector,
});

// ChatService will call modelSelector.selectAndCreate({ taskDimension: 'reasoning' | 'latency' })
// based on thinking level when modelSelector is set
```

### Optional AI Elements

Apps can optionally use [AI Elements](https://elements.ai-sdk.dev) for UI. This module does not depend on ai-elements; provide an adapter from `ChatMessage` to `UIMessage` when integrating.

### useCompletion (Non-Chat Completion)

For inline suggestions, single-prompt completion, or other non-conversational use cases:

```tsx
import { useCompletion } from '@contractspec/module.ai-chat/presentation/hooks';
// or: import { useCompletion } from '@ai-sdk/react';

const { completion, complete, isLoading } = useCompletion({
  api: '/api/completion',
});
```

Use `createCompletionRoute` for the API endpoint (see `createChatRoute` pattern).

### streamObject / generateObject

For structured output (schema-driven generation), use the AI SDK directly: `streamObject` and `generateObject` from `ai`. This module focuses on chat; add `useObject` or equivalent in a separate module when needed.

### Voice / Speech

Speech Input, Transcription, Voice Selector, and related UI are planned as a separate submodule or feature flag. Track via roadmap.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Consumer Surfaces                        │
│  ┌─────────┐    ┌──────────────┐    ┌─────────────────┐    │
│  │   CLI   │    │    VSCode    │    │     Studio      │    │
│  └────┬────┘    └──────┬───────┘    └────────┬────────┘    │
└───────┼────────────────┼─────────────────────┼─────────────┘
        │                │                     │
        ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  @contractspec/module.ai-chat                       │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │ ChatService│  │   Providers  │  │ Workspace Context │   │
│  │            │  │ (re-exports) │  │                   │   │
│  └────────────┘  └──────┬───────┘  └───────────────────┘   │
│                         │                                   │
│  ┌──────────────────────┼───────────────────────────────┐  │
│  │              UI Components (React)                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                   ▼
┌───────────────────┐            ┌──────────────────────────┐
│ @contractspec/lib.        │            │  @contractspec/lib.ai-agent      │
│ ai-providers      │            │                          │
│ ┌───────────────┐ │            │  Agent orchestration,    │
│ │ Provider      │ │            │  tool execution,         │
│ │ abstraction   │ │            │  memory framework        │
│ └───────────────┘ │            └──────────────────────────┘
│ ┌───────────────┐ │
│ │ Model info    │ │
│ │ & validation  │ │
│ └───────────────┘ │
└───────────────────┘
        │
        ▼
┌───────────────────┐              ┌──────────────────────────┐
│  Local Providers  │              │      API Proxy           │
│  ┌──────────────┐ │              │  ┌──────────────────────┐│
│  │    Ollama    │ │              │  │  Metering + Costing  ││
│  └──────────────┘ │              │  └──────────────────────┘│
└───────────────────┘              │  ┌──────────────────────┐│
                                   │  │   Cloud Providers    ││
                                   │  │ OpenAI/Anthropic/etc ││
                                   │  └──────────────────────┘│
                                   └──────────────────────────┘
```

## Metrics

The module tracks the following metrics via `@contractspec/lib.metering`:

| Metric | Description |
|--------|-------------|
| `ai_chat.messages` | Total chat messages sent |
| `ai_chat.tokens_input` | Input tokens consumed |
| `ai_chat.tokens_output` | Output tokens generated |
| `ai_chat.latency_ms` | Response latency |
| `ai_chat.errors` | Failed completions |

## Feature Flags

- `ai_chat.enabled` - Master toggle for the chat feature
- `ai_chat.managed_keys` - Enable managed key mode (API proxy)
- `ai_chat.workspace_context` - Enable workspace read/write access
- `ai_chat.code_execution` - Enable code execution (future)

## License

MIT
