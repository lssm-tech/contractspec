import {
  graphql,
  type StartEvolutionSessionInput,
  type UpdateEvolutionSessionInput,
} from '@contractspec/lib.gql-client-studio';
import { useGraphQLMutation } from '../../../libs/gql-client';

const START_EVOLUTION_SESSION_MUTATION = graphql(`
  mutation StartEvolutionSession($input: StartEvolutionSessionInput!) {
    startEvolutionSession(input: $input) {
      id
    }
  }
`);

const UPDATE_EVOLUTION_SESSION_MUTATION = graphql(`
  mutation UpdateEvolutionSession(
    $id: String!
    $input: UpdateEvolutionSessionInput!
  ) {
    updateEvolutionSession(id: $id, input: $input) {
      id
    }
  }
`);

export function useStartEvolutionSession() {
  const mutation = useGraphQLMutation(START_EVOLUTION_SESSION_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: StartEvolutionSessionInput) => {
      const result = await mutation.mutateAsync({ input });
      return result.startEvolutionSession;
    },
  };
}

export function useUpdateEvolutionSession() {
  const mutation = useGraphQLMutation(UPDATE_EVOLUTION_SESSION_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (
      input: { id: string } & UpdateEvolutionSessionInput
    ) => {
      const { id, ...rest } = input;
      const result = await mutation.mutateAsync({ id, input: rest });
      return result.updateEvolutionSession;
    },
  };
}
