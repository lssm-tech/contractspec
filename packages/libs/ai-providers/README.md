# @contractspec/lib.ai-providers

Website: https://contractspec.io/

**Unified AI provider abstraction** for ContractSpec applications.

## Overview

This library provides a consistent interface for working with multiple LLM providers across ContractSpec. It's used by:

- `@contractspec/module.ai-chat` - Vibe coding chat
- `@contractspec/bundle.workspace` - CLI AI features
- `@contractspec/lib.ai-agent` - Agent orchestration

## Supported Providers

| Provider      | Local | BYOK | Managed |
| ------------- | ----- | ---- | ------- |
| Ollama        | ✅    | -    | -       |
| OpenAI        | -     | ✅   | ✅      |
| Anthropic     | -     | ✅   | ✅      |
| Mistral       | -     | ✅   | ✅      |
| Google Gemini | -     | ✅   | ✅      |

### Mistral model presets

The bundled Mistral model catalog includes current families used in ContractSpec flows:

- `mistral-large-latest`
- `mistral-medium-latest`
- `mistral-small-latest`
- `codestral-latest`
- `devstral-small-latest`
- `magistral-medium-latest`
- `pixtral-large-latest`

## Usage

### Basic Provider Creation

```typescript
import { createProvider, type ProviderConfig } from '@contractspec/lib.ai-providers';

// Ollama (local)
const ollamaProvider = createProvider({
  provider: 'ollama',
  model: 'llama3.2',
});

// OpenAI (BYOK)
const openaiProvider = createProvider({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o',
});

// Use the model
const model = openaiProvider.getModel();
```

### From Environment

```typescript
import { createProviderFromEnv } from '@contractspec/lib.ai-providers';

// Reads from CONTRACTSPEC_AI_PROVIDER, OPENAI_API_KEY, etc.
const provider = createProviderFromEnv();
```

### Legacy Config Support

```typescript
import { getAIProvider } from '@contractspec/lib.ai-providers';
import type { Config } from '@contractspec/bundle.workspace';

// Backwards compatible with existing Config type
const model = getAIProvider(config);
```

## Provider Modes

- **Local**: Run models locally (Ollama only)
- **BYOK**: Bring Your Own Key for cloud providers
- **Managed**: Use ContractSpec-managed keys via API proxy

## API

### Types

- `ProviderName` - Supported provider names
- `ProviderMode` - local | byok | managed
- `ProviderConfig` - Configuration for creating a provider
- `Provider` - Provider interface with getModel()
- `ModelInfo` - Model metadata (context window, capabilities)

### Functions

- `createProvider(config)` - Create a provider instance
- `createProviderFromEnv()` - Create from environment variables
- `getAIProvider(config)` - Legacy compatibility function
- `validateProvider(config)` - Check if provider is properly configured
- `getRecommendedModels(provider)` - Get recommended models for a provider
- `getAvailableProviders()` - List available providers with status
