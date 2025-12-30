import {
  graphql,
  type ConnectIntegrationInput,
} from '@contractspec/lib.gql-client-studio';
import { useGraphQLMutation } from '../../../libs/gql-client';

const CONNECT_INTEGRATION_MUTATION = graphql(`
  mutation ConnectIntegration($input: ConnectIntegrationInput!) {
    connectIntegration(input: $input) {
      id
    }
  }
`);

const DISCONNECT_INTEGRATION_MUTATION = graphql(`
  mutation DisconnectIntegration($id: String!) {
    disconnectIntegration(id: $id)
  }
`);

export function useConnectIntegration() {
  const mutation = useGraphQLMutation(CONNECT_INTEGRATION_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: ConnectIntegrationInput) => {
      const result = await mutation.mutateAsync({ input });
      return result.connectIntegration;
    },
  };
}

export function useDisconnectIntegration() {
  const mutation = useGraphQLMutation(DISCONNECT_INTEGRATION_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: { id: string }) => {
      const result = await mutation.mutateAsync({ id: input.id });
      return result.disconnectIntegration;
    },
  };
}
