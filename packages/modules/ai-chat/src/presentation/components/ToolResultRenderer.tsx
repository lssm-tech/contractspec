'use client';

import * as React from 'react';

/** UIMessage-like shape (subagent output with parts) */
export interface UIMessageLike {
  parts?: unknown[];
}

/** Type guard for UIMessage-like (nested subagent output) */
export function isUIMessageLike(result: unknown): result is UIMessageLike {
  return (
    typeof result === 'object' &&
    result !== null &&
    'parts' in result &&
    Array.isArray((result as UIMessageLike).parts)
  );
}

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
  /** Render nested UIMessage (subagent output) recursively */
  renderNestedUIMessage?: boolean;
}

/** Render a single UIMessage part (text or tool with nested output) */
function UIMessagePartRenderer({
  part,
  presentationRenderer,
  formRenderer,
  dataViewRenderer,
  depth = 0,
}: {
  part: unknown;
  presentationRenderer?: (key: string, data?: unknown) => React.ReactNode;
  formRenderer?: (
    key: string,
    defaultValues?: Record<string, unknown>
  ) => React.ReactNode;
  dataViewRenderer?: (key: string, items?: unknown[]) => React.ReactNode;
  depth?: number;
}): React.ReactNode {
  if (part === null || part === undefined) return null;
  const p = part as Record<string, unknown>;

  if (p.type === 'text' && typeof p.text === 'string') {
    return (
      <p key={depth} className="text-sm whitespace-pre-wrap">
        {p.text}
      </p>
    );
  }

  if (p.type && String(p.type).startsWith('tool-') && p.output) {
    const output = p.output as unknown;
    if (isUIMessageLike(output)) {
      return (
        <div key={depth} className="border-border ml-2 border-l-2 pl-2">
          <UIMessagePartsRenderer
            parts={output.parts ?? []}
            presentationRenderer={presentationRenderer}
            formRenderer={formRenderer}
            dataViewRenderer={dataViewRenderer}
            depth={depth + 1}
          />
        </div>
      );
    }
    return (
      <pre
        key={depth}
        className="bg-background overflow-x-auto rounded p-2 text-xs"
      >
        {typeof output === 'object'
          ? JSON.stringify(output, null, 2)
          : String(output)}
      </pre>
    );
  }

  return null;
}

/** Render UIMessage parts (subagent output) */
function UIMessagePartsRenderer({
  parts,
  presentationRenderer,
  formRenderer,
  dataViewRenderer,
  depth = 0,
}: {
  parts: unknown[];
  presentationRenderer?: (key: string, data?: unknown) => React.ReactNode;
  formRenderer?: (
    key: string,
    defaultValues?: Record<string, unknown>
  ) => React.ReactNode;
  dataViewRenderer?: (key: string, items?: unknown[]) => React.ReactNode;
  depth?: number;
}): React.ReactNode {
  if (parts.length === 0) return null;
  return (
    <div className="space-y-2">
      {parts.map((part, i) => (
        <UIMessagePartRenderer
          key={`${depth}-${i}`}
          part={part}
          presentationRenderer={presentationRenderer}
          formRenderer={formRenderer}
          dataViewRenderer={dataViewRenderer}
          depth={depth}
        />
      ))}
    </div>
  );
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
  renderNestedUIMessage = true,
}: ToolResultRendererProps) {
  if (result === undefined || result === null) {
    return null;
  }

  if (
    renderNestedUIMessage &&
    isUIMessageLike(result) &&
    (result.parts?.length ?? 0) > 0
  ) {
    return (
      <div className="border-border bg-background/50 mt-2 rounded-md border p-3">
        <UIMessagePartsRenderer
          parts={result.parts ?? []}
          presentationRenderer={presentationRenderer}
          formRenderer={formRenderer}
          dataViewRenderer={dataViewRenderer}
        />
      </div>
    );
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
