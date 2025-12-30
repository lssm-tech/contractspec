/**
 * Completion provider for spec names in feature files.
 *
 * Provides auto-completion for operation, event, and presentation names
 * when editing feature files.
 */

import * as vscode from 'vscode';
import {
  type AnalyzedSpecType,
  scanAllSpecsFromSource,
} from '@contractspec/module.workspace';

/**
 * Cached spec data with file modification time.
 */
interface CachedSpec {
  name: string;
  version: string;
  type: AnalyzedSpecType;
  file: string;
  relativePath: string;
}

/**
 * Cache for discovered specs.
 */
interface SpecCache {
  specs: CachedSpec[];
  lastUpdate: number;
}

let specCache: SpecCache | null = null;
const CACHE_TTL_MS = 30_000; // 30 seconds

/**
 * Get the glob patterns for spec files.
 */
const SPEC_FILE_PATTERNS = [
  '**/*.contracts.ts',
  '**/*.event.ts',
  '**/*.presentation.ts',
];

/**
 * Scan workspace for all specs and cache results.
 */
async function discoverSpecs(): Promise<CachedSpec[]> {
  const now = Date.now();

  // Return cached results if still valid
  if (specCache && now - specCache.lastUpdate < CACHE_TTL_MS) {
    return specCache.specs;
  }

  const specs: CachedSpec[] = [];
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    return specs;
  }

  for (const folder of workspaceFolders) {
    for (const pattern of SPEC_FILE_PATTERNS) {
      const files = await vscode.workspace.findFiles(
        new vscode.RelativePattern(folder, pattern),
        '**/node_modules/**'
      );

      for (const file of files) {
        try {
          const document = await vscode.workspace.openTextDocument(file);
          const content = document.getText();
          const filePath = file.fsPath;
          const relativePath = vscode.workspace.asRelativePath(file);

          const results = scanAllSpecsFromSource(content, filePath);

          for (const result of results) {
            if (result.name && result.version !== undefined) {
              specs.push({
                name: result.name,
                version: result.version,
                type: result.specType,
                file: filePath,
                relativePath,
              });
            }
          }
        } catch {
          // Skip files that can't be read
        }
      }
    }
  }

  // Update cache
  specCache = { specs, lastUpdate: now };

  return specs;
}

/**
 * Invalidate the spec cache.
 */
export function invalidateSpecCache(): void {
  specCache = null;
}

/**
 * Detect which array context the cursor is in.
 */
function detectArrayContext(
  document: vscode.TextDocument,
  position: vscode.Position
): 'operations' | 'events' | 'presentations' | null {
  // Get text from start of document to cursor position
  const textBefore = document.getText(
    new vscode.Range(new vscode.Position(0, 0), position)
  );

  // Find the last occurrence of each array type
  const patterns = [
    { type: 'operations' as const, regex: /operations\s*:\s*\[/g },
    { type: 'events' as const, regex: /events\s*:\s*\[/g },
    { type: 'presentations' as const, regex: /presentations\s*:\s*\[/g },
  ];

  let lastMatch: {
    type: 'operations' | 'events' | 'presentations';
    index: number;
  } | null = null;

  for (const { type, regex } of patterns) {
    let match;
    while ((match = regex.exec(textBefore)) !== null) {
      if (!lastMatch || match.index > lastMatch.index) {
        lastMatch = { type, index: match.index };
      }
    }
  }

  if (!lastMatch) {
    return null;
  }

  // Check if we're still inside the array (no closing bracket yet)
  const textAfterArrayStart = textBefore.slice(lastMatch.index);
  let depth = 0;
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < textAfterArrayStart.length; i++) {
    const char = textAfterArrayStart[i];
    const prevChar = i > 0 ? textAfterArrayStart[i - 1] : '';

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
        // Array is closed, cursor is outside
        return null;
      }
    }
  }

  return lastMatch.type;
}

/**
 * Get the type filter for an array context.
 */
function getTypeFilter(
  context: 'operations' | 'events' | 'presentations'
): AnalyzedSpecType {
  switch (context) {
    case 'operations':
      return 'operation';
    case 'events':
      return 'event';
    case 'presentations':
      return 'presentation';
  }
}

/**
 * Completion provider for spec names in feature files.
 */
export class SpecNameCompletionProvider
  implements vscode.CompletionItemProvider
{
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
    _context: vscode.CompletionContext
  ): Promise<vscode.CompletionItem[] | undefined> {
    // Only provide completions in feature files
    if (!document.fileName.includes('.feature.')) {
      return undefined;
    }

    // Detect which array we're in
    const arrayContext = detectArrayContext(document, position);
    if (!arrayContext) {
      return undefined;
    }

    // Get all specs
    const allSpecs = await discoverSpecs();

    // Filter by type
    const typeFilter = getTypeFilter(arrayContext);
    const filteredSpecs = allSpecs.filter((spec) => spec.type === typeFilter);

    // Create completion items
    const items: vscode.CompletionItem[] = [];

    for (const spec of filteredSpecs) {
      const item = new vscode.CompletionItem(
        spec.name,
        vscode.CompletionItemKind.Reference
      );

      item.detail = `v${spec.version} • ${spec.relativePath}`;
      item.documentation = new vscode.MarkdownString(
        `**${spec.type}**: \`${spec.name}\`\n\n` +
          `Version: ${spec.version}\n\n` +
          `File: ${spec.relativePath}`
      );

      // Insert the full object syntax
      item.insertText = `{ name: '${spec.name}', version: ${spec.version} }`;

      // Sort by name
      item.sortText = spec.name;

      items.push(item);
    }

    return items;
  }
}
