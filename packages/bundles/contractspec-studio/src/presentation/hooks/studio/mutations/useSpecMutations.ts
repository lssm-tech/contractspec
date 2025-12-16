import { useMutation } from '@tanstack/react-query';

export interface CreateStudioSpecInput {
  projectId: string;
  type: 'CAPABILITY' | 'DATAVIEW' | 'WORKFLOW' | 'POLICY' | 'COMPONENT';
  name: string;
  version: string;
  content: unknown;
  metadata?: unknown;
}

export interface UpdateStudioSpecInput {
  id: string;
  name?: string;
  version?: string;
  content?: unknown;
  metadata?: unknown;
}

const CREATE_SPEC_MUTATION = /* GraphQL */ `
  mutation CreateStudioSpec($input: CreateSpecInput!) {
    createStudioSpec(input: $input) {
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

const UPDATE_SPEC_MUTATION = /* GraphQL */ `
  mutation UpdateStudioSpec($id: String!, $input: UpdateSpecInput!) {
    updateStudioSpec(id: $id, input: $input) {
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

export function useCreateStudioSpec() {
  return useMutation({
    mutationFn: async (input: CreateStudioSpecInput) => {
      return gqlRequest<{ createStudioSpec: unknown }>(CREATE_SPEC_MUTATION, {
        input,
      });
    },
  });
}

export function useUpdateStudioSpec() {
  return useMutation({
    mutationFn: async (input: UpdateStudioSpecInput) => {
      const { id, ...rest } = input;
      return gqlRequest<{ updateStudioSpec: unknown }>(UPDATE_SPEC_MUTATION, {
        id,
        input: rest,
      });
    },
  });
}










