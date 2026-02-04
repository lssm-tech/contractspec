const ASSETS_BASE = '/assets';

function normalizeAssetPath(assetPath: string): string {
  const trimmed = assetPath.trim();
  if (!trimmed) return ASSETS_BASE;
  if (trimmed.startsWith(ASSETS_BASE)) return trimmed;
  if (trimmed.startsWith('/')) return `${ASSETS_BASE}${trimmed}`;
  return `${ASSETS_BASE}/${trimmed}`;
}

export function alpicAssetPath(assetPath: string): string {
  return normalizeAssetPath(assetPath);
}

export function alpicAssetUrl(assetPath: string): string {
  const path = normalizeAssetPath(assetPath);
  const host = process.env.ALPIC_HOST?.trim();
  if (!host) return path;
  return `https://${host}${path}`;
}
