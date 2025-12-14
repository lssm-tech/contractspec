import { useMutation } from '@tanstack/react-query';

export interface InviteToOrganizationInput {
  email: string;
  role?: string;
  teamId?: string;
}

export interface InviteToOrganizationResponse {
  inviteToOrganization: {
    invitationId: string;
    inviteUrl: string;
    emailSent: boolean;
  };
}

const INVITE_TO_ORG_MUTATION = /* GraphQL */ `
  mutation InviteToOrganization($email: String!, $role: String, $teamId: String) {
    inviteToOrganization(email: $email, role: $role, teamId: $teamId) {
      invitationId
      inviteUrl
      emailSent
    }
  }
`;

async function inviteToOrganizationRequest(input: InviteToOrganizationInput) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: INVITE_TO_ORG_MUTATION,
      variables: {
        email: input.email,
        role: input.role,
        teamId: input.teamId,
      },
    }),
  });
  const payload = (await response.json()) as {
    data?: InviteToOrganizationResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join(', '));
  }
  return payload.data!;
}

export function useInviteToOrganization() {
  return useMutation({ mutationFn: inviteToOrganizationRequest });
}


