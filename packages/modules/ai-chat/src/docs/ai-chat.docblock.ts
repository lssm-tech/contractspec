/**
 * AI Chat Documentation
 *
 * DocBlock for the AI Chat module.
 */
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

registerDocBlocks([
  {
    id: 'ai-chat-overview',
    title: 'AI Chat Module',
    kind: 'reference',
    route: '/docs/tech/ai-chat',
    visibility: 'public',
    body: `
# AI Chat Module

The AI Chat module provides a reusable AI-powered conversational coding assistant for ContractSpec. It supports multiple LLM providers and can be integrated into CLI, VSCode extension, and ContractSpec Studio.

## Features

- **Multi-Provider Support**: OpenAI, Anthropic, Mistral, Google Gemini, and local Ollama
- **Three Provider Modes**:
  - **Local**: Run models locally via Ollama
  - **BYOK**: Bring Your Own Key for cloud providers
  - **Managed**: Use ContractSpec-managed keys via API proxy
- **Full Workspace Context**: Access specs, files, and codebase for context-aware assistance
- **Streaming Responses**: Real-time token streaming
- **Usage Tracking**: Integrated metering and cost tracking

## Architecture

The module is organized into several layers:

- **Core**: Chat service, conversation management, message types
- **Providers**: LLM provider abstraction (Ollama, OpenAI, Anthropic, Mistral, Gemini)
- **Context**: Workspace context for code-aware chat
- **Contracts**: OperationSpec operation definitions
- **Presentation**: React components and hooks

## Usage

### Basic Chat

\`\`\`typescript
import { ChatService, createProvider } from '@contractspec/module.ai-chat';

const provider = createProvider({
  provider: 'openai',
  mode: 'byok',
  apiKey: process.env.OPENAI_API_KEY,
});

const chatService = new ChatService({ provider });
const result = await chatService.send({
  content: 'Help me create a new API endpoint',
});
\`\`\`

### React Integration

\`\`\`tsx
import { useChat, ChatContainer, ChatMessage, ChatInput } from '@contractspec/module.ai-chat';

function Chat() {
  const { messages, sendMessage, isLoading } = useChat({
    provider: 'anthropic',
    mode: 'managed',
  });

  return (
    <ChatContainer>
      {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </ChatContainer>
  );
}
\`\`\`

## Surface Integration

- **CLI**: \`contractspec chat\` command
- **VSCode**: Chat webview panel
- **Studio**: Integrated chat assistant
`,
  },
  {
    id: 'ai-chat-providers',
    title: 'AI Chat Providers',
    kind: 'reference',
    route: '/docs/tech/ai-chat/providers',
    visibility: 'public',
    body: `
# AI Chat Providers

The AI Chat module supports multiple LLM providers with different deployment modes.

## Supported Providers

| Provider | Local | BYOK | Managed |
|----------|-------|------|---------|
| Ollama | ✅ | - | - |
| OpenAI | - | ✅ | ✅ |
| Anthropic | - | ✅ | ✅ |
| Mistral | - | ✅ | ✅ |
| Google Gemini | - | ✅ | ✅ |

## Provider Modes

### Local Mode (Ollama only)
Run models locally using Ollama. No API key required, but requires Ollama to be installed and running.

### BYOK (Bring Your Own Key)
Use your own API keys for cloud providers. Keys are stored securely and used directly.

### Managed Mode
Use ContractSpec-managed keys via the API proxy. Usage is metered and tracked for billing.

## Configuration

\`\`\`typescript
import { createProvider } from '@contractspec/module.ai-chat';

// Ollama (local)
const ollamaProvider = createProvider({
  provider: 'ollama',
  mode: 'local',
  model: 'llama3.2',
  baseUrl: 'http://localhost:11434',
});

// OpenAI (BYOK)
const openaiProvider = createProvider({
  provider: 'openai',
  mode: 'byok',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o',
});

// Anthropic (managed)
const anthropicProvider = createProvider({
  provider: 'anthropic',
  mode: 'managed',
  proxyUrl: '/api/chat/proxy',
});
\`\`\`
`,
  },
]);
