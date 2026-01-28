const HEADING_MATCH = /^#\s+(.+)$/m;

export function extractTitle(content: string, fallback: string): string {
  const match = content.match(HEADING_MATCH);
  return match?.[1]?.trim() || fallback;
}

export function extractSummary(content: string): string | undefined {
  const lines = content.split(/\r?\n/).map((line) => line.trim());
  const filtered = lines.filter(
    (line) =>
      line.length > 0 && !line.startsWith('#') && !line.startsWith('<!--')
  );

  if (!filtered.length) return undefined;

  const summaryLines: string[] = [];
  for (const line of filtered) {
    if (summaryLines.length && line.length === 0) break;
    summaryLines.push(line);
    if (summaryLines.join(' ').length > 200) break;
  }

  const summary = summaryLines.join(' ').trim();
  return summary.length ? summary : undefined;
}
