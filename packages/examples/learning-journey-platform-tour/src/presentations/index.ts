import {
  definePresentation,
  StabilityEnum,
  type PresentationSpecMeta,
} from '@contractspec/lib.contracts-spec';
import { PlatformTourTrackModel } from '../operations';

const baseMeta: Pick<
  PresentationSpecMeta,
  'domain' | 'owners' | 'tags' | 'title' | 'stability' | 'goal' | 'context'
> = {
  domain: 'learning-journey',
  title: 'Platform Tour',
  owners: ['@examples.learning-journey.platform-tour'],
  tags: ['learning', 'platform', 'tour'],
  stability: StabilityEnum.Experimental,
  goal: 'Visualize platform tour progress',
  context: 'Used in platform tour dashboard and widgets',
};

export const PlatformTourTrackPresentation = definePresentation({
  meta: {
    key: 'learning.journey.platform.track',
    version: '1.0.0',
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
});

export const PlatformTourWidgetPresentation = definePresentation({
  meta: {
    key: 'learning.journey.platform.widget',
    version: '1.0.0',
    description: 'Compact widget for platform tour progress',
    ...baseMeta,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'LearningTrackProgressWidget',
  },
  targets: ['react'],
});

export const platformTourPresentations = [
  PlatformTourTrackPresentation,
  PlatformTourWidgetPresentation,
];


