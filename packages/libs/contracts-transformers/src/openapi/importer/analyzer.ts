import type { ParsedOperation } from '../types';

/**
 * HTTP methods that typically indicate a command (state-changing).
 */
export const COMMAND_METHODS = ['post', 'put', 'delete', 'patch'];

/**
 * Determine if an operation is a command or query based on HTTP method.
 */
export function inferOpKind(method: string): 'command' | 'query' {
  return COMMAND_METHODS.includes(method.toLowerCase()) ? 'command' : 'query';
}

/**
 * Determine auth level based on security requirements.
 */
export function inferAuthLevel(
  operation: ParsedOperation,
  defaultAuth: 'anonymous' | 'user' | 'admin'
): 'anonymous' | 'user' | 'admin' {
  if (!operation.security || operation.security.length === 0) {
    // Check if any security scheme is present
    return defaultAuth;
  }

  // If there's an empty security requirement, it's anonymous
  for (const sec of operation.security) {
    if (Object.keys(sec).length === 0) {
      return 'anonymous';
    }
  }

  return 'user';
}
