import type React from 'react';
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts/presentations.v2';
import { presentationEngine } from './engine';
import { componentMap } from './registry';
import { renderFeaturePresentation } from '@lssm/lib.contracts/client/react/feature-render';
import type { ComponentMap } from './types';

/**
 * Render a presentation descriptor to markdown.
 * Returns the markdown content as a string.
 */
export async function renderPresentationToMarkdown(
  descriptor: PresentationDescriptorV2
): Promise<string> {
  const result = await presentationEngine.render<{
    mimeType: string;
    body: string;
  }>('markdown', descriptor);

  return result.body;
}

/**
 * Render a presentation descriptor to React element.
 * Returns the React element or null if component not found.
 */
export async function renderPresentationToReact(
  descriptor: PresentationDescriptorV2,
  customComponentMap?: ComponentMap
): Promise<React.ReactElement | null> {
  const map = customComponentMap ?? componentMap;
  const element = await renderFeaturePresentation(
    presentationEngine,
    'react',
    descriptor,
    {
      componentMap: map,
    }
  );

  if (element && typeof element === 'object' && 'type' in element) {
    return element as React.ReactElement;
  }

  return null;
}

/**
 * Get markdown URL for a given route.
 * Uses llms. subdomain and .md extension.
 */
export function getMarkdownUrl(route: string, baseUrl?: string): string {
  const base = baseUrl ?? 'https://contractspec.lssm.tech/mdx';
  const llmsBase = base.replace(
    'contractspec.lssm.tech',
    'llms.contractspec.lssm.tech'
  );

  // Normalize route
  const normalizedRoute = route === '/' ? '/' : route.replace(/\/$/, '');
  return `${llmsBase}${normalizedRoute}`;

  // Add .md extension if not root
  // const path = normalizedRoute === '/' ? '/index.md' : `${normalizedRoute}.md`;
  // return `${llmsBase}${path}`;
}

/**
 * Get AI chat URLs for various providers.
 */
export interface AIChatProvider {
  name: string;
  getUrl: (url: string) => string;
}

export const aiChatProviders: AIChatProvider[] = [
  {
    name: 'ChatGPT',
    getUrl: (url: string) =>
      `https://chatgpt.com/?q=${encodeURIComponent(url)}`,
  },
  {
    name: 'Claude',
    getUrl: (url: string) =>
      `https://claude.ai/new?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Grok',
    getUrl: (url: string) =>
      `https://x.com/i/grok?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Mistral',
    getUrl: (url: string) =>
      `https://mistral.ai/chat?url=${encodeURIComponent(url)}`,
  },
  {
    name: 'Perplexity',
    getUrl: (url: string) =>
      `https://www.perplexity.ai/?q=${encodeURIComponent(url)}`,
  },
];
