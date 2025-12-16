import { useMutation } from '@tanstack/react-query';

export interface StartEvolutionSessionInput {
  projectId: string;
  trigger: 'USAGE_PATTERN' | 'ANOMALY_DETECTED' | 'LIFECYCLE_STAGE_CHANGE' | 'MANUAL' | 'SCHEDULED';
  signals: unknown;
  context: unknown;
  suggestions: unknown;
}

export interface UpdateEvolutionSessionInput {
  id: string;
  status?: 'ANALYZING' | 'SUGGESTIONS_READY' | 'APPLYING' | 'COMPLETED' | 'FAILED';
  appliedChanges?: unknown;
  completedAt?: string;
}

const START_EVOLUTION_SESSION_MUTATION = /* GraphQL */ `
  mutation StartEvolutionSession($input: StartEvolutionSessionInput!) {
    startEvolutionSession(input: $input) {
      id
    }
  }
`;

const UPDATE_EVOLUTION_SESSION_MUTATION = /* GraphQL */ `
  mutation UpdateEvolutionSession($id: String!, $input: UpdateEvolutionSessionInput!) {
    updateEvolutionSession(id: $id, input: $input) {
      id
    }
  }
`;

async function gqlRequest<T>(query: string, variables: Record<string, unknown>) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const payload = (await response.json()) as { data?: T; errors?: { message: string }[] };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }
  return payload.data!;
}

export function useStartEvolutionSession() {
  return useMutation({
    mutationFn: async (input: StartEvolutionSessionInput) => {
      return gqlRequest<{ startEvolutionSession: { id: string } }>(
        START_EVOLUTION_SESSION_MUTATION,
        { input }
      );
    },
  });
}

export function useUpdateEvolutionSession() {
  return useMutation({
    mutationFn: async (input: UpdateEvolutionSessionInput) => {
      const { id, ...rest } = input;
      return gqlRequest<{ updateEvolutionSession: { id: string } }>(
        UPDATE_EVOLUTION_SESSION_MUTATION,
        { id, input: rest }
      );
    },
  });
}





