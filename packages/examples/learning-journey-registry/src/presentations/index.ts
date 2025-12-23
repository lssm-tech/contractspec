import type {
  PresentationDescriptorV2,
  PresentationV2Meta,
} from '@lssm/lib.contracts';
const baseMeta: Pick<PresentationV2Meta, 'domain' | 'owners' | 'tags'> = {
  domain: 'learning-journey',
  owners: ['learning-team'] as string[],
  tags: ['learning', 'journey', 'onboarding'] as string[],
};

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
