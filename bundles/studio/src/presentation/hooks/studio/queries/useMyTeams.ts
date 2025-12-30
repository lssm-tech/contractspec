import { graphql } from '@contractspec/lib.gql-client-studio';
import { useGraphQL } from '../../../libs/gql-client';

const MY_TEAMS_QUERY = graphql(`
  query MyTeams {
    myTeams {
      id
      name
      organizationId
    }
  }
`);

export function useMyTeams(options: { enabled?: boolean } = {}) {
  return useGraphQL(
    MY_TEAMS_QUERY,
    {},
    {
      enabled: options.enabled ?? true,
      staleTime: 30_000,
    }
  );
}
