import { graphql } from '@contractspec/lib.gql-client-studio';
import { useGraphQLMutation } from '../../../libs/gql-client';

const CREATE_TEAM_MUTATION = graphql(`
  mutation CreateTeam($name: String!) {
    createTeam(name: $name) {
      id
      name
      organizationId
    }
  }
`);

export function useCreateTeam() {
  const mutation = useGraphQLMutation(CREATE_TEAM_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: { name: string }) => {
      const result = await mutation.mutateAsync({ name: input.name });
      return result.createTeam;
    },
  };
}
