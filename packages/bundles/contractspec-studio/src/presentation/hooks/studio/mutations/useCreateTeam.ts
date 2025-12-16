import { useMutation } from '@tanstack/react-query';

export interface CreateTeamInput {
  name: string;
}

export interface CreateTeamResponse {
  createTeam: {
    id: string;
    name: string;
    organizationId: string;
  };
}

const CREATE_TEAM_MUTATION = /* GraphQL */ `
  mutation CreateTeam($name: String!) {
    createTeam(name: $name) {
      id
      name
      organizationId
    }
  }
`;

async function createTeamRequest(input: CreateTeamInput) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: CREATE_TEAM_MUTATION,
      variables: { name: input.name },
    }),
  });
  const payload = (await response.json()) as {
    data?: CreateTeamResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join(', '));
  }
  return payload.data!;
}

export function useCreateTeam() {
  return useMutation({ mutationFn: createTeamRequest });
}






