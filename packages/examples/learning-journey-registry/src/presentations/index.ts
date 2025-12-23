import type { PresentationMeta, PresentationSpec } from '@lssm/lib.contracts';

const baseMeta: Pick<PresentationMeta, 'domain' | 'owners' | 'tags'> = {
  domain: 'learning-journey',
  owners: ['learning-team'] as string[],
  tags: ['learning', 'journey', 'onboarding'] as string[],
};

export const LearningTrackListPresentation: PresentationSpec = {
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

export const LearningTrackDetailPresentation: PresentationSpec = {
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

export const LearningTrackProgressWidgetPresentation: PresentationSpec = {
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
