import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export interface StudioLearningEventRecord {
  id: string;
  organizationId: string;
  projectId?: string | null;
  name: string;
  payload?: unknown;
  createdAt: string;
}

export interface MyLearningEventsResponse {
  myLearningEvents: StudioLearningEventRecord[];
}

const MY_LEARNING_EVENTS_QUERY = /* GraphQL */ `
  query MyLearningEvents($projectId: String, $limit: Int) {
    myLearningEvents(projectId: $projectId, limit: $limit) {
      id
      organizationId
      projectId
      name
      payload
      createdAt
    }
  }
`;

async function fetchMyLearningEvents(input: {
  projectId?: string;
  limit?: number;
}): Promise<MyLearningEventsResponse> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: MY_LEARNING_EVENTS_QUERY,
      variables: input,
    }),
  });
  const payload = (await response.json()) as {
    data?: MyLearningEventsResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }
  return payload.data ?? { myLearningEvents: [] };
}

export function useMyLearningEvents(
  options: { projectId?: string; limit?: number; enabled?: boolean } = {}
): UseQueryResult<MyLearningEventsResponse> {
  return useQuery({
    queryKey: ['myLearningEvents', options.projectId ?? 'all', options.limit ?? 200],
    queryFn: () =>
      fetchMyLearningEvents({
        projectId: options.projectId,
        limit: options.limit ?? 200,
      }),
    enabled: options.enabled ?? true,
    staleTime: 5_000,
  });
}









