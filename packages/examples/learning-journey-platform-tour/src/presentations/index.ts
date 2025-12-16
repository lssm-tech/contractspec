import type {
  PresentationDescriptorV2,
  PresentationV2Meta,
} from '@lssm/lib.contracts';
import { PlatformTourTrackModel } from '../contracts';

const baseMeta: Pick<PresentationV2Meta, 'domain' | 'owners' | 'tags'> = {
  domain: 'learning-journey',
  owners: ['examples.learning-journey.platform-tour'],
  tags: ['learning', 'platform', 'tour'],
};

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
    props: PlatformTourTrackModel,
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
