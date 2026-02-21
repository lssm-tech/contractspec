/**
 * API client for the agentpacks registry server.
 *
 * Used by both SSR (server components) and CSR (React Query hooks).
 * Base URL defaults to NEXT_PUBLIC_REGISTRY_URL env var or localhost:8091.
 */

const REGISTRY_URL =
  process.env.NEXT_PUBLIC_REGISTRY_URL ?? 'http://localhost:8091';

/* ---------- Types ---------- */

export interface Pack {
  name: string;
  displayName: string;
  description: string;
  longDescription?: string | null;
  authorName: string;
  authorEmail?: string | null;
  authorUrl?: string | null;
  authorAvatarUrl?: string | null;
  license: string;
  homepage?: string | null;
  repository?: string | null;
  tags: string[];
  targets: string[];
  features: string[];
  dependencies: string[];
  conflicts: string[];
  downloads: number;
  weeklyDownloads: number;
  averageRating?: number | null; // 10x scaled (e.g. 42 = 4.2)
  reviewCount?: number;
  qualityScore?: number | null; // 0-100
  featured: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  packName: string;
  username: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListResult {
  reviews: Review[];
  total: number;
  averageRating: number | null;
}

export interface QualityBreakdown {
  hasReadme: boolean;
  hasMultipleVersions: boolean;
  hasLicense: boolean;
  targetCoverage: number;
  featureCount: number;
  hasTags: boolean;
  hasRepository: boolean;
  hasHomepage: boolean;
  noConflicts: boolean;
  total: number;
}

export interface QualityResult {
  packName: string;
  score: number;
  badge: string;
  breakdown: QualityBreakdown;
}

export interface PackVersion {
  packName: string;
  version: string;
  manifest: Record<string, unknown>;
  changelog?: string | null;
  fileSize?: number | null;
  createdAt: string;
}

export interface SearchParams {
  q?: string;
  tags?: string[];
  targets?: string[];
  author?: string;
  sort?: 'downloads' | 'weekly' | 'name' | 'updated';
  limit?: number;
  offset?: number;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface RegistryStats {
  totalPacks: number;
  totalVersions: number;
  totalDownloads: number;
}

/* ---------- Fetch helpers ---------- */

async function registryFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${REGISTRY_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Registry API error: ${res.status} ${res.statusText} — ${url}`
    );
  }

  return res.json() as Promise<T>;
}

/* ---------- API methods ---------- */

/** Search packs with optional filters. */
export async function searchPacks(
  params: SearchParams = {},
  init?: RequestInit
): Promise<{ packs: Pack[]; total: number }> {
  const qs = new URLSearchParams();
  if (params.q) qs.set('q', params.q);
  if (params.tags?.length) {
    for (const t of params.tags) qs.append('tags', t);
  }
  if (params.targets?.length) {
    for (const t of params.targets) qs.append('targets', t);
  }
  if (params.author) qs.set('author', params.author);
  if (params.sort) qs.set('sort', params.sort);
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.offset) qs.set('offset', String(params.offset));

  const query = qs.toString();
  return registryFetch(`/packs/${query ? `?${query}` : ''}`, init);
}

/** Get a single pack by name. */
export async function getPack(
  name: string,
  init?: RequestInit
): Promise<Pack | null> {
  try {
    return await registryFetch<Pack>(
      `/packs/${encodeURIComponent(name)}`,
      init
    );
  } catch {
    return null;
  }
}

/** Get pack README content. */
export async function getPackReadme(
  name: string,
  init?: RequestInit
): Promise<string | null> {
  try {
    const data = await registryFetch<{ content: string }>(
      `/packs/${encodeURIComponent(name)}/readme`,
      init
    );
    return data.content;
  } catch {
    return null;
  }
}

/** List versions for a pack. */
export async function getPackVersions(
  name: string,
  init?: RequestInit
): Promise<{ versions: PackVersion[] }> {
  return registryFetch(`/packs/${encodeURIComponent(name)}/versions`, init);
}

/** Get a specific version. */
export async function getPackVersion(
  name: string,
  version: string,
  init?: RequestInit
): Promise<PackVersion | null> {
  try {
    return await registryFetch<PackVersion>(
      `/packs/${encodeURIComponent(name)}/versions/${encodeURIComponent(version)}`,
      init
    );
  } catch {
    return null;
  }
}

/** Get featured packs. */
export async function getFeaturedPacks(
  limit?: number,
  init?: RequestInit
): Promise<{ packs: Pack[] }> {
  const qs = limit ? `?limit=${limit}` : '';
  return registryFetch(`/featured${qs}`, init);
}

/** Get all tags with counts. */
export async function getTags(
  init?: RequestInit
): Promise<{ tags: TagCount[] }> {
  return registryFetch('/tags', init);
}

/** Get packs by target. */
export async function getPacksByTarget(
  targetId: string,
  init?: RequestInit
): Promise<{ packs: Pack[] }> {
  return registryFetch(`/targets/${encodeURIComponent(targetId)}`, init);
}

/** Get registry stats. */
export async function getRegistryStats(
  init?: RequestInit
): Promise<RegistryStats> {
  return registryFetch('/stats', init);
}

/** Get reviews for a pack. */
export async function getPackReviews(
  name: string,
  opts?: { limit?: number; offset?: number },
  init?: RequestInit
): Promise<ReviewListResult> {
  const qs = new URLSearchParams();
  if (opts?.limit) qs.set('limit', String(opts.limit));
  if (opts?.offset) qs.set('offset', String(opts.offset));
  const query = qs.toString();
  return registryFetch(
    `/packs/${encodeURIComponent(name)}/reviews${query ? `?${query}` : ''}`,
    init
  );
}

/** Get quality score breakdown for a pack. */
export async function getPackQuality(
  name: string,
  init?: RequestInit
): Promise<QualityResult | null> {
  try {
    return await registryFetch<QualityResult>(
      `/packs/${encodeURIComponent(name)}/quality`,
      init
    );
  } catch {
    return null;
  }
}
