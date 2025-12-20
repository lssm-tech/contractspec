'use client';

import * as React from 'react';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';
import { Button } from '@lssm/lib.design-system';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lssm/lib.ui-kit-web/ui/select';
import { Badge } from '@lssm/lib.ui-kit-web/ui/badge';
import { Label } from '@lssm/lib.ui-kit-web/ui/label';
import { Bot, Cloud, Cpu, Sparkles } from 'lucide-react';
import {
  getModelsForProvider,
  type ModelInfo,
  type ProviderMode,
  type ProviderName,
} from '@lssm/lib.ai-providers';

export interface ModelSelection {
  provider: ProviderName;
  model: string;
  mode: ProviderMode;
}

export interface ModelPickerProps {
  /** Currently selected provider/model */
  value: ModelSelection;
  /** Called when selection changes */
  onChange: (value: ModelSelection) => void;
  /** Available providers (with availability info) */
  availableProviders?: {
    provider: ProviderName;
    available: boolean;
    mode: ProviderMode;
    reason?: string;
  }[];
  /** Additional class name */
  className?: string;
  /** Compact mode (smaller) */
  compact?: boolean;
}

const PROVIDER_ICONS: Record<ProviderName, React.ReactNode> = {
  ollama: <Cpu className="h-4 w-4" />,
  openai: <Bot className="h-4 w-4" />,
  anthropic: <Sparkles className="h-4 w-4" />,
  mistral: <Cloud className="h-4 w-4" />,
  gemini: <Sparkles className="h-4 w-4" />,
};

const PROVIDER_NAMES: Record<ProviderName, string> = {
  ollama: 'Ollama (Local)',
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  mistral: 'Mistral',
  gemini: 'Google Gemini',
};

const MODE_BADGES: Record<
  ProviderMode,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  local: { label: 'Local', variant: 'secondary' },
  byok: { label: 'BYOK', variant: 'outline' },
  managed: { label: 'Managed', variant: 'default' },
};

/**
 * Model picker component for selecting AI provider and model
 */
export function ModelPicker({
  value,
  onChange,
  availableProviders,
  className,
  compact = false,
}: ModelPickerProps) {
  const providers = availableProviders ?? [
    { provider: 'ollama' as const, available: true, mode: 'local' as const },
    { provider: 'openai' as const, available: true, mode: 'byok' as const },
    { provider: 'anthropic' as const, available: true, mode: 'byok' as const },
    { provider: 'mistral' as const, available: true, mode: 'byok' as const },
    { provider: 'gemini' as const, available: true, mode: 'byok' as const },
  ];

  const models: ModelInfo[] = getModelsForProvider(value.provider);
  const selectedModel = models.find((m) => m.id === value.model);

  const handleProviderChange = React.useCallback(
    (providerName: string) => {
      const provider = providerName as ProviderName;
      const providerInfo = providers.find((p) => p.provider === provider);
      const providerModels = getModelsForProvider(provider);
      const defaultModel = providerModels[0]?.id ?? '';

      onChange({
        provider,
        model: defaultModel,
        mode: providerInfo?.mode ?? 'byok',
      });
    },
    [onChange, providers]
  );

  const handleModelChange = React.useCallback(
    (modelId: string) => {
      onChange({
        ...value,
        model: modelId,
      });
    },
    [onChange, value]
  );

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Select value={value.provider} onValueChange={handleProviderChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {providers.map((p) => (
              <SelectItem
                key={p.provider}
                value={p.provider}
                disabled={!p.available}
              >
                <div className="flex items-center gap-2">
                  {PROVIDER_ICONS[p.provider]}
                  <span>{PROVIDER_NAMES[p.provider]}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={value.model} onValueChange={handleModelChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {models.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Provider selection */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="provider-selection" className="text-sm font-medium">
          Provider
        </Label>
        <div className="flex flex-wrap gap-2" id="provider-selection">
          {providers.map((p) => (
            <Button
              key={p.provider}
              variant={value.provider === p.provider ? 'default' : 'outline'}
              size="sm"
              onPress={() => p.available && handleProviderChange(p.provider)}
              disabled={!p.available}
              className={cn(!p.available && 'opacity-50')}
            >
              {PROVIDER_ICONS[p.provider]}
              <span>{PROVIDER_NAMES[p.provider]}</span>
              <Badge variant={MODE_BADGES[p.mode].variant} className="ml-1">
                {MODE_BADGES[p.mode].label}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Model selection */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="model-picker" className="text-sm font-medium">
          Model
        </Label>
        <Select
          name="model-picker"
          value={value.model}
          onValueChange={handleModelChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                <div className="flex items-center gap-2">
                  <span>{m.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {Math.round(m.contextWindow / 1000)}K
                  </span>
                  {m.capabilities.vision && (
                    <Badge variant="outline" className="text-xs">
                      Vision
                    </Badge>
                  )}
                  {m.capabilities.reasoning && (
                    <Badge variant="outline" className="text-xs">
                      Reasoning
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model info */}
      {selectedModel && (
        <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
          <span>
            Context: {Math.round(selectedModel.contextWindow / 1000)}K tokens
          </span>
          {selectedModel.capabilities.vision && <span>• Vision</span>}
          {selectedModel.capabilities.tools && <span>• Tools</span>}
          {selectedModel.capabilities.reasoning && <span>• Reasoning</span>}
        </div>
      )}
    </div>
  );
}
