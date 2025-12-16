import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export interface StudioSpecRecord {
  id: string;
  projectId: string;
  type: 'CAPABILITY' | 'DATAVIEW' | 'WORKFLOW' | 'POLICY' | 'COMPONENT';
  name: string;
  version: string;
  content: unknown;
  metadata?: unknown;
  updatedAt: string;
}

export interface ProjectSpecsResponse {
  projectSpecs: StudioSpecRecord[];
}

const PROJECT_SPECS_QUERY = /* GraphQL */ `
  query ProjectSpecs($projectId: String!) {
    projectSpecs(projectId: $projectId) {
      id
      projectId
      type
      name
      version
      content
      metadata
      updatedAt
    }
  }
`;

async function fetchProjectSpecs(projectId: string): Promise<ProjectSpecsResponse> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: PROJECT_SPECS_QUERY,
      variables: { projectId },
    }),
  });
  const payload = (await response.json()) as {
    data?: ProjectSpecsResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }
  return payload.data ?? { projectSpecs: [] };
}

export function useProjectSpecs(
  projectId: string,
  options: { enabled?: boolean } = {}
): UseQueryResult<ProjectSpecsResponse> {
  return useQuery({
    queryKey: ['projectSpecs', projectId],
    queryFn: () => fetchProjectSpecs(projectId),
    enabled: options.enabled ?? Boolean(projectId),
    staleTime: 10_000,
  });
}






