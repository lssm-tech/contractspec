import { useMutation } from '@tanstack/react-query';

export interface RenameTeamInput {
  teamId: string;
  name: string;
}

export interface RenameTeamResponse {
  renameTeam: {
    id: string;
    name: string;
    organizationId: string;
  };
}

const RENAME_TEAM_MUTATION = /* GraphQL */ `
  mutation RenameTeam($teamId: String!, $name: String!) {
    renameTeam(teamId: $teamId, name: $name) {
      id
      name
      organizationId
    }
  }
`;

async function renameTeamRequest(input: RenameTeamInput) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: RENAME_TEAM_MUTATION,
      variables: { teamId: input.teamId, name: input.name },
    }),
  });
  const payload = (await response.json()) as {
    data?: RenameTeamResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join(', '));
  }
  return payload.data!;
}

export function useRenameTeam() {
  return useMutation({ mutationFn: renameTeamRequest });
}




