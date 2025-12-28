import * as React from 'react';
import { Button } from '../atoms/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@contractspec/lib.ui-kit-web/ui/dropdown-menu';
// } from './DropdownMenu';

type Provider = 'chatgpt' | 'claude';

export interface AiLinkButtonProps {
  href: string; // canonical or .md URL
  provider?: Provider;
  className?: string;
}

function buildPrompt(href: string) {
  return `Please load and use this markdown context when answering: ${href}`;
}

function buildProviderUrl(provider: Provider, href: string) {
  const prompt = encodeURIComponent(buildPrompt(href));
  switch (provider) {
    case 'claude':
      return `https://claude.ai/new?prompt=${prompt}`;
    case 'chatgpt':
    default:
      return `https://chatgpt.com/?q=${prompt}`;
  }
}

export function AiLinkButton({ href, className }: AiLinkButtonProps) {
  const copyLink = React.useCallback(() => {
    try {
      navigator.clipboard?.writeText(href).catch(() => {
        /* ignore */
      });
    } catch (_e) {
      /* ignore */
    }
  }, [href]);

  const openChatGPT = React.useCallback(() => {
    const url = buildProviderUrl('chatgpt', href);
    try {
      navigator.clipboard?.writeText(href).catch(() => {
        /* ignore */
      });
    } catch (_e) {
      /* ignore */
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [href]);

  const openClaude = React.useCallback(() => {
    const url = buildProviderUrl('claude', href);
    try {
      navigator.clipboard?.writeText(href).catch(() => {
        /* ignore */
      });
    } catch (_e) {
      /* ignore */
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [href]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={className}
          variant="secondary"
          aria-label="AI actions"
        >
          AI
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyLink}>Get link for AI</DropdownMenuItem>
        <DropdownMenuItem onClick={openChatGPT}>
          Open in ChatGPT
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openClaude}>Open in Claude</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
