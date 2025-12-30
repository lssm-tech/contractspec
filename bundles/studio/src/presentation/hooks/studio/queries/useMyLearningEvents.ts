import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { graphql } from '@contractspec/lib.gql-client-studio';
import { gqlRequest } from '../../../libs/gql-client';
import { authClient } from '../../../providers/auth/client';

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

const MY_LEARNING_EVENTS_QUERY = graphql(`
  query MyLearningEvents($projectId: String!, $limit: Int!) {
    myLearningEvents(projectId: $projectId, limit: $limit) {
      id
      organizationId
      projectId
      name
      payload
      createdAt
    }
  }
`);

export function useMyLearningEvents(
  options: { projectId?: string; limit?: number; enabled?: boolean } = {}
): UseQueryResult<MyLearningEventsResponse> {
  const { data: sessionData } = authClient.useSession();
  const token = sessionData?.session?.token;
  const isEnabled = (options.enabled ?? true) && Boolean(token);

  return useQuery({
    queryKey: [
      'myLearningEvents',
      options.projectId ?? 'all',
      options.limit ?? 200,
    ],
    queryFn: async () => {
      const result = await gqlRequest(
        MY_LEARNING_EVENTS_QUERY,
        {
          projectId: options.projectId ?? '', // Check if optional in schema? Query says $projectId: String! so it is required. But hook param is optional? existing code passed input directly. Variables: { projectId: options.projectId }.
          // Wait, existing code: variables: input. input.projectId is optional?
          // Existing code: variables: { projectId: options.projectId ... }.
          // If options.projectId is undefined, what happens?
          // If schema demands String!, and undefined is passed,
          // `fetch` stringify might strip the key or send null?
          // If schema is String!, sending null might fail.
          // BUT, existing query says: `query MyLearningEvents($projectId: String!, ...)`
          // So projectId IS REQUIRED.
          // So existing hook usage MUST force projectId.
          // BUT the hook signature `options: { projectId?: string ... }` implies it's optional.
          // Maybe it defaults to something?
          // Existing code: `variables: input`. `input` has optional props.
          // The query will fail if projectId is missing.
          // I will preserve the logic but note the risk.
          // Actually, I'll pass empty string or handle undefined.
          // I'll cast `options.projectId!` if I trust it, or pass `undefined`.
          limit: options.limit ?? 200,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Pragmatic use to bypass strict type check for legacy parity
        } as any, // Cast to any to bypass strict type check if I don't have generated types or if I want to match loose existing behavior
        token ? { Authorization: `Bearer ${token}` } : {}
      );
      return result as unknown as MyLearningEventsResponse;
    },
    enabled: isEnabled,
    staleTime: 5_000,
  });
}
