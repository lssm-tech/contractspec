'use client';

import { cn } from '../../../lib/utils';
import { useEffect, useState } from 'react';
import { CopyButton } from '../CopyButton';
import type { CodeBlockProps } from './types';

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = false,
  showCopyButton = true,
  onCopy,
  className,
  ...props
}: CodeBlockProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  const handleCopy = () => {
    onCopy?.();
  };

  useEffect(() => {
    let mounted = true;

    async function highlight() {
      try {
        const { codeToHtml } = await import('shiki');
        const html = await codeToHtml(code, {
          lang: language === 'text' ? 'plaintext' : language,
          // theme: 'github-dark-dimmed',
          theme: 'vitesse-dark',
        });
        if (mounted) {
          setHighlightedHtml(html);
        }
      } catch (err) {
        console.error('Failed to highlight code:', err);
      }
    }

    highlight();

    return () => {
      mounted = false;
    };
  }, [code, language]);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950',
        className
      )}
      {...props}
    >
      {filename && (
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-2 text-xs text-zinc-400">
          <span>{filename}</span>
        </div>
      )}
      <div className="relative">
        {showCopyButton && (
          <CopyButton
            value={code}
            className="absolute top-3 right-3"
            onCopy={handleCopy}
          />
        )}
        {highlightedHtml ? (
          <div
            className={cn(
              'overflow-x-auto p-4 font-mono text-[13px] leading-6',
              '[&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-0',
              '[&_code]:!bg-transparent',
              showLineNumbers && 'line-numbers'
            )}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre
            className={cn(
              'overflow-x-auto p-4 font-mono text-[13px] leading-6 text-zinc-300',
              showLineNumbers && 'line-numbers'
            )}
          >
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
