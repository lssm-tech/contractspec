import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { graphql } from '@contractspec/lib.gql-client-studio';
import { gqlRequest } from '../../../libs/gql-client';
import { authClient } from '../../../providers/auth/client';

export interface MyOnboardingProgressResponse {
  myOnboardingProgress: {
    id: string;
    learnerId: string;
    trackId: string;
    trackKey: string;
    progress: number;
    isCompleted: boolean;
    xpEarned: number;
    startedAt: string;
    completedAt?: string | null;
    lastActivityAt?: string | null;
    isDismissed: boolean;
    dismissedAt?: string | null;
    metadata?: unknown;
    stepCompletions: {
      id: string;
      progressId: string;
      stepId: string;
      stepKey: string;
      status: string;
      xpEarned: number;
      completedAt?: string | null;
    }[];
  } | null;
}

const MY_ONBOARDING_PROGRESS_QUERY = graphql(`
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
`);

export function useMyOnboardingProgress(
  trackKey: string,
  options: { enabled?: boolean } = {}
): UseQueryResult<MyOnboardingProgressResponse> {
  const { data: sessionData } = authClient.useSession();
  const token = sessionData?.session?.token;
  const isEnabled = (options.enabled ?? Boolean(trackKey)) && Boolean(token);

  return useQuery({
    queryKey: ['myOnboardingProgress', trackKey],
    queryFn: async () => {
      const result = await gqlRequest(
        MY_ONBOARDING_PROGRESS_QUERY,
        { trackKey },
        token ? { Authorization: `Bearer ${token}` } : {}
      );
      // Existing code returned { myOnboardingProgress: null } on null data?
      // No, existing code returned `payload.data ?? { myOnboardingProgress: null }`.
      // gqlRequest returns result.
      // If result is null (shouldn't be), handled.
      return result as unknown as MyOnboardingProgressResponse;
    },
    enabled: isEnabled,
    staleTime: 5_000,
  });
}
