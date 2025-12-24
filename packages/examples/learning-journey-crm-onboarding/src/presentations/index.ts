import type { PresentationMeta, PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';
import { CrmOnboardingTrackModel } from '../operations';

const baseMeta: Pick<
  PresentationMeta,
  'domain' | 'owners' | 'tags' | 'title' | 'stability'
> = {
  domain: 'learning-journey',
  title: 'CRM Onboarding',
  owners: ['examples.learning-journey.crm-onboarding'],
  tags: ['learning', 'crm', 'onboarding'],
  stability: StabilityEnum.Experimental,
};

export const CrmOnboardingTrackPresentation: PresentationSpec = {
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

export const CrmOnboardingWidgetPresentation: PresentationSpec = {
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
