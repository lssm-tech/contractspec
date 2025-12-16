import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export interface TeamRecord {
  id: string;
  name: string;
  organizationId: string;
}

export interface MyTeamsResponse {
  myTeams: TeamRecord[];
}

const MY_TEAMS_QUERY = /* GraphQL */ `
  query MyTeams {
    myTeams {
      id
      name
      organizationId
    }
  }
`;

async function fetchMyTeams(): Promise<MyTeamsResponse> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: MY_TEAMS_QUERY }),
  });
  const payload = (await response.json()) as {
    data?: MyTeamsResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }
  return payload.data ?? { myTeams: [] };
}

export function useMyTeams(options: { enabled?: boolean } = {}): UseQueryResult<MyTeamsResponse> {
  return useQuery({
    queryKey: ['myTeams'],
    queryFn: fetchMyTeams,
    enabled: options.enabled ?? true,
    staleTime: 30_000,
  });
}










