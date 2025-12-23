'use client';

import * as React from 'react';
import { cn } from '@lssm/lib.ui-kit-web/ui/utils';
import { Button } from '@lssm/lib.design-system';
import { Copy, Check, Play, Download } from 'lucide-react';

export interface CodePreviewProps {
  /** Code content */
  code: string;
  /** Programming language */
  language?: string;
  /** File name */
  filename?: string;
  /** Additional class name */
  className?: string;
  /** Show copy button */
  showCopy?: boolean;
  /** Show execute button (for applicable languages) */
  showExecute?: boolean;
  /** Called when execute is clicked */
  onExecute?: (code: string) => void;
  /** Show download button */
  showDownload?: boolean;
  /** Max height before scroll */
  maxHeight?: number;
}

/**
 * Language display names
 */
const LANGUAGE_NAMES: Record<string, string> = {
  ts: 'TypeScript',
  tsx: 'TypeScript (React)',
  typescript: 'TypeScript',
  js: 'JavaScript',
  jsx: 'JavaScript (React)',
  javascript: 'JavaScript',
  json: 'JSON',
  md: 'Markdown',
  yaml: 'YAML',
  yml: 'YAML',
  bash: 'Bash',
  sh: 'Shell',
  sql: 'SQL',
  py: 'Python',
  python: 'Python',
  go: 'Go',
  rust: 'Rust',
  rs: 'Rust',
};

/**
 * Code preview component with syntax highlighting placeholder
 */
export function CodePreview({
  code,
  language = 'text',
  filename,
  className,
  showCopy = true,
  showExecute = false,
  onExecute,
  showDownload = false,
  maxHeight = 400,
}: CodePreviewProps) {
  const [copied, setCopied] = React.useState(false);

  const displayLanguage = LANGUAGE_NAMES[language.toLowerCase()] ?? language;
  const lines = code.split('\n');

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleDownload = React.useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename ?? `code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, filename, language]);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border',
        'bg-muted/50',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-3 py-1.5',
          'bg-muted/80 border-b'
        )}
      >
        <div className="flex items-center gap-2 text-sm">
          {filename && (
            <span className="text-foreground font-mono">{filename}</span>
          )}
          <span className="text-muted-foreground">{displayLanguage}</span>
        </div>

        <div className="flex items-center gap-1">
          {showExecute && onExecute && (
            <Button
              variant="ghost"
              size="sm"
              onPress={() => onExecute(code)}
              className="h-7 w-7 p-0"
              aria-label="Execute code"
            >
              <Play className="h-3.5 w-3.5" />
            </Button>
          )}

          {showDownload && (
            <Button
              variant="ghost"
              size="sm"
              onPress={handleDownload}
              className="h-7 w-7 p-0"
              aria-label="Download code"
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          )}

          {showCopy && (
            <Button
              variant="ghost"
              size="sm"
              onPress={handleCopy}
              className="h-7 w-7 p-0"
              aria-label={copied ? 'Copied' : 'Copy code'}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Code content */}
      <div className="overflow-auto" style={{ maxHeight }}>
        <pre className="p-3">
          <code className="text-sm">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="text-muted-foreground mr-4 w-8 text-right select-none">
                  {i + 1}
                </span>
                <span className="flex-1">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
