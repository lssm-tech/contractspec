import type {
  PresentationSpecMeta,
  PresentationSpec,
} from '@contractspec/lib.contracts';
import { StabilityEnum } from '@contractspec/lib.contracts';
import { StudioOnboardingTrackModel } from '../operations';

const baseMeta: Pick<
  PresentationSpecMeta,
  'domain' | 'owners' | 'tags' | 'title' | 'stability'
> = {
  domain: 'learning-journey',
  title: 'Studio Onboarding',
  owners: ['@examples.learning-journey.studio-onboarding'] as string[],
  tags: ['learning', 'onboarding', 'studio'] as string[],
  stability: StabilityEnum.Experimental,
};

export const StudioOnboardingTrackPresentation: PresentationSpec = {
  meta: {
    key: 'learning.journey.studio.track',
    version: 1,
    description: 'Studio onboarding track detail',
    goal: 'Visualize the onboarding track for the user.',
    context: 'Displayed in the Studio dashboard.',
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
    key: 'learning.journey.studio.widget',
    version: 1,
    description: 'Compact widget for Studio onboarding progress',
    goal: 'Show quick progress summary.',
    context: 'Displayed in the Studio sidebar or header.',
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
