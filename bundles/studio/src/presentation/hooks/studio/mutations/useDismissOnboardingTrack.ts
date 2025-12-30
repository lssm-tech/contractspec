import { graphql } from '@contractspec/lib.gql-client-studio';
import { useGraphQLMutation } from '../../../libs/gql-client';

const DISMISS_ONBOARDING_TRACK_MUTATION = graphql(`
  mutation DismissOnboardingTrack($trackKey: String!) {
    dismissOnboardingTrack(trackKey: $trackKey) {
      id
      trackKey
      isDismissed
      dismissedAt
    }
  }
`);

export function useDismissOnboardingTrack() {
  const mutation = useGraphQLMutation(DISMISS_ONBOARDING_TRACK_MUTATION);
  return {
    ...mutation,
    mutateAsync: async (trackKey: string) => {
      const result = await mutation.mutateAsync({ trackKey });
      return result.dismissOnboardingTrack;
    },
  };
}
