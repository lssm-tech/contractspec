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
  let totalLength = 0;

  for (const line of filtered) {
    if (totalLength > 200) break;
    summaryLines.push(line);
    totalLength += line.length;
  }

  const summary = summaryLines.join('\n').trim();
  return summary.length ? summary : undefined;
}
