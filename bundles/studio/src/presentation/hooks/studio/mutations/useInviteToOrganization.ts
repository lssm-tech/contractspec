import { useMutation } from '@tanstack/react-query';
import { graphql } from '@contractspec/lib.gql-client-studio';
import { gqlRequest } from '../../../libs/gql-client';
import { authClient } from '../../../providers/auth/client';

const INVITE_TO_ORG_MUTATION = graphql(`
  mutation InviteToOrganization(
    $email: String!
    $role: String
    $teamId: String
  ) {
    inviteToOrganization(email: $email, role: $role, teamId: $teamId) {
      invitationId
      inviteUrl
      emailSent
    }
  }
`);

export function useInviteToOrganization() {
  const { data: sessionData } = authClient.useSession();
  return useMutation({
    mutationFn: async (input: {
      email: string;
      role?: string;
      teamId?: string;
    }) => {
      const result = await gqlRequest(
        INVITE_TO_ORG_MUTATION,
        {
          email: input.email,
          role: input.role,
          teamId: input.teamId,
        },
        sessionData?.session?.token
          ? { Authorization: `Bearer ${sessionData.session.token}` }
          : {}
      );
      return result.inviteToOrganization;
    },
  });
}
