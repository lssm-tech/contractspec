/**
 * Resolves package slug (e.g. lib.ai-agent) to README path for /llms/[slug] routes.
 */
import fs from "fs";
import path from "path";

const LAYERS = [
  "libs",
  "modules",
  "bundles",
  "apps",
  "examples",
  "tools",
  "integrations",
  "apps-registry",
];

function getMonorepoRoot(): string {
  return path.resolve(process.cwd(), "../../..");
}

function findPackageJsonFiles(dir: string, base: string): Array<{ path: string; relativePath: string }> {
  const results: Array<{ path: string; relativePath: string }> = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      const pkgPath = path.join(fullPath, "package.json");
      if (fs.existsSync(pkgPath)) {
        results.push({ path: fullPath, relativePath: relPath });
      } else {
        results.push(...findPackageJsonFiles(fullPath, relPath));
      }
    }
  }
  return results;
}

function getPackageSlug(pkgName: string): string | null {
  if (!pkgName?.startsWith("@contractspec/")) return null;
  return pkgName.slice("@contractspec/".length);
}

let slugToReadmeCache: Map<string, string> | null = null;

function buildSlugToReadmeMap(): Map<string, string> {
  if (slugToReadmeCache) return slugToReadmeCache;
  const map = new Map<string, string>();
  const root = getMonorepoRoot();
  const packagesDir = path.join(root, "packages");

  for (const layer of LAYERS) {
    const layerPath = path.join(packagesDir, layer);
    const found = findPackageJsonFiles(layerPath, layer);
    for (const { path: pkgPath } of found) {
      const pkgJsonPath = path.join(pkgPath, "package.json");
      const readmePath = path.join(pkgPath, "README.md");
      try {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
        const slug = getPackageSlug(pkgJson.name);
        if (slug && fs.existsSync(readmePath)) {
          map.set(slug, readmePath);
        }
      } catch {
        // skip
      }
    }
  }
  slugToReadmeCache = map;
  return map;
}

export function resolveReadmePath(slug: string): string | null {
  const map = buildSlugToReadmeMap();
  return map.get(slug) ?? null;
}
