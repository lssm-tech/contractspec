import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { onboardingTrackCatalog } from '../tracks';

const baseMeta = {
  domain: 'learning-journey',
  owners: ['learning-team'],
  tags: ['learning', 'journey', 'onboarding'],
} as const;

export const LearningTrackListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'learning.journey.track_list',
    version: 1,
    description: 'List of learning journeys available to the learner.',
    ...baseMeta,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'LearningTrackList',
    props: onboardingTrackCatalog,
  },
  targets: ['react', 'markdown'],
};

export const LearningTrackDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'learning.journey.track_detail',
    version: 1,
    description: 'Track detail with steps and progress state.',
    ...baseMeta,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'LearningTrackDetail',
  },
  targets: ['react', 'markdown', 'application/json'],
};

export const LearningTrackProgressWidgetPresentation: PresentationDescriptorV2 =
  {
    meta: {
      name: 'learning.journey.progress_widget',
      version: 1,
      description: 'Compact widget showing progress for active track.',
      ...baseMeta,
    },
    source: {
      type: 'component',
      framework: 'react',
      componentKey: 'LearningTrackProgressWidget',
    },
    targets: ['react'],
  };

export const learningJourneyPresentations = [
  LearningTrackListPresentation,
  LearningTrackDetailPresentation,
  LearningTrackProgressWidgetPresentation,
];
