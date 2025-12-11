'use client';

/**
 * CreateAgentModal - Form for creating a new AI agent
 *
 * Wires to CreateAgentCommand via useAgentMutations hook.
 */
import { useState } from 'react';
import { Button, Input } from '@lssm/lib.design-system';

// Local type definition for modal props
export interface CreateAgentInput {
  name: string;
  description?: string;
  modelProvider: string;
  modelName: string;
  systemPrompt?: string;
}

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateAgentInput) => Promise<void>;
  isLoading?: boolean;
}

const MODEL_PROVIDERS = [
  {
    value: 'openai',
    label: 'OpenAI',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  },
  {
    value: 'anthropic',
    label: 'Anthropic',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
  },
  { value: 'google', label: 'Google', models: ['gemini-pro', 'gemini-ultra'] },
  {
    value: 'mistral',
    label: 'Mistral',
    models: ['mistral-large', 'mistral-medium', 'mistral-small'],
  },
] as const;

type ModelProvider = (typeof MODEL_PROVIDERS)[number]['value'];

export function CreateAgentModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateAgentModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [modelProvider, setModelProvider] = useState<ModelProvider>('openai');
  const [modelName, setModelName] = useState('gpt-4o');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectedProvider = MODEL_PROVIDERS.find(
    (p) => p.value === modelProvider
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Agent name is required');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        modelProvider,
        modelName,
        systemPrompt: systemPrompt.trim() || undefined,
      });

      // Reset form
      setName('');
      setDescription('');
      setModelProvider('openai');
      setModelName('gpt-4o');
      setSystemPrompt('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent');
    }
  };

  // Update model when provider changes
  const handleProviderChange = (provider: ModelProvider) => {
    setModelProvider(provider);
    const providerConfig = MODEL_PROVIDERS.find((p) => p.value === provider);
    if (providerConfig) {
      setModelName(providerConfig.models[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="bg-background/80 absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-card border-border relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">Create New Agent</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Agent Name */}
          <div>
            <label
              htmlFor="agent-name"
              className="text-muted-foreground mb-1 block text-sm font-medium"
            >
              Agent Name *
            </label>
            <Input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Customer Support Bot"
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="agent-description"
              className="text-muted-foreground mb-1 block text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="agent-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this agent does..."
              rows={2}
              disabled={isLoading}
              className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Model Provider & Model */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label
                htmlFor="model-provider"
                className="text-muted-foreground mb-1 block text-sm font-medium"
              >
                Provider *
              </label>
              <select
                id="model-provider"
                value={modelProvider}
                onChange={(e) =>
                  handleProviderChange(e.target.value as ModelProvider)
                }
                disabled={isLoading}
                className="border-input bg-background focus:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
              >
                {MODEL_PROVIDERS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label
                htmlFor="model-name"
                className="text-muted-foreground mb-1 block text-sm font-medium"
              >
                Model *
              </label>
              <select
                id="model-name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                disabled={isLoading}
                className="border-input bg-background focus:ring-ring h-10 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
              >
                {selectedProvider?.models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label
              htmlFor="system-prompt"
              className="text-muted-foreground mb-1 block text-sm font-medium"
            >
              System Prompt
            </label>
            <textarea
              id="system-prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are a helpful assistant that..."
              rows={4}
              disabled={isLoading}
              className="border-input bg-background focus:ring-ring w-full rounded-md border px-3 py-2 font-mono text-sm focus:ring-2 focus:outline-none disabled:opacity-50"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Instructions that define the agent's behavior
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onPress={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Agent'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
