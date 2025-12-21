/**
 * Import parsing utilities for dependency analysis.
 * Extracted from cli-contracts/src/commands/deps/parse-imports.ts
 */

/**
 * Parse spec imports from source code.
 * Returns the names of imported specs based on file naming conventions.
 *
 * @param sourceCode - The source code to parse
 * @param fromFilePath - The path of the file being parsed (for relative resolution)
 * @returns Array of imported spec names
 */
export function parseImportedSpecNames(
  sourceCode: string,
  _fromFilePath: string
): string[] {
  const imports: string[] = [];

  // Capture relative imports that reference spec-ish files.
  // Examples:
  // import x from './foo.contracts'
  // import { y } from '../bar.event.ts'
  const importRegex =
    /import\s+.*?\s+from\s+['"]([^'"]+\.(?:contracts|contract|operation|operations|event|presentation|workflow|data-view|migration|telemetry|experiment|app-config|integration|knowledge)(?:\.[jt]s)?)['"]/g;

  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(sourceCode)) !== null) {
    const importPath = match[1];
    if (!importPath) continue;
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) continue;

    // Extract base name from the import path
    const pathParts = importPath.split('/');
    const base = pathParts[pathParts.length - 1] ?? '';

    const name = base
      .replace(/\.(ts|js)$/, '')
      .replace(
        /\.(contracts|contract|operation|operations|event|presentation|workflow|data-view|migration|telemetry|experiment|app-config|integration|knowledge)$/,
        ''
      );

    if (name.length > 0) {
      imports.push(name);
    }
  }

  return Array.from(new Set(imports)).sort((a, b) => a.localeCompare(b));
}
