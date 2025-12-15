import { useMutation } from '@tanstack/react-query';

export interface ConnectIntegrationInput {
  provider: string;
  projectId?: string;
  name?: string;
  config?: unknown;
  credentials?: Record<string, string>;
  ownershipMode?: 'managed' | 'byok';
  secretProvider?: string;
  secretRef?: string;
}

const CONNECT_INTEGRATION_MUTATION = /* GraphQL */ `
  mutation ConnectIntegration($input: ConnectIntegrationInput!) {
    connectIntegration(input: $input) {
      id
    }
  }
`;

const DISCONNECT_INTEGRATION_MUTATION = /* GraphQL */ `
  mutation DisconnectIntegration($id: String!) {
    disconnectIntegration(id: $id)
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

export function useConnectIntegration() {
  return useMutation({
    mutationFn: async (input: ConnectIntegrationInput) => {
      return gqlRequest<{ connectIntegration: { id: string } }>(CONNECT_INTEGRATION_MUTATION, {
        input,
      });
    },
  });
}

export function useDisconnectIntegration() {
  return useMutation({
    mutationFn: async (input: { id: string }) => {
      return gqlRequest<{ disconnectIntegration: boolean }>(DISCONNECT_INTEGRATION_MUTATION, {
        id: input.id,
      });
    },
  });
}



