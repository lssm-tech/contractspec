import { graphql } from '@contractspec/lib.gql-client-studio';
import { useGraphQLMutation } from '../../../libs/gql-client';

const RENAME_TEAM_MUTATION = graphql(`
  mutation RenameTeam($teamId: String!, $name: String!) {
    renameTeam(teamId: $teamId, name: $name) {
      id
      name
      organizationId
    }
  }
`);

export function useRenameTeam() {
  const mutation = useGraphQLMutation(RENAME_TEAM_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (input: { teamId: string; name: string }) => {
      const result = await mutation.mutateAsync({
        teamId: input.teamId,
        name: input.name,
      });
      return result.renameTeam;
    },
  };
}
