import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { graphql } from '@contractspec/lib.gql-client-studio';
import { gqlRequest } from '../../../libs/gql-client';
import { authClient } from '../../../providers/auth/client';

export interface LifecycleProfile {
  id: string;
  organizationId: string;
  currentStage: string;
  detectedStage: string;
  confidence: number;
  productPhase?: string | null;
  companyPhase?: string | null;
  capitalPhase?: string | null;
  metrics?: Record<string, unknown>;
  signals?: Record<string, unknown>;
  lastAssessment: string;
  nextAssessment?: string | null;
}

export interface LifecycleProfileResponse {
  lifecycleProfile: LifecycleProfile;
}

const LIFECYCLE_PROFILE_QUERY = graphql(`
  query LifecycleProfile {
    lifecycleProfile {
      id
      organizationId
      currentStage
      detectedStage
      confidence
      productPhase
      companyPhase
      capitalPhase
      metrics
      signals
      lastAssessment
      nextAssessment
    }
  }
`);

export function useLifecycleProfile(
  options: { enabled?: boolean } = {}
): UseQueryResult<LifecycleProfileResponse> {
  const { data: sessionData } = authClient.useSession();
  const token = sessionData?.session?.token;
  const isEnabled = (options.enabled ?? true) && Boolean(token);

  return useQuery({
    queryKey: ['lifecycleProfile'],
    queryFn: async () => {
      const result = await gqlRequest(
        LIFECYCLE_PROFILE_QUERY,
        {},
        token ? { Authorization: `Bearer ${token}` } : {}
      );
      return result as unknown as LifecycleProfileResponse;
    },
    enabled: isEnabled,
    staleTime: 60_000,
  });
}
