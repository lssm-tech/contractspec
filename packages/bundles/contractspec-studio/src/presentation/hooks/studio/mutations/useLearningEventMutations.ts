import { useMutation } from '@tanstack/react-query';

export interface RecordLearningEventInput {
  projectId?: string;
  name: string;
  payload?: unknown;
}

const RECORD_LEARNING_EVENT_MUTATION = /* GraphQL */ `
  mutation RecordLearningEvent($input: RecordLearningEventInput!) {
    recordLearningEvent(input: $input) {
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

export function useRecordLearningEvent() {
  return useMutation({
    mutationFn: async (input: RecordLearningEventInput) => {
      return gqlRequest<{ recordLearningEvent: { id: string } }>(RECORD_LEARNING_EVENT_MUTATION, {
        input,
      });
    },
  });
}






