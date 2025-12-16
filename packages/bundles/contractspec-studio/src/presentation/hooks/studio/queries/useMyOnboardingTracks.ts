import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export interface OnboardingStepRecord {
  id: string;
  trackId: string;
  stepKey: string;
  title: string;
  description?: string | null;
  instructions?: string | null;
  helpUrl?: string | null;
  order: number;
  completionEvent: string;
  completionCondition?: unknown;
  availability?: unknown;
  xpReward?: number | null;
  isRequired: boolean;
  canSkip: boolean;
  actionUrl?: string | null;
  actionLabel?: string | null;
  highlightSelector?: string | null;
  tooltipPosition?: string | null;
  metadata?: unknown;
}

export interface OnboardingTrackRecord {
  id: string;
  trackKey: string;
  productId?: string | null;
  name: string;
  description?: string | null;
  targetUserSegment?: string | null;
  targetRole?: string | null;
  isActive: boolean;
  isRequired: boolean;
  canSkip: boolean;
  totalXp?: number | null;
  completionXpBonus?: number | null;
  completionBadgeKey?: string | null;
  streakHoursWindow?: number | null;
  streakBonusXp?: number | null;
  metadata?: unknown;
  steps: OnboardingStepRecord[];
}

export interface OnboardingStepCompletionRecord {
  id: string;
  progressId: string;
  stepId: string;
  stepKey: string;
  status: string;
  xpEarned: number;
  completedAt: string;
}

export interface OnboardingProgressRecord {
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
  stepCompletions: OnboardingStepCompletionRecord[];
}

export interface MyOnboardingTracksResult {
  tracks: OnboardingTrackRecord[];
  progress: OnboardingProgressRecord[];
}

export interface MyOnboardingTracksResponse {
  myOnboardingTracks: MyOnboardingTracksResult;
}

const MY_ONBOARDING_TRACKS_QUERY = /* GraphQL */ `
  query MyOnboardingTracks($productId: String, $includeProgress: Boolean) {
    myOnboardingTracks(
      productId: $productId
      includeProgress: $includeProgress
    ) {
      tracks {
        id
        trackKey
        productId
        name
        description
        targetUserSegment
        targetRole
        isActive
        isRequired
        canSkip
        totalXp
        completionXpBonus
        completionBadgeKey
        streakHoursWindow
        streakBonusXp
        metadata
        steps {
          id
          trackId
          stepKey
          title
          description
          instructions
          helpUrl
          order
          completionEvent
          completionCondition
          availability
          xpReward
          isRequired
          canSkip
          actionUrl
          actionLabel
          highlightSelector
          tooltipPosition
          metadata
        }
      }
      progress {
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
  }
`;

async function fetchMyOnboardingTracks(input: {
  productId?: string;
  includeProgress?: boolean;
}): Promise<MyOnboardingTracksResponse> {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: MY_ONBOARDING_TRACKS_QUERY,
      variables: {
        productId: input.productId ?? null,
        includeProgress: input.includeProgress ?? true,
      },
    }),
  });
  const payload = (await response.json()) as {
    data?: MyOnboardingTracksResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }
  return payload.data ?? { myOnboardingTracks: { tracks: [], progress: [] } };
}

export function useMyOnboardingTracks(
  options: {
    productId?: string;
    includeProgress?: boolean;
    enabled?: boolean;
  } = {}
): UseQueryResult<MyOnboardingTracksResponse> {
  return useQuery({
    queryKey: [
      'myOnboardingTracks',
      options.productId ?? 'all',
      options.includeProgress ?? true,
    ],
    queryFn: () =>
      fetchMyOnboardingTracks({
        productId: options.productId,
        includeProgress: options.includeProgress,
      }),
    enabled: options.enabled ?? true,
    staleTime: 5_000,
  });
}





