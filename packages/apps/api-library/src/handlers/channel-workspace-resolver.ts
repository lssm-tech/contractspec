type WorkspaceMap = Record<string, string>;

const workspaceMapCache = new Map<string, WorkspaceMap | null>();

export function resolveSlackWorkspaceId(teamId?: string): string | null {
  return resolveWorkspaceId('CHANNEL_WORKSPACE_MAP_SLACK', teamId);
}

export function resolveGithubWorkspaceId(
  repositoryFullName?: string
): string | null {
  return resolveWorkspaceId('CHANNEL_WORKSPACE_MAP_GITHUB', repositoryFullName);
}

export function resolveMetaWhatsappWorkspaceId(
  candidates: string[]
): string | null {
  return resolveWorkspaceIdFromCandidates(
    'CHANNEL_WORKSPACE_MAP_WHATSAPP_META',
    candidates
  );
}

export function resolveTwilioWhatsappWorkspaceId(
  accountSid?: string
): string | null {
  return resolveWorkspaceId(
    'CHANNEL_WORKSPACE_MAP_WHATSAPP_TWILIO',
    accountSid
  );
}

export function clearWorkspaceMapCacheForTests(): void {
  workspaceMapCache.clear();
}

function resolveWorkspaceId(mapEnvName: string, key?: string): string | null {
  if (!key) return null;
  const map = getWorkspaceMap(mapEnvName);
  if (map && map[key]) {
    return map[key];
  }
  return allowUnmappedWorkspace() ? key : null;
}

function resolveWorkspaceIdFromCandidates(
  mapEnvName: string,
  candidates: string[]
): string | null {
  const map = getWorkspaceMap(mapEnvName);
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (map && map[candidate]) {
      return map[candidate];
    }
  }
  if (!allowUnmappedWorkspace()) {
    return null;
  }
  return candidates.find((candidate) => candidate.length > 0) ?? null;
}

function getWorkspaceMap(envName: string): WorkspaceMap | null {
  if (workspaceMapCache.has(envName)) {
    return workspaceMapCache.get(envName) ?? null;
  }

  const raw = process.env[envName];
  if (!raw) {
    workspaceMapCache.set(envName, null);
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      workspaceMapCache.set(envName, null);
      return null;
    }
    const map = Object.fromEntries(
      Object.entries(parsed).filter(
        ([key, value]) => key.length > 0 && typeof value === 'string'
      )
    );
    workspaceMapCache.set(envName, map);
    return map;
  } catch {
    workspaceMapCache.set(envName, null);
    return null;
  }
}

function allowUnmappedWorkspace(): boolean {
  return process.env.CHANNEL_ALLOW_UNMAPPED_WORKSPACE === '1';
}
