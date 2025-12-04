'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@lssm/lib.ui-kit-web/ui/dropdown-menu';
import {
  getMarkdownUrl,
  aiChatProviders,
  hasPresentation,
} from '@lssm/bundle.contractspec-studio/presentation/presentations';

interface OpenWithAIProps {
  /** Custom route path (defaults to current pathname) */
  route?: string;
  /** Custom base URL for markdown links */
  baseUrl?: string;
  /** Show the button even if no presentation exists */
  forceShow?: boolean;
  /** Custom button label */
  label?: string;
}

/**
 * "Open with AI" dropdown component.
 * Provides quick access to markdown version and AI chat providers.
 */
export function OpenWithAI({
  route,
  baseUrl,
  forceShow = false,
  label = 'Open with AI',
}: OpenWithAIProps) {
  const pathname = usePathname();
  const currentRoute = route ?? pathname;
  const [copied, setCopied] = useState(false);

  // Check if this route has a presentation
  const hasPresentationForRoute = hasPresentation(currentRoute);

  // Don't show if no presentation and not forced
  if (!hasPresentationForRoute && !forceShow) {
    return null;
  }

  const markdownUrl = getMarkdownUrl(currentRoute, baseUrl);

  const handleCopyMarkdownLink = async () => {
    try {
      await navigator.clipboard.writeText(markdownUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleOpenMarkdown = () => {
    window.open(markdownUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenAIChat = (providerUrl: string) => {
    window.open(providerUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="btn-ghost inline-flex items-center gap-2 text-sm"
          aria-label="Open with AI"
        >
          <Sparkles size={16} />
          {label}
          <ChevronDown size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>AI Access</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleOpenMarkdown}>
          <ExternalLink size={16} className="mr-2" />
          Open markdown version
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleCopyMarkdownLink}>
          <Copy size={16} className="mr-2" />
          {copied ? 'Copied!' : 'Copy markdown link'}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Sparkles size={16} className="mr-2" />
            Open in AI chat
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {aiChatProviders.map((provider) => (
              <DropdownMenuItem
                key={provider.name}
                onClick={() => handleOpenAIChat(provider.getUrl(markdownUrl))}
              >
                {provider.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



