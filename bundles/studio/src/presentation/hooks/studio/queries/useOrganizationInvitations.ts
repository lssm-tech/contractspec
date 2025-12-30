import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { graphql } from '@contractspec/lib.gql-client-studio';
import { gqlRequest } from '../../../libs/gql-client';
import { authClient } from '../../../providers/auth/client';

export interface OrganizationInvitationRecord {
  id: string;
  organizationId: string;
  email: string;
  role?: string | null;
  status: string;
  teamId?: string | null;
  inviterId: string;
  createdAt: string;
  acceptedAt?: string | null;
  expiresAt?: string | null;
}

export interface OrganizationInvitationsResponse {
  organizationInvitations: OrganizationInvitationRecord[];
}

const ORGANIZATION_INVITATIONS_QUERY = graphql(`
  query OrganizationInvitations {
    organizationInvitations {
      id
      organizationId
      email
      role
      status
      teamId
      inviterId
      createdAt
      acceptedAt
      expiresAt
    }
  }
`);

export function useOrganizationInvitations(
  options: { enabled?: boolean } = {}
): UseQueryResult<OrganizationInvitationsResponse> {
  const { data: sessionData } = authClient.useSession();
  const token = sessionData?.session?.token;
  const isEnabled = (options.enabled ?? true) && Boolean(token);

  return useQuery({
    queryKey: ['organizationInvitations'],
    queryFn: async () => {
      const result = await gqlRequest(
        ORGANIZATION_INVITATIONS_QUERY,
        {},
        token ? { Authorization: `Bearer ${token}` } : {}
      );
      return result as unknown as OrganizationInvitationsResponse;
    },
    enabled: isEnabled,
    staleTime: 30_000,
  });
}
