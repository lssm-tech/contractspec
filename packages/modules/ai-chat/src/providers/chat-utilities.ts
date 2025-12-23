/**
 * Chat-specific provider utilities
 */
import type { ProviderName } from '@lssm/lib.ai-providers';

/**
 * Check if a provider supports local mode
 */
export function supportsLocalMode(provider: ProviderName): boolean {
  return provider === 'ollama';
}

/**
 * Check if a provider is available in Studio (cloud only)
 */
export function isStudioAvailable(provider: ProviderName): boolean {
  return provider !== 'ollama';
}

/**
 * Get a human-readable provider name
 */
export function getProviderDisplayName(provider: ProviderName): string {
  switch (provider) {
    case 'ollama':
      return 'Ollama (Local)';
    case 'openai':
      return 'OpenAI';
    case 'anthropic':
      return 'Anthropic Claude';
    case 'mistral':
      return 'Mistral AI';
    case 'gemini':
      return 'Google Gemini';
    default:
      return provider;
  }
}

/**
 * Get provider icon name (for Lucide icons)
 */
export function getProviderIcon(
  provider: ProviderName
): 'bot' | 'brain' | 'sparkles' | 'zap' | 'cpu' {
  switch (provider) {
    case 'ollama':
      return 'cpu';
    case 'openai':
      return 'brain';
    case 'anthropic':
      return 'sparkles';
    case 'mistral':
      return 'zap';
    case 'gemini':
      return 'bot';
    default:
      return 'bot';
  }
}

/**
 * Get provider color class for styling
 */
export function getProviderColor(provider: ProviderName): string {
  switch (provider) {
    case 'ollama':
      return 'text-neutral-500';
    case 'openai':
      return 'text-emerald-500';
    case 'anthropic':
      return 'text-orange-500';
    case 'mistral':
      return 'text-blue-500';
    case 'gemini':
      return 'text-purple-500';
    default:
      return 'text-neutral-400';
  }
}
