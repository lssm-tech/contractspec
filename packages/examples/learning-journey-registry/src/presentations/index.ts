import type {
  PresentationSpecMeta,
  PresentationSpec,
} from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';

const baseMeta: Pick<
  PresentationSpecMeta,
  'domain' | 'owners' | 'tags' | 'title' | 'stability' | 'goal' | 'context'
> = {
  domain: 'learning-journey',
  title: 'Learning Journey',
  owners: ['@learning-team'] as string[],
  tags: ['learning', 'journey', 'onboarding'] as string[],
  stability: StabilityEnum.Experimental,
  goal: 'Progress through learning tracks',
  context: 'Learning journey section',
};

export const LearningTrackListPresentation: PresentationSpec = {
  meta: {
    key: 'learning.journey.track_list',
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
    key: 'learning.journey.track_detail',
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
    key: 'learning.journey.progress_widget',
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
