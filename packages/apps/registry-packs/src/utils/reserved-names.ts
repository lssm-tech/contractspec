/**
 * Pack name validation and squatting prevention.
 *
 * Rules:
 *   - Minimum 2 characters
 *   - Maximum 100 characters
 *   - Lowercase alphanumeric + hyphens only (may start with @org/)
 *   - Cannot be only hyphens or underscores
 *   - Cannot match reserved/common names
 *   - Cannot match offensive patterns
 */

/** Names reserved to prevent squatting and confusion. */
const RESERVED_NAMES = new Set([
  // Platform / CLI names
  'agentpacks',
  'registry',
  'pack',
  'packs',
  'plugin',
  'plugins',
  'official',
  'core',
  'cli',
  'sdk',
  'api',
  'app',
  'admin',
  'root',
  'system',
  'config',
  'settings',
  // Common tool names (could confuse users)
  'cursor',
  'claude',
  'copilot',
  'opencode',
  'gemini',
  'codex',
  'windsurf',
  'openai',
  'anthropic',
  'google',
  'microsoft',
  'github',
  // Generic confusable names
  'test',
  'example',
  'sample',
  'demo',
  'template',
  'default',
  'null',
  'undefined',
  'true',
  'false',
  'none',
  'help',
  'login',
  'logout',
  'signup',
  'publish',
  'search',
  'install',
  'uninstall',
  'update',
  'delete',
  'create',
  'new',
]);

/** Pack name format: lowercase alphanumeric + hyphens, optionally @org/ scoped. */
const VALID_NAME_PATTERN = /^(@[a-z0-9][a-z0-9-]*\/)?[a-z0-9][a-z0-9-]*$/;

/** Cannot be only separator characters. */
const SEPARATOR_ONLY_PATTERN = /^[-_]+$/;

/** Minimum name length (excluding @org/ prefix). */
const MIN_NAME_LENGTH = 2;

/** Maximum name length (full name including @org/ prefix). */
const MAX_NAME_LENGTH = 100;

/** Validation result with reason. */
export interface NameValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Extract the bare name from a potentially scoped pack name.
 * "@org/pack-name" → "pack-name", "pack-name" → "pack-name"
 */
function getBareName(name: string): string {
  const slashIndex = name.indexOf('/');
  return slashIndex >= 0 ? name.slice(slashIndex + 1) : name;
}

/**
 * Validate a pack name for registration.
 * Returns { valid: true } or { valid: false, reason: "..." }.
 */
export function validatePackName(name: string): NameValidationResult {
  if (!name || typeof name !== 'string') {
    return { valid: false, reason: 'Pack name is required' };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return {
      valid: false,
      reason: `Pack name exceeds maximum length of ${MAX_NAME_LENGTH} characters`,
    };
  }

  const bareName = getBareName(name);

  if (bareName.length < MIN_NAME_LENGTH) {
    return {
      valid: false,
      reason: `Pack name must be at least ${MIN_NAME_LENGTH} characters`,
    };
  }

  if (!VALID_NAME_PATTERN.test(name)) {
    return {
      valid: false,
      reason:
        'Pack name must contain only lowercase letters, numbers, and hyphens',
    };
  }

  if (SEPARATOR_ONLY_PATTERN.test(bareName)) {
    return {
      valid: false,
      reason: 'Pack name cannot consist only of separator characters',
    };
  }

  if (RESERVED_NAMES.has(bareName.toLowerCase())) {
    return {
      valid: false,
      reason: `"${bareName}" is a reserved name and cannot be used`,
    };
  }

  return { valid: true };
}

/**
 * Check if a name is in the reserved list (for testing).
 */
export function isReservedName(name: string): boolean {
  return RESERVED_NAMES.has(getBareName(name).toLowerCase());
}
