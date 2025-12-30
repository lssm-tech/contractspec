import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { graphql } from '@contractspec/lib.gql-client-studio';
import { gqlRequest } from '../../../libs/gql-client';
import { authClient } from '../../../providers/auth/client';

export interface StudioProjectBySlugResolution {
  studioProjectBySlug: {
    canonicalSlug: string;
    wasRedirect: boolean;
    project: {
      id: string;
      slug: string;
      name: string;
      description?: string | null;
      tier: string;
      deploymentMode: string;
      byokEnabled: boolean;
      evolutionEnabled: boolean;
      createdAt: string;
      updatedAt: string;
      deployments?: {
        id: string;
        environment: string;
        status: string;
        version: string;
        url?: string | null;
        createdAt: string;
        deployedAt?: string | null;
      }[];
    };
  };
}

const PROJECT_BY_SLUG_QUERY = graphql(`
  query StudioProjectBySlug($slug: String!) {
    studioProjectBySlug(slug: $slug) {
      canonicalSlug
      wasRedirect
      project {
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
        deployments {
          id
          environment
          status
          version
          url
          createdAt
          deployedAt
        }
      }
    }
  }
`);

export function useStudioProjectBySlug(
  slug: string,
  options: { enabled?: boolean } = {}
): UseQueryResult<StudioProjectBySlugResolution> {
  const { data: sessionData } = authClient.useSession();
  const token = sessionData?.session?.token;
  const isEnabled = (options.enabled ?? Boolean(slug)) && Boolean(token);

  return useQuery({
    queryKey: ['studioProjectBySlug', slug],
    queryFn: async () => {
      const result = await gqlRequest(
        PROJECT_BY_SLUG_QUERY,
        { slug },
        token ? { Authorization: `Bearer ${token}` } : {}
      );
      return result as unknown as StudioProjectBySlugResolution;
    },
    enabled: isEnabled,
    staleTime: 15_000,
  });
}
