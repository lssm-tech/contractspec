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
- **Export**: Export conversations to Markdown (.md), Plain Text (.txt), or JSON (.json); select one or many messages for partial export
- **Conversation Management**: New conversation, history sidebar, fork, edit messages, organize with projects and tags
- **Thinking Levels**: Choose reasoning depth (instant, thinking, extra thinking, max); maps to Anthropic budgetTokens and OpenAI reasoningEffort
- **Workflow Creation Tools**: Create and modify workflows via \`create_workflow_extension\`, \`compose_workflow\`, \`generate_workflow_spec_code\` when \`workflowToolsConfig\` is set (requires \`@contractspec/lib.workflow-composer\`)
- **ModelSelector**: Dynamic model selection by task dimension when \`modelSelector\` is provided
- **Contracts-Spec Context**: Pass \`contractsContext\` to expose agent, data-views, operations, forms, presentations to the model; agent tools from \`AgentToolConfig[]\` are converted to AI SDK tools
- **Surface-Runtime**: Pass \`surfacePlanConfig\` when embedding in surface-runtime; enables \`propose-patch\` tool for layout proposals; \`createAiSdkBundleAdapter\` implements \`AiSdkBundleAdapter\`
- **Presentation/Form Rendering**: Pass \`presentationRenderer\` and \`formRenderer\` to \`ChatWithSidebar\`; tool results with \`presentationKey\` or \`formKey\` render via host-provided components
- **MCP Tools**: Pass \`mcpServers\` (from \`@contractspec/lib.ai-agent\`) to \`useChat\`; tools from MCP servers are merged into chat tools
- **Agent Mode**: Pass \`agentMode: { agent }\` with a \`ChatAgentAdapter\` (use \`createChatAgentAdapter\` to wrap \`ContractSpecAgent\`); chat uses the agent for generation instead of ChatService

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
import { useChat, ChatWithExport, ChatInput } from '@contractspec/module.ai-chat';

function Chat() {
  const { messages, conversation, sendMessage, isLoading } = useChat({
    provider: 'anthropic',
    mode: 'managed',
  });

  return (
    <ChatWithExport messages={messages} conversation={conversation}>
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </ChatWithExport>
  );
}
\`\`\`

\`ChatWithExport\` provides an export toolbar (Markdown, TXT, JSON, copy to clipboard) and message selection. Use \`ChatContainer\` + \`ChatMessage\` for basic chat without export.

### Full Chat with Sidebar

\`\`\`tsx
import { ChatWithSidebar } from '@contractspec/module.ai-chat';

function FullChat() {
  return <ChatWithSidebar systemPrompt="You are a helpful assistant." />;
}
\`\`\`

\`ChatWithSidebar\` includes conversation history (LocalStorage), New/Fork, message edit, project/tags organization, and a **Thinking Level** picker (instant, thinking, extra thinking, max). The thinking level controls provider-specific reasoning options (e.g. Anthropic extended thinking budget, OpenAI reasoning effort).

### Workflow Creation Tools

Pass \`workflowToolsConfig: { baseWorkflows, composer? }\` to \`ChatService\` or \`useChat\` to enable workflow creation tools. The model can then call \`create_workflow_extension\`, \`compose_workflow\`, and \`generate_workflow_spec_code\` when users ask to add steps or modify workflows. Export \`createWorkflowTools\` from \`@contractspec/module.ai-chat/core\` for manual wiring.

### ModelSelector

Pass \`modelSelector\` (from \`@contractspec/lib.ai-providers\`) to \`ChatService\` or \`useChat\` for dynamic model selection by task dimension (reasoning vs latency), driven by thinking level.

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
