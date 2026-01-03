/**
 * Remove reference strategy.
 *
 * Removes a broken reference from a feature file.
 */

import type { FixableIssue, FixOptions, FixResult, FixFileChange } from '../types';
import type { FsAdapter } from '../../../ports/fs';

/**
 * Remove a specific reference from a feature file.
 *
 * Parses the feature file content and removes the matching reference
 * from the appropriate array (operations, events, presentations, etc.).
 */
export async function removeReferenceStrategy(
  issue: FixableIssue,
  options: FixOptions,
  adapters: { fs: FsAdapter }
): Promise<FixResult> {
  const { fs } = adapters;
  const { ref, featureFile, specType } = issue;

  try {
    // Read the feature file
    const content = await fs.readFile(featureFile);
    const previousContent = content;

    // Find and remove the reference
    const updatedContent = removeRefFromContent(content, ref, specType);

    if (updatedContent === content) {
      return {
        success: false,
        strategy: 'remove-reference',
        issue,
        filesChanged: [],
        error: `Could not find reference ${ref.key}.v${ref.version} in ${featureFile}`,
      };
    }

    const filesChanged: FixFileChange[] = [];

    // Apply the change (unless dry run)
    if (!options.dryRun) {
      await fs.writeFile(featureFile, updatedContent);
      filesChanged.push({
        path: featureFile,
        action: 'modified',
        previousContent,
      });
    } else {
      // For dry run, still report what would change
      filesChanged.push({
        path: featureFile,
        action: 'modified',
      });
    }

    return {
      success: true,
      strategy: 'remove-reference',
      issue,
      filesChanged,
    };
  } catch (error) {
    return {
      success: false,
      strategy: 'remove-reference',
      issue,
      filesChanged: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Remove a reference from feature file content.
 *
 * Handles different array formats:
 * - operations: [{ key: 'x', version: 'y' }]
 * - events: [{ key: 'x', version: 'y' }]
 * - presentations: [{ key: 'x', version: 'y' }]
 */
function removeRefFromContent(
  content: string,
  ref: { key: string; version: string },
  specType: string
): string {
  // Map spec type to array name in feature file
  const arrayName = getArrayName(specType);
  if (!arrayName) {
    return content;
  }

  // Create regex pattern to match the reference object
  // Matches: { key: 'key', version: 'version' } with optional trailing comma
  const keyEscaped = escapeRegex(ref.key);
  const versionEscaped = escapeRegex(ref.version);

  // Pattern matches the object with key and version in any order
  // and handles both single and double quotes
  const patterns = [
    // key first, then version
    new RegExp(
      `\\{\\s*key:\\s*['"]${keyEscaped}['"],\\s*version:\\s*['"]${versionEscaped}['"]\\s*\\},?\\s*`,
      'g'
    ),
    // version first, then key
    new RegExp(
      `\\{\\s*version:\\s*['"]${versionEscaped}['"],\\s*key:\\s*['"]${keyEscaped}['"]\\s*\\},?\\s*`,
      'g'
    ),
  ];

  let result = content;
  for (const pattern of patterns) {
    result = result.replace(pattern, '');
  }

  // Clean up any trailing commas left after removal
  result = cleanupTrailingCommas(result);

  return result;
}

/**
 * Get the array name in a feature file for a spec type.
 */
function getArrayName(specType: string): string | undefined {
  const mapping: Record<string, string> = {
    operation: 'operations',
    event: 'events',
    presentation: 'presentations',
    experiment: 'experiments',
    capability: 'capabilities',
    workflow: 'workflows',
    'data-view': 'dataViews',
    form: 'forms',
  };

  return mapping[specType];
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Clean up trailing commas that may be left after removing elements.
 */
function cleanupTrailingCommas(content: string): string {
  // Remove trailing comma before closing bracket
  return content.replace(/,(\s*)\]/g, '$1]');
}
