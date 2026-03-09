'use client';

import * as React from 'react';
import { cn } from '@contractspec/lib.ui-kit-web/ui/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@contractspec/lib.ui-kit-web/ui/select';
import { Label } from '@contractspec/lib.ui-kit-web/ui/label';
import {
  THINKING_LEVEL_LABELS,
  THINKING_LEVEL_DESCRIPTIONS,
  type ThinkingLevel,
} from '../../core/thinking-levels';

const THINKING_LEVELS: ThinkingLevel[] = [
  'instant',
  'thinking',
  'extra_thinking',
  'max',
];

export interface ThinkingLevelPickerProps {
  /** Currently selected level */
  value: ThinkingLevel;
  /** Called when selection changes */
  onChange: (value: ThinkingLevel) => void;
  /** Additional class name */
  className?: string;
  /** Compact mode (smaller) */
  compact?: boolean;
}

/**
 * Picker for thinking level: instant, thinking, extra thinking, max.
 * Maps to provider-specific reasoning options (Anthropic budgetTokens, OpenAI reasoningEffort).
 */
export function ThinkingLevelPicker({
  value,
  onChange,
  className,
  compact = false,
}: ThinkingLevelPickerProps) {
  const handleChange = React.useCallback(
    (v: string) => {
      onChange(v as ThinkingLevel);
    },
    [onChange]
  );

  if (compact) {
    return (
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className={cn('w-[140px]', className)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {THINKING_LEVELS.map((level) => (
            <SelectItem key={level} value={level}>
              {THINKING_LEVEL_LABELS[level]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor="thinking-level-picker" className="text-sm font-medium">
        Thinking Level
      </Label>
      <Select
        name="thinking-level-picker"
        value={value}
        onValueChange={handleChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select thinking level" />
        </SelectTrigger>
        <SelectContent>
          {THINKING_LEVELS.map((level) => (
            <SelectItem
              key={level}
              value={level}
              title={THINKING_LEVEL_DESCRIPTIONS[level]}
            >
              {THINKING_LEVEL_LABELS[level]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
