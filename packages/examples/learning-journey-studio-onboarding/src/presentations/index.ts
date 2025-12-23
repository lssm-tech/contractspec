import type { PresentationMeta, PresentationSpec } from '@lssm/lib.contracts';
import { StudioOnboardingTrackModel } from '../contracts';

const baseMeta: Pick<PresentationMeta, 'domain' | 'owners' | 'tags'> = {
  domain: 'learning-journey',
  owners: ['examples.learning-journey.studio-onboarding'] as string[],
  tags: ['learning', 'onboarding', 'studio'] as string[],
};

export const StudioOnboardingTrackPresentation: PresentationSpec = {
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
    props: StudioOnboardingTrackModel,
  },
  targets: ['react', 'markdown', 'application/json'],
};

export const StudioOnboardingWidgetPresentation: PresentationSpec = {
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
