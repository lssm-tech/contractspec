'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  ErrorState,
  LoaderBlock,
} from '@contractspec/lib.design-system';
import { Card } from '@contractspec/lib.ui-kit-web/ui/card';
import { Badge } from '@contractspec/lib.ui-kit-web/ui/badge';
import type {
  PresentationTarget,
  TransformEngine,
} from '@contractspec/lib.contracts';
import type { TemplateId } from './lib/types';

import { useTemplateRuntime } from './lib/runtime-context';

export interface MarkdownViewProps {
  /** Optional override, otherwise comes from context */
  templateId?: TemplateId;
  presentationId?: string;
  className?: string;
}

interface MarkdownOutput {
  mimeType: string;
  body: string;
}

/**
 * MarkdownView renders template presentations as markdown using TransformEngine.
 * It allows switching between available presentations for the template.
 */
export function MarkdownView({
  templateId: propTemplateId,
  presentationId,
  className,
}: MarkdownViewProps) {
  const {
    engine,
    template,
    templateId: contextTemplateId,
    resolvePresentation,
    fetchData,
  } = useTemplateRuntime();

  // Prefer prop if given, else context
  const templateId = propTemplateId ?? contextTemplateId;
  const presentations = (template?.presentations as string[]) ?? [];

  const [selectedPresentation, setSelectedPresentation] = useState<string>('');
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize selected presentation
  useEffect(() => {
    if (presentationId && presentations.includes(presentationId)) {
      setSelectedPresentation(presentationId);
    } else if (presentations.length > 0 && !selectedPresentation) {
      setSelectedPresentation(presentations[0] ?? '');
    }
  }, [presentationId, presentations, selectedPresentation]);

  // Render markdown when presentation changes
  const renderMarkdown = useCallback(async () => {
    if (!selectedPresentation || !engine) return;

    setLoading(true);
    setError(null);

    try {
      if (!resolvePresentation) {
        throw new Error('resolvePresentation not available in runtime context');
      }

      const descriptor = resolvePresentation(selectedPresentation);

      if (!descriptor) {
        throw new Error(
          `Presentation descriptor not found: ${selectedPresentation}`
        );
      }

      // Fetch data for this presentation using the data fetcher from context
      const dataResult = await fetchData(selectedPresentation);

      // Render to markdown using the engine with data context
      const result = await engine.render<MarkdownOutput>(
        'markdown' as PresentationTarget,
        descriptor as Parameters<TransformEngine['render']>[1],
        { data: dataResult.data } // Pass data in context for schema-driven rendering
      );

      setMarkdownContent(result.body);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to render markdown')
      );
    } finally {
      setLoading(false);
    }
  }, [
    selectedPresentation,
    templateId,
    engine,
    resolvePresentation,
    fetchData,
  ]);

  useEffect(() => {
    renderMarkdown();
  }, [renderMarkdown]);

  if (!presentations.length) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <p className="text-muted-foreground">
            No presentations available for this template.
          </p>
        </div>
      </Card>
    );
  }

  // Copy markdown to clipboard
  const handleCopy = useCallback(() => {
    if (markdownContent) {
      navigator.clipboard.writeText(markdownContent);
    }
  }, [markdownContent]);

  return (
    <div className={className}>
      {/* Presentation Selector */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm font-medium">
          Presentation:
        </span>
        {presentations.map((name) => (
          <Button
            key={name}
            variant={selectedPresentation === name ? 'default' : 'outline'}
            size="sm"
            onPress={() => setSelectedPresentation(name)}
          >
            {formatPresentationName(name)}
          </Button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary">LLM-friendly</Badge>
          <Button
            variant="outline"
            size="sm"
            onPress={handleCopy}
            disabled={!markdownContent || loading}
          >
            Copy
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <Card className="overflow-hidden">
        {loading && <LoaderBlock label="Rendering markdown..." />}

        {error && (
          <ErrorState
            title="Render failed"
            description={error.message}
            onRetry={renderMarkdown}
            retryLabel="Retry"
          />
        )}

        {!loading && !error && markdownContent && (
          <div className="p-6">
            <MarkdownRenderer content={markdownContent} />
          </div>
        )}

        {!loading && !error && !markdownContent && (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">
              Select a presentation to view its markdown output.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

/**
 * Simple markdown renderer using pre-formatted display
 * For production, consider using react-markdown or similar
 */
export function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const rendered: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';

    // Check for table (starts with | and next line is separator)
    if (line.startsWith('|') && lines[i + 1]?.match(/^\|[\s-|]+\|$/)) {
      const tableLines: string[] = [line];
      i++;
      // Collect all table lines
      while (i < lines.length && (lines[i]?.startsWith('|') ?? false)) {
        tableLines.push(lines[i] ?? '');
        i++;
      }
      rendered.push(renderTable(tableLines, rendered.length));
      continue;
    }

    // Headers
    if (line.startsWith('# ')) {
      rendered.push(
        <h1 key={i} className="mb-4 text-2xl font-bold">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      rendered.push(
        <h2 key={i} className="mt-6 mb-3 text-xl font-semibold">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      rendered.push(
        <h3 key={i} className="mt-4 mb-2 text-lg font-medium">
          {line.slice(4)}
        </h3>
      );
    }
    // Blockquotes
    else if (line.startsWith('> ')) {
      rendered.push(
        <blockquote
          key={i}
          className="text-muted-foreground my-2 border-l-4 border-violet-500/50 pl-4 italic"
        >
          {line.slice(2)}
        </blockquote>
      );
    }
    // List items
    else if (line.startsWith('- ')) {
      rendered.push(
        <li key={i} className="ml-4 list-disc">
          {formatInlineMarkdown(line.slice(2))}
        </li>
      );
    }
    // Bold text (lines starting with **)
    else if (line.startsWith('**') && line.includes(':**')) {
      const [label, ...rest] = line.split(':**');
      rendered.push(
        <p key={i} className="my-1">
          <strong>{label?.slice(2)}:</strong>
          {rest.join(':**')}
        </p>
      );
    }
    // Italic text (lines starting with _)
    else if (line.startsWith('_') && line.endsWith('_')) {
      rendered.push(
        <p key={i} className="text-muted-foreground my-1 italic">
          {line.slice(1, -1)}
        </p>
      );
    }
    // Empty lines
    else if (!line.trim()) {
      rendered.push(<div key={i} className="h-2" />);
    }
    // Regular text
    else {
      rendered.push(
        <p key={i} className="my-1">
          {formatInlineMarkdown(line)}
        </p>
      );
    }

    i++;
  }

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {rendered}
    </div>
  );
}

/**
 * Render a markdown table
 */
function renderTable(lines: string[], keyPrefix: number): React.ReactNode {
  if (lines.length < 2) return null;

  const parseRow = (row: string) =>
    row
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());

  const headers = parseRow(lines[0] ?? '');
  // Skip separator line (index 1)
  const dataRows = lines.slice(2).map(parseRow);

  return (
    <div key={`table-${keyPrefix}`} className="my-4 overflow-x-auto">
      <table className="border-border min-w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-muted/50">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="border-border border px-3 py-2 text-left font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-muted/30">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="border-border border px-3 py-2">
                  {formatInlineMarkdown(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Format inline markdown (bold, code)
 */
function formatInlineMarkdown(text: string): React.ReactNode {
  // Handle **bold** text
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    // Handle `code` text
    if (part.includes('`')) {
      const codeParts = part.split(/(`[^`]+`)/g);
      return codeParts.map((cp, j) => {
        if (cp.startsWith('`') && cp.endsWith('`')) {
          return (
            <code
              key={`${i}-${j}`}
              className="rounded bg-violet-500/10 px-1.5 py-0.5 font-mono text-sm"
            >
              {cp.slice(1, -1)}
            </code>
          );
        }
        return cp;
      });
    }
    return part;
  });
}

/**
 * Format presentation name for display
 */
function formatPresentationName(name: string): string {
  // Extract the last part after the last dot
  const parts = name.split('.');
  const lastPart = parts[parts.length - 1] ?? name;
  // Convert kebab-case to Title Case
  return lastPart
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
