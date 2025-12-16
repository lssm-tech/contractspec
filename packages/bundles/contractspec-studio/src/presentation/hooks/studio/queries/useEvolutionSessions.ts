import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export interface EvolutionSessionRecord {
  id: string;
  projectId: string;
  trigger: string;
  status: string;
  signals: unknown;
  context: unknown;
  suggestions: unknown;
  appliedChanges?: unknown;
  startedAt: string;
  completedAt?: string | null;
}

export interface EvolutionSessionsResponse {
  evolutionSessions: EvolutionSessionRecord[];
}

const EVOLUTION_SESSIONS_QUERY = /* GraphQL */ `
  query EvolutionSessions($projectId: String!) {
    evolutionSessions(projectId: $projectId) {
      id
      projectId
      trigger
      status
      signals
      context
      suggestions
      appliedChanges
      startedAt
      completedAt
    }
  }
`;

async function fetchEvolutionSessions(
  projectId: string
): Promise<EvolutionSessionsResponse> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: EVOLUTION_SESSIONS_QUERY,
      variables: { projectId },
    }),
  });
  const payload = (await response.json()) as {
    data?: EvolutionSessionsResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }
  return payload.data ?? { evolutionSessions: [] };
}

export function useEvolutionSessions(
  projectId: string,
  options: { enabled?: boolean } = {}
): UseQueryResult<EvolutionSessionsResponse> {
  return useQuery({
    queryKey: ['evolutionSessions', projectId],
    queryFn: () => fetchEvolutionSessions(projectId),
    enabled: options.enabled ?? Boolean(projectId),
    staleTime: 10_000,
  });
}









