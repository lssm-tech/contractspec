/**
 * Variable resolution utilities.
 * Handles simple static variable extraction and substitution in source blocks.
 */

import { findMatchingDelimiter } from './matchers';

/**
 * Extract top-level array constants from source code.
 * Example: const OWNERS = ['alice', 'bob'] as const;
 */
export function extractArrayConstants(code: string): Map<string, string> {
  const variables = new Map<string, string>();
  
  // Regex to find potential array constants
  // Matches: const NAME = [ ...
  const regex = /const\s+(\w+)\s*=\s*\[/g;
  let match;

  while ((match = regex.exec(code)) !== null) {
    const name = match[1];
    const startIndex = match.index + match[0].length - 1; // pointing to [
    const endIndex = findMatchingDelimiter(code, startIndex, '[', ']');
    
    if (endIndex !== -1) {
      // Extract the full array string: ['a', 'b']
      const value = code.substring(startIndex, endIndex + 1);
      if (name) {
          variables.set(name, value);
      }
    }
  }

  return variables;
}

/**
 * Substitute spread variables in a source block with their resolved values.
 * Example: owners: [...OWNERS] -> owners: ['alice', 'bob']
 */
export function resolveVariablesInBlock(
  block: string,
  variables: Map<string, string>
): string {
  if (variables.size === 0) return block;

  // Look for spreads: ...NAME
  return block.replace(/\.\.\.(\w+)/g, (match, name) => {
    const value = variables.get(name);
    if (value) {
      // Remove the surrounding brackets from the value if we are spreading into an array
      // But ... is also used in objects. 
      // In the array case: owners: [...OWNERS] -> owners: ['a', 'b']
      // OWNERS = ['a', 'b']
      
      // We need to strip the outer [ and ] from the value to "spread" it
      if (value.startsWith('[') && value.endsWith(']')) {
        return value.substring(1, value.length - 1);
      }
      return value;
    }
    return match;
  });
}
