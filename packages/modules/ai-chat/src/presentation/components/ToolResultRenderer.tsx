'use client';

import * as React from 'react';

/** Tool result shape for presentation rendering */
export interface PresentationToolResult {
  presentationKey: string;
  data?: unknown;
}

/** Tool result shape for form rendering */
export interface FormToolResult {
  formKey: string;
  defaultValues?: Record<string, unknown>;
}

/** Type guard for presentation tool result */
export function isPresentationToolResult(
  result: unknown
): result is PresentationToolResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    'presentationKey' in result &&
    typeof (result as PresentationToolResult).presentationKey === 'string'
  );
}

/** Type guard for form tool result */
export function isFormToolResult(result: unknown): result is FormToolResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    'formKey' in result &&
    typeof (result as FormToolResult).formKey === 'string'
  );
}

export interface ToolResultRendererProps {
  /** Tool name */
  toolName: string;
  /** Tool result from AI */
  result: unknown;
  /** Host-provided presentation renderer */
  presentationRenderer?: (key: string, data?: unknown) => React.ReactNode;
  /** Host-provided form renderer */
  formRenderer?: (
    key: string,
    defaultValues?: Record<string, unknown>
  ) => React.ReactNode;
  /** Fallback: render raw JSON when no custom renderer */
  showRawFallback?: boolean;
}

/**
 * Renders tool results with optional host-driven presentation or form components.
 * When result has presentationKey/formKey and host provides a renderer, uses it.
 * Otherwise falls back to raw JSON display.
 */
export function ToolResultRenderer({
  toolName,
  result,
  presentationRenderer,
  formRenderer,
  showRawFallback = true,
}: ToolResultRendererProps) {
  if (result === undefined || result === null) {
    return null;
  }

  if (isPresentationToolResult(result) && presentationRenderer) {
    const rendered = presentationRenderer(result.presentationKey, result.data);
    if (rendered != null) {
      return (
        <div className="mt-2 rounded-md border border-border bg-background/50 p-3">
          {rendered}
        </div>
      );
    }
  }

  if (isFormToolResult(result) && formRenderer) {
    const rendered = formRenderer(
      result.formKey,
      result.defaultValues as Record<string, unknown> | undefined
    );
    if (rendered != null) {
      return (
        <div className="mt-2 rounded-md border border-border bg-background/50 p-3">
          {rendered}
        </div>
      );
    }
  }

  if (!showRawFallback) {
    return null;
  }

  return (
    <div>
      <span className="text-muted-foreground font-medium">Output:</span>
      <pre className="bg-background mt-1 overflow-x-auto rounded p-2 text-xs">
        {typeof result === 'object'
          ? JSON.stringify(result, null, 2)
          : String(result)}
      </pre>
    </div>
  );
}
