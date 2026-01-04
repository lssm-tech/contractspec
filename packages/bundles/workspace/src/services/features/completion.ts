import type { AnalyzedSpecType } from '@contractspec/module.workspace';

/**
 * Result of context detection.
 */
export interface FeatureContext {
  type: 'operations' | 'events' | 'presentations';
  specType: AnalyzedSpecType;
}

/**
 * Detect which array context the cursor is in within a feature file.
 *
 * @param textBeforeCursor Text from start of file to cursor position.
 * @param textAfterCursor Text from cursor position to end of file (or reasonable lookahead).
 */
export function detectFeatureContext(
  textBeforeCursor: string,
  textAfterCursor: string
): FeatureContext | null {
  // Find the last occurrence of each array type
  const patterns = [
    {
      type: 'operations' as const,
      regex: /operations\s*:\s*\[/g,
      specType: 'operation' as AnalyzedSpecType,
    },
    {
      type: 'events' as const,
      regex: /events\s*:\s*\[/g,
      specType: 'event' as AnalyzedSpecType,
    },
    {
      type: 'presentations' as const,
      regex: /presentations\s*:\s*\[/g,
      specType: 'presentation' as AnalyzedSpecType,
    },
  ];

  let lastMatch: {
    type: 'operations' | 'events' | 'presentations';
    specType: AnalyzedSpecType;
    index: number;
  } | null = null;

  for (const { type, regex, specType } of patterns) {
    let match;
    // Reset regex lastIndex
    regex.lastIndex = 0;
    while ((match = regex.exec(textBeforeCursor)) !== null) {
      if (!lastMatch || match.index > lastMatch.index) {
        lastMatch = { type, specType, index: match.index };
      }
    }
  }

  if (!lastMatch) {
    return null;
  }

  // Check if we're still inside the array (no closing bracket yet)
  const relevantText =
    textBeforeCursor.slice(lastMatch.index) + textAfterCursor;
  // We only care about checking if the bracket matches.
  // Actually, simpler logic: verify we haven't closed the array *before* the cursor.
  // But wait, the cursor is at `textBeforeCursor.length`.
  // The array starts at `lastMatch.index` (plus length of match).
  // We need to count brackets from start of array content.

  // Re-extract match to know length
  const typeStr = lastMatch.type;
  const arrayStartRegex = new RegExp(`${typeStr}\\s*:\\s*\\[`);
  const startMatch = arrayStartRegex.exec(relevantText); // this matches at 0 effectively since we sliced?
  // No, relevantText starts at lastMatch.index.
  // So validation:

  const textFromMatch = textBeforeCursor.slice(lastMatch.index);

  let depth = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < textFromMatch.length; i++) {
    const char = textFromMatch[i];
    const prevChar = i > 0 ? textFromMatch[i - 1] : '';

    // Handle string literals
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (inString) continue;

    if (char === '[') {
      depth++;
    } else if (char === ']') {
      depth--;
      if (depth === 0) {
        // Array is closed before cursor
        return null;
      }
    }
  }

  // If we are here, depth should be > 0 (usually 1 if flat array, or nested)
  // If depth is > 0, we are inside.
  if (depth > 0) {
    return {
      type: lastMatch.type,
      specType: lastMatch.specType,
    };
  }

  return null;
}
