/**
 * Component override types for AI Elements-style UX.
 * Hosts with ai-elements can pass enhanced components; otherwise native implementations are used.
 */
import type * as React from 'react';

export interface ReasoningComponentProps {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export interface ChatMessageComponents {
  Reasoning?: React.ComponentType<ReasoningComponentProps>;
  ReasoningTrigger?: React.ComponentType<{ children?: React.ReactNode }>;
  ReasoningContent?: React.ComponentType<{ children: React.ReactNode }>;
  Sources?: React.ComponentType<{ children: React.ReactNode }>;
  SourcesTrigger?: React.ComponentType<{ count: number }>;
  Source?: React.ComponentType<
    {
      href: string;
      title?: string;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>
  >;
  ChainOfThought?: React.ComponentType<{
    children: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    className?: string;
  }>;
  ChainOfThoughtStep?: React.ComponentType<{
    label: string;
    description?: string;
    status?: 'complete' | 'active' | 'pending';
    children?: React.ReactNode;
  }>;
}

export interface SuggestionComponents {
  Suggestions?: React.ComponentType<{ children: React.ReactNode }>;
  Suggestion?: React.ComponentType<{
    suggestion: string;
    onClick?: (suggestion: string) => void;
  }>;
}
