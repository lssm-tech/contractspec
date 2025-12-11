import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { studioGettingStartedTrack } from '../track';

const baseMeta = {
  domain: 'learning-journey',
  owners: ['examples.learning-journey.studio-onboarding'],
  tags: ['learning', 'onboarding', 'studio'],
} as const;

export const StudioOnboardingTrackPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'learning.journey.studio.track',
    version: 1,
    description: 'Studio onboarding track detail',
    ...baseMeta,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'LearningTrackDetail',
    props: studioGettingStartedTrack,
  },
  targets: ['react', 'markdown', 'application/json'],
};

export const StudioOnboardingWidgetPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'learning.journey.studio.widget',
    version: 1,
    description: 'Compact widget for Studio onboarding progress',
    ...baseMeta,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'LearningTrackProgressWidget',
  },
  targets: ['react'],
};

export const studioOnboardingPresentations = [
  StudioOnboardingTrackPresentation,
  StudioOnboardingWidgetPresentation,
];
