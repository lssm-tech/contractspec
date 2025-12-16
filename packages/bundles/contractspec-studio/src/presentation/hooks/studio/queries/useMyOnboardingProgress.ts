import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { OnboardingProgressRecord } from './useMyOnboardingTracks';

export interface MyOnboardingProgressResponse {
  myOnboardingProgress: OnboardingProgressRecord | null;
}

const MY_ONBOARDING_PROGRESS_QUERY = /* GraphQL */ `
  query MyOnboardingProgress($trackKey: String!) {
    myOnboardingProgress(trackKey: $trackKey) {
      id
      learnerId
      trackId
      trackKey
      progress
      isCompleted
      xpEarned
      startedAt
      completedAt
      lastActivityAt
      isDismissed
      dismissedAt
      metadata
      stepCompletions {
        id
        progressId
        stepId
        stepKey
        status
        xpEarned
        completedAt
      }
    }
  }
`;

async function fetchMyOnboardingProgress(
  trackKey: string
): Promise<MyOnboardingProgressResponse> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: MY_ONBOARDING_PROGRESS_QUERY,
      variables: { trackKey },
    }),
  });
  const payload = (await response.json()) as {
    data?: MyOnboardingProgressResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }
  return payload.data ?? { myOnboardingProgress: null };
}

export function useMyOnboardingProgress(
  trackKey: string,
  options: { enabled?: boolean } = {}
): UseQueryResult<MyOnboardingProgressResponse> {
  return useQuery({
    queryKey: ['myOnboardingProgress', trackKey],
    queryFn: () => fetchMyOnboardingProgress(trackKey),
    enabled: options.enabled ?? Boolean(trackKey),
    staleTime: 5_000,
  });
}







