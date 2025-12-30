import { cn } from '@/lib/utils';
import * as React from 'react';
import { codeToHtml } from 'shiki';
import { CopyButton } from './copy-button';

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export async function CodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = false,
  className,
  ...props
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: 'github-dark-dimmed', // You can make this configurable or match your app's theme
    transformers: [
      // Add transformers here if needed (e.g. for line highlighting)
    ],
  });

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border bg-zinc-950 dark:border-zinc-800',
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
        <CopyButton value={code} className="absolute top-4 right-4" />
        <div
          className={cn(
            'overflow-x-auto p-4 font-mono text-[13px] leading-6',
            showLineNumbers && 'line-numbers'
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
