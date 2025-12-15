import { useMutation } from '@tanstack/react-query';

export interface DeleteTeamInput {
  teamId: string;
}

export interface DeleteTeamResponse {
  deleteTeam: boolean;
}

const DELETE_TEAM_MUTATION = /* GraphQL */ `
  mutation DeleteTeam($teamId: String!) {
    deleteTeam(teamId: $teamId)
  }
`;

async function deleteTeamRequest(input: DeleteTeamInput) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: DELETE_TEAM_MUTATION,
      variables: { teamId: input.teamId },
    }),
  });
  const payload = (await response.json()) as {
    data?: DeleteTeamResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join(', '));
  }
  return payload.data!;
}

export function useDeleteTeam() {
  return useMutation({ mutationFn: deleteTeamRequest });
}



