import { useMutation } from '@tanstack/react-query';

import type { OnboardingProgressRecord } from '../queries/useMyOnboardingTracks';

export interface DismissOnboardingTrackResponse {
  dismissOnboardingTrack: Pick<
    OnboardingProgressRecord,
    'id' | 'isDismissed' | 'dismissedAt' | 'trackKey'
  >;
}

const DISMISS_ONBOARDING_TRACK_MUTATION = /* GraphQL */ `
  mutation DismissOnboardingTrack($trackKey: String!) {
    dismissOnboardingTrack(trackKey: $trackKey) {
      id
      trackKey
      isDismissed
      dismissedAt
    }
  }
`;

async function dismissTrackRequest(trackKey: string) {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: DISMISS_ONBOARDING_TRACK_MUTATION,
      variables: { trackKey },
    }),
  });
  const payload = (await response.json()) as {
    data?: DismissOnboardingTrackResponse;
    errors?: { message: string }[];
  };
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join(', '));
  }
  return payload.data!;
}

export function useDismissOnboardingTrack() {
  return useMutation({
    mutationFn: dismissTrackRequest,
  });
}



