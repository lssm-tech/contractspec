import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts-spec';

export const LearningJourneyCapability = defineCapability({
  meta: {
    key: 'learning-journey',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'Guided learning paths and progress tracking',
    owners: ['platform.core'],
    tags: ['learning', 'onboarding', 'ui'],
  },
});

export const OnboardingCapability = defineCapability({
  meta: {
    key: 'onboarding',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'User onboarding and first-time experience flows',
    owners: ['platform.core'],
    tags: ['onboarding', 'ux', 'ui'],
  },
});

export const GamificationCapability = defineCapability({
  meta: {
    key: 'gamification',
    version: '1.0.0',
    kind: 'ui',
    stability: StabilityEnum.Experimental,
    description: 'Gamification elements like badges, points, and achievements',
    owners: ['platform.core'],
    tags: ['gamification', 'engagement', 'ui'],
  },
});
