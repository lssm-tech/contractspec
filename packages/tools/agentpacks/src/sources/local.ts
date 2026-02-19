import { existsSync } from 'fs';
import { resolve, isAbsolute } from 'path';

/**
 * Resolve a local pack reference to an absolute directory path.
 */
export function resolveLocalPack(
  packRef: string,
  projectRoot: string
): string | null {
  let resolved: string;

  if (isAbsolute(packRef)) {
    resolved = packRef;
  } else {
    resolved = resolve(projectRoot, packRef);
  }

  if (!existsSync(resolved)) return null;
  return resolved;
}

/**
 * Check if a pack reference is a local path.
 */
export function isLocalPackRef(packRef: string): boolean {
  return (
    packRef.startsWith('./') || packRef.startsWith('../') || isAbsolute(packRef)
  );
}
