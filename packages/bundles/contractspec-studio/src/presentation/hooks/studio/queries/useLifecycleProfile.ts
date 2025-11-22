import { useQuery } from '@tanstack/react-query';

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

const LIFECYCLE_PROFILE_QUERY = /* GraphQL */ `
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
`;

async function fetchLifecycleProfile() {
  const response = await fetch('/api/studio/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: LIFECYCLE_PROFILE_QUERY,
    }),
  });
  const payload = (await response.json()) as {
    data?: LifecycleProfileResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join(', '));
  }
  return payload.data!;
}

export function useLifecycleProfile() {
  return useQuery({
    queryKey: ['lifecycleProfile'],
    queryFn: fetchLifecycleProfile,
    staleTime: 60_000,
  });
}

