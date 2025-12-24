import type { PresentationMeta, PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';
import { StudioOnboardingTrackModel } from '../operations';

const baseMeta: Pick<
  PresentationMeta,
  'domain' | 'owners' | 'tags' | 'title' | 'stability'
> = {
  domain: 'learning-journey',
  title: 'Studio Onboarding',
  owners: ['examples.learning-journey.studio-onboarding'] as string[],
  tags: ['learning', 'onboarding', 'studio'] as string[],
  stability: StabilityEnum.Experimental,
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
