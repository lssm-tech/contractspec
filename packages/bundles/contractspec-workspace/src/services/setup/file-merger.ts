/**
 * File merger utilities.
 *
 * Deep-merges JSON files without losing user settings.
 */

/**
 * Deep merge two objects, preserving existing user values.
 * New keys are added, but existing keys are NOT overwritten.
 */
export function deepMergePreserve<T extends Record<string, unknown>>(
  existing: T,
  defaults: T
): T {
  const result = { ...existing };

  for (const key of Object.keys(defaults)) {
    const existingValue = existing[key];
    const defaultValue = defaults[key];

    if (existingValue === undefined) {
      // Key doesn't exist in user config, add it
      (result as Record<string, unknown>)[key] = defaultValue;
    } else if (
      isPlainObject(existingValue) &&
      isPlainObject(defaultValue)
    ) {
      // Both are objects, recurse
      (result as Record<string, unknown>)[key] = deepMergePreserve(
        existingValue as Record<string, unknown>,
        defaultValue as Record<string, unknown>
      );
    }
    // If key exists and is not an object, keep user's value
  }

  return result;
}

/**
 * Deep merge two objects, with new values taking precedence.
 * Used when we want to update existing configs.
 */
export function deepMergeOverwrite<T extends Record<string, unknown>>(
  existing: T,
  updates: Partial<T>
): T {
  const result = { ...existing };

  for (const key of Object.keys(updates)) {
    const existingValue = existing[key];
    const updateValue = updates[key];

    if (updateValue === undefined) {
      continue;
    }

    if (isPlainObject(existingValue) && isPlainObject(updateValue)) {
      (result as Record<string, unknown>)[key] = deepMergeOverwrite(
        existingValue as Record<string, unknown>,
        updateValue as Record<string, unknown>
      );
    } else {
      (result as Record<string, unknown>)[key] = updateValue;
    }
  }

  return result;
}

/**
 * Check if a value is a plain object (not array, null, or other).
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Parse JSON safely, returning null on failure.
 */
export function safeParseJson<T>(content: string): T | null {
  try {
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/**
 * Format JSON with consistent indentation.
 */
export function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2) + '\n';
}



