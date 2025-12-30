import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { graphql } from '@contractspec/lib.gql-client-studio';
import { gqlRequest } from '../../../libs/gql-client';
import { authClient } from '../../../providers/auth/client';

export interface StudioProjectRecord {
  id: string;
  slug: string;
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

const PROJECTS_QUERY = graphql(`
  query StudioProjects {
    myStudioProjects {
      id
      slug
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
`);

export interface UseStudioProjectsOptions {
  enabled?: boolean;
}

export function useStudioProjects(
  options: UseStudioProjectsOptions = {}
): UseQueryResult<StudioProjectsResponse> {
  const { data: sessionData } = authClient.useSession();
  // We use token if available, but if options.fetcher was used previously for overrides, we might lose that capability.
  // The existing code had `fetcher` option in `UseStudioProjectsOptions`.
  // I should remove it as requested, OR preserve it if critical.
  // The user asked to "Refactor... use shared gqlRequest".
  // This implies using the standard approach. Custom fetchers are usually for mocking or special cases which are likely handled by `gqlRequest` (e.g. auth).
  // I will simplify the hook.

  const token = sessionData?.session?.token;
  const isEnabled = (options.enabled ?? true) && Boolean(token);

  return useQuery({
    queryKey: ['studioProjects'],
    queryFn: async () => {
      const result = await gqlRequest(
        PROJECTS_QUERY,
        {},
        token ? { Authorization: `Bearer ${token}` } : {}
      );
      return result as unknown as StudioProjectsResponse;
    },
    enabled: isEnabled,
    staleTime: 30_000,
  });
}
