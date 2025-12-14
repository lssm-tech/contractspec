import { useQuery, type UseQueryResult } from '@tanstack/react-query';

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

const PROJECT_BY_SLUG_QUERY = /* GraphQL */ `
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
`;

async function fetchProjectBySlug(slug: string): Promise<StudioProjectBySlugResolution> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: PROJECT_BY_SLUG_QUERY,
      variables: { slug },
    }),
  });
  const payload = (await response.json()) as {
    data?: StudioProjectBySlugResolution;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join(', '));
  }
  return payload.data!;
}

export function useStudioProjectBySlug(
  slug: string,
  options: { enabled?: boolean } = {}
): UseQueryResult<StudioProjectBySlugResolution> {
  return useQuery({
    queryKey: ['studioProjectBySlug', slug],
    queryFn: () => fetchProjectBySlug(slug),
    enabled: options.enabled ?? Boolean(slug),
    staleTime: 15_000,
  });
}


