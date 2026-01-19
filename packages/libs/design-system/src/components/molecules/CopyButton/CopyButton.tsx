'use client';

import { cn } from '../../../lib/utils';
import { Check, Copy } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { CopyButtonProps } from './types';

export function CopyButton({
  value,
  onCopy,
  className,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!hasCopied) return;
    const timeout = setTimeout(() => {
      setHasCopied(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setHasCopied(true);
      onCopy?.();
    } catch {
      return;
    }
  }, [value, onCopy]);

  return (
    <button
      type="button"
      className={cn(
        'relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-md',
        'border border-zinc-700 bg-zinc-800 text-zinc-400',
        'transition-all hover:bg-zinc-700 hover:text-zinc-100',
        'focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:outline-none',
        className
      )}
      onClick={copyToClipboard}
      aria-label={hasCopied ? 'Copied' : 'Copy to clipboard'}
      {...props}
    >
      <span className="sr-only">{hasCopied ? 'Copied' : 'Copy'}</span>
      {hasCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}
