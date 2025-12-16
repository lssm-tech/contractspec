import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export interface StudioIntegrationRecord {
  id: string;
  organizationId: string;
  projectId?: string | null;
  provider: string;
  name: string;
  enabled: boolean;
  usageCount: number;
  lastUsed?: string | null;
  config?: unknown;
  createdAt: string;
}

export interface StudioIntegrationsResponse {
  studioIntegrations: StudioIntegrationRecord[];
}

const STUDIO_INTEGRATIONS_QUERY = /* GraphQL */ `
  query StudioIntegrations($projectId: String) {
    studioIntegrations(projectId: $projectId) {
      id
      organizationId
      projectId
      provider
      name
      enabled
      usageCount
      lastUsed
      config
      createdAt
    }
  }
`;

async function fetchStudioIntegrations(
  projectId?: string
): Promise<StudioIntegrationsResponse> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: STUDIO_INTEGRATIONS_QUERY,
      variables: { projectId },
    }),
  });
  const payload = (await response.json()) as {
    data?: StudioIntegrationsResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }
  return payload.data ?? { studioIntegrations: [] };
}

export function useStudioIntegrations(
  options: { projectId?: string; enabled?: boolean } = {}
): UseQueryResult<StudioIntegrationsResponse> {
  return useQuery({
    queryKey: ['studioIntegrations', options.projectId ?? 'all'],
    queryFn: () => fetchStudioIntegrations(options.projectId),
    enabled: options.enabled ?? true,
    staleTime: 30_000,
  });
}




