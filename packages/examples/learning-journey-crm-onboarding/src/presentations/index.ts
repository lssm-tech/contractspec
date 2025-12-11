import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { crmFirstWinTrack } from '../track';

const baseMeta = {
  domain: 'learning-journey',
  owners: ['examples.learning-journey.crm-onboarding'],
  tags: ['learning', 'crm', 'onboarding'],
} as const;

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
    props: crmFirstWinTrack,
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
