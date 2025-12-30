import { graphql } from '@contractspec/lib.gql-client-studio';
import { useGraphQLMutation } from '../../../libs/gql-client';

const DELETE_TEAM_MUTATION = graphql(`
  mutation DeleteTeam($teamId: String!) {
    deleteTeam(teamId: $teamId)
  }
`);

export function useDeleteTeam() {
  const mutation = useGraphQLMutation(DELETE_TEAM_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: { teamId: string }) => {
      const result = await mutation.mutateAsync({ teamId: input.teamId });
      return result.deleteTeam;
    },
  };
}
