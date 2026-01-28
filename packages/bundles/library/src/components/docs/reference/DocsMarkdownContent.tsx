'use client';

import { CodeBlock, type CodeLanguage } from '@contractspec/lib.design-system';
import { VStack, HStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import {
  BlockQuote,
  H2,
  H3,
  H4,
  Muted,
  P,
} from '@contractspec/lib.ui-kit-web/ui/typography';
import { parseDocsMarkdown } from './docsMarkdownParser';

const CODE_LANGUAGES = new Set<CodeLanguage>([
  'typescript',
  'tsx',
  'javascript',
  'jsx',
  'bash',
  'shell',
  'json',
  'yaml',
  'graphql',
  'sql',
  'python',
  'go',
  'rust',
  'css',
  'scss',
  'html',
  'markdown',
  'text',
]);

function toCodeLanguage(language?: string): CodeLanguage {
  if (!language) return 'text';
  const normalized = language.toLowerCase() as CodeLanguage;
  return CODE_LANGUAGES.has(normalized) ? normalized : 'text';
}

function renderHeading(level: number, text: string) {
  if (level <= 2) return <H2>{text}</H2>;
  if (level === 3) return <H3>{text}</H3>;
  return <H4>{text}</H4>;
}

export function DocsMarkdownContent({ content }: { content: string }) {
  const blocks = parseDocsMarkdown(content);

  if (!blocks.length) {
    return <Muted>No reference content available.</Muted>;
  }

  return (
    <VStack gap="md">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <VStack key={index}>
                {renderHeading(block.level, block.text)}
              </VStack>
            );
          case 'paragraph':
            return <P key={index}>{block.text}</P>;
          case 'quote':
            return <BlockQuote key={index}>{block.text}</BlockQuote>;
          case 'code':
            return (
              <CodeBlock
                key={index}
                language={toCodeLanguage(block.language)}
                code={block.code}
              />
            );
          case 'list':
            return (
              <VStack key={index} gap="xs">
                {block.items.map((item, itemIndex) => (
                  <HStack key={itemIndex} gap="sm" align="start">
                    <Muted>{block.ordered ? `${itemIndex + 1}.` : '•'}</Muted>
                    <P className="leading-relaxed">{item}</P>
                  </HStack>
                ))}
              </VStack>
            );
          default:
            return null;
        }
      })}
    </VStack>
  );
}
