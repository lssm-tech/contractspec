import type {
  PresentationDescriptorV2,
  PresentationV2Meta,
} from '@lssm/lib.contracts';
import { CrmOnboardingTrackModel } from '../contracts';

const baseMeta: Pick<PresentationV2Meta, 'domain' | 'owners' | 'tags'> = {
  domain: 'learning-journey',
  owners: ['examples.learning-journey.crm-onboarding'],
  tags: ['learning', 'crm', 'onboarding'],
};

export const CrmOnboardingTrackPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'learning.journey.crm.track',
    version: 1,
    description: 'CRM first win track detail',
    ...baseMeta,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'LearningTrackDetail',
    props: CrmOnboardingTrackModel,
  },
  targets: ['react', 'markdown', 'application/json'],
};

export const CrmOnboardingWidgetPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'learning.journey.crm.widget',
    version: 1,
    description: 'Compact widget for CRM onboarding progress',
    ...baseMeta,
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'LearningTrackProgressWidget',
  },
  targets: ['react'],
};

export const crmOnboardingPresentations = [
  CrmOnboardingTrackPresentation,
  CrmOnboardingWidgetPresentation,
];



