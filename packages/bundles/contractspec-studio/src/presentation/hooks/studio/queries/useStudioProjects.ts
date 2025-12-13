import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export interface StudioProjectRecord {
  id: string;
  workspaceId: string;
  name: string;
  description?: string | null;
  tier: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  deploymentMode: 'SHARED' | 'DEDICATED';
  byokEnabled: boolean;
  evolutionEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  specs?: {
    id: string;
    type: string;
    version: string;
  }[];
  deployments?: {
    id: string;
    environment: string;
    status: string;
    deployedAt?: string | null;
  }[];
}

export interface StudioProjectsResponse {
  myStudioProjects: StudioProjectRecord[];
}

export type StudioProjectsFetcher = (variables: {
  workspaceId?: string;
}) => Promise<StudioProjectsResponse>;

const DEFAULT_ENDPOINT = '/api/graphql';

const PROJECTS_QUERY = /* GraphQL */ `
  query StudioProjects($workspaceId: String) {
    myStudioProjects(workspaceId: $workspaceId) {
      id
      workspaceId
      name
      description
      tier
      deploymentMode
      byokEnabled
      evolutionEnabled
      createdAt
      updatedAt
      specs {
        id
        type
        version
      }
      deployments {
        id
        environment
        status
        deployedAt
      }
    }
  }
`;

const defaultFetcher: StudioProjectsFetcher = async (variables) => {
  const response = await fetch(DEFAULT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: PROJECTS_QUERY,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch studio projects');
  }

  const payload = (await response.json()) as {
    data?: StudioProjectsResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join(', '));
  }
  return payload.data ?? { myStudioProjects: [] };
};

export interface UseStudioProjectsOptions {
  workspaceId?: string;
  enabled?: boolean;
  fetcher?: StudioProjectsFetcher;
}

export function useStudioProjects(
  options: UseStudioProjectsOptions = {}
): UseQueryResult<StudioProjectsResponse> {
  const fetcher = options.fetcher ?? defaultFetcher;
  return useQuery({
    queryKey: ['studioProjects', options.workspaceId],
    enabled: options.enabled ?? true,
    queryFn: () => fetcher({ workspaceId: options.workspaceId }),
    staleTime: 30_000,
  });
}
