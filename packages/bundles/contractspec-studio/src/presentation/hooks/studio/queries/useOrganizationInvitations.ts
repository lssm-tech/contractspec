import { useQuery, type UseQueryResult } from '@tanstack/react-query';

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

const ORGANIZATION_INVITATIONS_QUERY = /* GraphQL */ `
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
`;

async function fetchOrganizationInvitations(): Promise<OrganizationInvitationsResponse> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: ORGANIZATION_INVITATIONS_QUERY }),
  });
  const payload = (await response.json()) as {
    data?: OrganizationInvitationsResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }
  return payload.data ?? { organizationInvitations: [] };
}

export function useOrganizationInvitations(
  options: { enabled?: boolean } = {}
): UseQueryResult<OrganizationInvitationsResponse> {
  return useQuery({
    queryKey: ['organizationInvitations'],
    queryFn: fetchOrganizationInvitations,
    enabled: options.enabled ?? true,
    staleTime: 30_000,
  });
}



