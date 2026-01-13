import * as vscode from 'vscode';
import { type AnalyzedSpecType } from '@contractspec/module.workspace';
import { features, getAllSpecs } from '@contractspec/bundle.workspace';
import { getIntegrityResult } from '../diagnostics/index';

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
 * Scan workspace for all specs and cache results.
 */
async function discoverSpecs(): Promise<CachedSpec[]> {
  // Use cached integrity result if available
  const result = getIntegrityResult();

  if (result) {
    const allSpecs = getAllSpecs(result.inventory);

    return allSpecs.map((spec) => ({
      name: spec.key,
      version: spec.version,
      type: spec.type,
      file: spec.file,
      relativePath: vscode.workspace.asRelativePath(spec.file),
    }));
  }

  // Fallback: return empty (or trigger analysis via command?)
  // For now, assume integrity analysis runs on startup.
  return [];
}

/**
 * Invalidate the spec cache.
 */
export function invalidateSpecCache(): void {
  // No-op, handled by integrity refresh
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
    const textBefore = document.getText(
      new vscode.Range(new vscode.Position(0, 0), position)
    );
    // Needed to check if array closed? features logic uses "textAfterArrayStart"
    // But detectFeatureContext expects textBefore and textAfter.
    // Let's pass simple "after"
    const textAfter = document.getText(
      new vscode.Range(position, new vscode.Position(document.lineCount, 0))
    );

    const context = features.detectFeatureContext(textBefore, textAfter);
    if (!context) {
      return undefined;
    }

    // Get all specs
    const allSpecs = await discoverSpecs();

    // Filter by type
    const filteredSpecs = allSpecs.filter(
      (spec) => spec.type === context.specType
    );

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
      item.insertText = `{ key: '${spec.name}', version: ${spec.version} }`;

      // Sort by name
      item.sortText = spec.name;

      items.push(item);
    }

    return items;
  }
}
