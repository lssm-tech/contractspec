import { graphql } from '@contractspec/lib.gql-client-studio';

export const MY_ONBOARDING_TRACKS_QUERY = graphql(`
  query MyOnboardingTracks($productId: String, $includeProgress: Boolean!) {
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
`);
