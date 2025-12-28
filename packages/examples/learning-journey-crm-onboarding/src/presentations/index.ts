import type {
  PresentationSpecMeta,
  PresentationSpec,
} from '@contractspec/lib.contracts';
import { StabilityEnum } from '@contractspec/lib.contracts';
import { CrmOnboardingTrackModel } from '../operations';

const baseMeta: Pick<
  PresentationSpecMeta,
  'domain' | 'owners' | 'tags' | 'title' | 'stability' | 'goal' | 'context'
> = {
  domain: 'learning-journey',
  title: 'CRM Onboarding',
  owners: ['@examples.learning-journey.crm-onboarding'],
  tags: ['learning', 'crm', 'onboarding'],
  stability: StabilityEnum.Experimental,
  goal: 'Guide CRM users through onboarding',
  context: 'CRM onboarding journey',
};

export const CrmOnboardingTrackPresentation: PresentationSpec = {
  meta: {
    key: 'learning.journey.crm.track',
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
    key: 'learning.journey.crm.widget',
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
