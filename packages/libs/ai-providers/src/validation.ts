/**
 * Provider validation utilities
 */
import type { ProviderName, ProviderConfig } from './types';
import { createProvider } from './factory';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Validate a provider configuration
 */
export async function validateProvider(
  config: ProviderConfig
): Promise<ValidationResult> {
  const provider = createProvider(config);
  return provider.validate();
}

/**
 * Check if a provider has required credentials
 */
export function hasCredentials(provider: ProviderName): boolean {
  switch (provider) {
    case 'ollama':
      return true; // No credentials needed
    case 'openai':
      return Boolean(process.env.OPENAI_API_KEY);
    case 'anthropic':
      return Boolean(process.env.ANTHROPIC_API_KEY);
    case 'mistral':
      return Boolean(process.env.MISTRAL_API_KEY);
    case 'gemini':
      return Boolean(process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY);
    default:
      return false;
  }
}

/**
 * Get the environment variable name for a provider's API key
 */
export function getEnvVarName(provider: ProviderName): string | null {
  switch (provider) {
    case 'ollama':
      return null;
    case 'openai':
      return 'OPENAI_API_KEY';
    case 'anthropic':
      return 'ANTHROPIC_API_KEY';
    case 'mistral':
      return 'MISTRAL_API_KEY';
    case 'gemini':
      return 'GOOGLE_API_KEY';
    default:
      return null;
  }
}

/**
 * Check if Ollama is running
 */
export async function isOllamaRunning(
  baseUrl = 'http://localhost:11434'
): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * List available Ollama models
 */
export async function listOllamaModels(
  baseUrl = 'http://localhost:11434'
): Promise<string[]> {
  try {
    const response = await fetch(`${baseUrl}/api/tags`);
    if (!response.ok) return [];

    const data = (await response.json()) as {
      models?: Array<{ name: string }>;
    };
    return (data.models ?? []).map((m) => m.name);
  } catch {
    return [];
  }
}

