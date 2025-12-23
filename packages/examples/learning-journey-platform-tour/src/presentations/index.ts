import type { PresentationMeta, PresentationSpec } from '@lssm/lib.contracts';
import { PlatformTourTrackModel } from '../contracts';

const baseMeta: Pick<PresentationMeta, 'domain' | 'owners' | 'tags'> = {
  domain: 'learning-journey',
  owners: ['examples.learning-journey.platform-tour'],
  tags: ['learning', 'platform', 'tour'],
};

export const PlatformTourTrackPresentation: PresentationSpec = {
  meta: {
    name: 'learning.journey.platform.track',
    version: 1,
    description: 'Platform primitives tour track detail',
    ...baseMeta,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'LearningTrackDetail',
    props: PlatformTourTrackModel,
  },
  targets: ['react', 'markdown', 'application/json'],
};

export const PlatformTourWidgetPresentation: PresentationSpec = {
  meta: {
    name: 'learning.journey.platform.widget',
    version: 1,
    description: 'Compact widget for platform tour progress',
    ...baseMeta,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'LearningTrackProgressWidget',
  },
  targets: ['react'],
};

export const platformTourPresentations = [
  PlatformTourTrackPresentation,
  PlatformTourWidgetPresentation,
];
