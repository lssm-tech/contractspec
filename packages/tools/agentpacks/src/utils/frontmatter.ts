import matter from 'gray-matter';

/**
 * Parsed markdown file with frontmatter metadata and body content.
 */
export interface ParsedMarkdown<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  /** Parsed YAML frontmatter data */
  data: T;
  /** Markdown body content (without frontmatter) */
  content: string;
  /** Raw file content */
  raw: string;
}

/**
 * Parse a markdown file with YAML frontmatter.
 */
export function parseFrontmatter<
  T extends Record<string, unknown> = Record<string, unknown>,
>(source: string): ParsedMarkdown<T> {
  const { data, content } = matter(source);
  return {
    data: data as T,
    content: content.trim(),
    raw: source,
  };
}

/**
 * Serialize frontmatter data and content back to markdown.
 */
export function serializeFrontmatter(
  data: Record<string, unknown>,
  content: string
): string {
  const filtered = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );

  if (Object.keys(filtered).length === 0) {
    return content;
  }

  return matter.stringify(content, filtered);
}
