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

/** Tool result shape for data view rendering */
export interface DataViewToolResult {
  dataViewKey: string;
  items?: unknown[];
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

/** Type guard for data view tool result */
export function isDataViewToolResult(
  result: unknown
): result is DataViewToolResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    'dataViewKey' in result &&
    typeof (result as DataViewToolResult).dataViewKey === 'string'
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
  /** Host-provided data view renderer */
  dataViewRenderer?: (key: string, items?: unknown[]) => React.ReactNode;
  /** Fallback: render raw JSON when no custom renderer */
  showRawFallback?: boolean;
}

/**
 * Renders tool results with optional host-driven presentation, form, or data view components.
 * When result has presentationKey/formKey/dataViewKey and host provides a renderer, uses it.
 * Otherwise falls back to raw JSON display.
 */
export function ToolResultRenderer({
  toolName: _toolName,
  result,
  presentationRenderer,
  formRenderer,
  dataViewRenderer,
  showRawFallback = true,
}: ToolResultRendererProps) {
  if (result === undefined || result === null) {
    return null;
  }

  if (isPresentationToolResult(result) && presentationRenderer) {
    const rendered = presentationRenderer(result.presentationKey, result.data);
    if (rendered != null) {
      return (
        <div className="border-border bg-background/50 mt-2 rounded-md border p-3">
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
        <div className="border-border bg-background/50 mt-2 rounded-md border p-3">
          {rendered}
        </div>
      );
    }
  }

  if (isDataViewToolResult(result) && dataViewRenderer) {
    const rendered = dataViewRenderer(result.dataViewKey, result.items);
    if (rendered != null) {
      return (
        <div className="border-border bg-background/50 mt-2 rounded-md border p-3">
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
