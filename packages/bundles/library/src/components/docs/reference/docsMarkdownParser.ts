export type DocsMarkdownBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'code'; language?: string; code: string }
  | { type: 'quote'; text: string };
const METADATA_SECTION = /^##\s+Metadata[\s\S]*?(?=^##\s|^#\s|Z)/m;
function stripMetadata(content: string) {
  const withoutTitle = content.replace(/^#\s+.*\n+/m, '');
  return withoutTitle.replace(METADATA_SECTION, '');
}
function isBlockStart(line: string) {
  return (
    /^#{1,4}\s+/.test(line) ||
    /^```/.test(line) ||
    /^\s*[-*]\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line) ||
    /^>\s+/.test(line)
  );
}
export function parseDocsMarkdown(content: string): DocsMarkdownBlock[] {
  const lines = stripMetadata(content).split(/\r?\n/);
  const blocks: DocsMarkdownBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i] ?? '';
    if (line.startsWith('<!-- @generated')) {
      i += 1;
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      i += 1;
      continue;
    }
    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !(lines[i] ?? '').trim().startsWith('```')) {
        codeLines.push(lines[i] ?? '');
        i += 1;
      }
      i += 1;
      blocks.push({
        type: 'code',
        language: language || 'text',
        code: codeLines.join('\n'),
      });
      continue;
    }
    if (/^#{1,4}\s+/.test(trimmed)) {
      const level = trimmed.match(/^#{1,4}/)?.[0].length ?? 2;
      blocks.push({
        type: 'heading',
        level,
        text: trimmed.replace(/^#{1,4}\s+/, ''),
      });
      i += 1;
      continue;
    }
    if (/^>\s+/.test(trimmed)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s+/.test((lines[i] ?? '').trim())) {
        quoteLines.push((lines[i] ?? '').trim().replace(/^>\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'quote', text: quoteLines.join(' ') });
      continue;
    }
    if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const ordered = /^\d+\.\s+/.test(trimmed);
      const items: string[] = [];
      while (i < lines.length && isBlockStart((lines[i] ?? '').trim())) {
        const itemLine = (lines[i] ?? '').trim();
        if (ordered && /^\d+\.\s+/.test(itemLine)) {
          items.push(itemLine.replace(/^\d+\.\s+/, ''));
        } else if (!ordered && /^[-*]\s+/.test(itemLine)) {
          items.push(itemLine.replace(/^[-*]\s+/, ''));
        } else {
          break;
        }
        i += 1;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }
    const paragraphLines: string[] = [];
    while (i < lines.length && !isBlockStart((lines[i] ?? '').trim())) {
      const paragraphLine = (lines[i] ?? '').trim();
      if (!paragraphLine) break;
      paragraphLines.push(paragraphLine);
      i += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
  }
  return blocks;
}
