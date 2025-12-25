# @lssm/lib.ai-providers

Website: https://contractspec.lssm.tech/


**Unified AI provider abstraction** for ContractSpec applications.

## Overview

This library provides a consistent interface for working with multiple LLM providers across ContractSpec. It's used by:

- `@lssm/module.ai-chat` - Vibe coding chat
- `@lssm/bundle.contractspec-workspace` - CLI AI features
- `@lssm/lib.ai-agent` - Agent orchestration

## Supported Providers

| Provider | Local | BYOK | Managed |
|----------|-------|------|---------|
| Ollama | ✅ | - | - |
| OpenAI | - | ✅ | ✅ |
| Anthropic | - | ✅ | ✅ |
| Mistral | - | ✅ | ✅ |
| Google Gemini | - | ✅ | ✅ |

## Usage

### Basic Provider Creation

```typescript
import { createProvider, type ProviderConfig } from '@lssm/lib.ai-providers';

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
import { createProviderFromEnv } from '@lssm/lib.ai-providers';

// Reads from CONTRACTSPEC_AI_PROVIDER, OPENAI_API_KEY, etc.
const provider = createProviderFromEnv();
```

### Legacy Config Support

```typescript
import { getAIProvider } from '@lssm/lib.ai-providers';
import type { Config } from '@lssm/bundle.contractspec-workspace';

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

