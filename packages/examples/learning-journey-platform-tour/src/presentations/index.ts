import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { platformPrimitivesTourTrack } from '../track';

const baseMeta = {
  domain: 'learning-journey',
  owners: ['examples.learning-journey.platform-tour'],
  tags: ['learning', 'platform', 'tour'],
} as const;

export const PlatformTourTrackPresentation: PresentationDescriptorV2 = {
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
    props: platformPrimitivesTourTrack,
  },
  targets: ['react', 'markdown', 'application/json'],
};

export const PlatformTourWidgetPresentation: PresentationDescriptorV2 = {
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
