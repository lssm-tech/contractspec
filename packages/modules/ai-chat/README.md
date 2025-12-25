# @lssm/module.ai-chat

Website: https://contractspec.lssm.tech/


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

## Related Packages

- `@lssm/lib.ai-providers` — Shared provider abstraction (types, factory, validation)
- `@lssm/lib.ai-agent` — Agent orchestration and tool execution

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
import { createProvider } from '@lssm/lib.ai-providers';
import { ChatService } from '@lssm/module.ai-chat';

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
import { createProvider } from '@lssm/lib.ai-providers';
import { ChatService, WorkspaceContext } from '@lssm/module.ai-chat';

const context = await WorkspaceContext.fromPath('/path/to/project');
const provider = createProvider({ provider: 'anthropic', proxyUrl: '/api/chat' });

const chatService = new ChatService({ provider, context });

// The chat now has access to specs, files, and can suggest code changes
const response = await chatService.send({
  content: 'Add validation to the user.create command',
});
```

### React Components

```tsx
import { ChatContainer, ChatMessage, ChatInput } from '@lssm/module.ai-chat/presentation/components';
import { useChat } from '@lssm/module.ai-chat/presentation/hooks';

function VibeCodingChat() {
  const { messages, sendMessage, isLoading } = useChat({
    provider: 'openai',
    mode: 'managed',
  });

  return (
    <ChatContainer>
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </ChatContainer>
  );
}
```

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
│                  @lssm/module.ai-chat                       │
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
│ @lssm/lib.        │            │  @lssm/lib.ai-agent      │
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

The module tracks the following metrics via `@lssm/lib.metering`:

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
