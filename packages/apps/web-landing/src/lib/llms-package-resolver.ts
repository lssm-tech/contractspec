/**
 * Resolves package slug (e.g. lib.ai-agent) to README path for /llms/[slug] routes.
 * Uses build-time manifest to avoid Turbopack "overly broad file pattern" warnings.
 */
import path from "path";

import manifest from "./llms-package-manifest.generated.json";

/** Monorepo root: 3 levels up from packages/apps/web-landing */
const MONOREPO_ROOT_REL = "../../..";

export function resolveReadmePath(slug: string): string | null {
  const relativePath = (manifest as Record<string, string>)[slug];
  if (!relativePath) return null;
  return path.resolve(process.cwd(), MONOREPO_ROOT_REL, relativePath);
}
