/**
 * Feature file editing services.
 */

import type { AnalyzedSpecType } from '@contractspec/module.workspace';

/**
 * Result of a computation to edit a feature file.
 */
export interface FeatureEdit {
  index: number;
  text: string;
}

/**
 * Compute the edit required to add a spec reference to a feature file.
 * Returns the index to insert at and the text to insert.
 */
export function computeAddSpecEdit(
  content: string,
  spec: { key: string; version: string | number; type: string }
): FeatureEdit | null {
  const arrayName = getArrayNameForSpecType(spec.type);

  // Find the array in the document
  const arrayPattern = new RegExp(`${arrayName}\\s*:\\s*\\[`, 'g');
  const match = arrayPattern.exec(content);

  if (match) {
    // Insert after the opening bracket
    const insertIndex = match.index + match[0].length;

    // Format the reference
    const versionStr =
      typeof spec.version === 'string' ? `'${spec.version}'` : spec.version;
    const refText = `\n    { key: '${spec.key}', version: ${versionStr} },`;

    return {
      index: insertIndex,
      text: refText,
    };
  }

  return null;
}

/**
 * Get array name in feature spec for a given spec type.
 */
export function getArrayNameForSpecType(specType: string): string {
  switch (specType) {
    case 'operation':
    case 'command':
    case 'query':
      return 'operations';
    case 'event':
      return 'events';
    case 'presentation':
      return 'presentations';
    case 'experiment':
      return 'experiments';
    case 'workflow':
      return 'workflows'; // Assuming workflows are supported similarly
    default:
      return 'operations';
  }
}
