import { TagsEnum } from '@contractspec/lib.contracts-spec/ownership';
import type { PresentationSpec } from '@contractspec/lib.contracts-spec/presentations';
import {
  createComponentPresentation,
  MARKETING_CONTEXT,
  MARKETING_GOAL,
} from './factory';
import type { ComponentMap } from './types';

// Import page components - Root/Marketing pages
import {
  ChangelogPage,
  ContactClient,
  LandingPage,
  PricingClient,
  ProductClientPage,
} from '../components/marketing';

/**
 * Component map for landing/marketing page React rendering.
 */
export const landingComponentMap: ComponentMap = {
  LandingPage,
  PricingPage: PricingClient,
  ProductPage: ProductClientPage,
  ContactPage: ContactClient,
  ChangelogPage,
};

/**
 * Presentation specs for landing/marketing pages.
 */
export const landingPresentations: [string, PresentationSpec][] = [
  [
    '/',
    createComponentPresentation({
      key: 'web-landing.home',
      componentKey: 'LandingPage',
      description:
        'ContractSpec landing page - Stabilize your AI-generated code',
      goal: MARKETING_GOAL,
      context: MARKETING_CONTEXT,
      tags: ['landing', 'home'],
    }),
  ],
  [
    '/pricing',
    createComponentPresentation({
      key: 'web-landing.pricing',
      componentKey: 'PricingPage',
      description: 'ContractSpec pricing information',
      goal: 'Help visitors understand pricing and choose a plan',
      context: MARKETING_CONTEXT,
      tags: ['pricing', 'plans'],
    }),
  ],
  [
    '/product',
    createComponentPresentation({
      key: 'web-landing.product',
      componentKey: 'ProductPage',
      description: 'ContractSpec product overview',
      goal: 'Explain product features and benefits',
      context: MARKETING_CONTEXT,
      tags: ['product', 'features'],
    }),
  ],
  [
    '/contact',
    createComponentPresentation({
      key: 'web-landing.contact',
      componentKey: 'ContactPage',
      description: 'Contact ContractSpec team',
      goal: 'Enable visitors to reach the ContractSpec team',
      context: MARKETING_CONTEXT,
      tags: ['contact', 'support'],
    }),
  ],
  [
    '/changelog',
    createComponentPresentation({
      key: 'web-landing.changelog',
      componentKey: 'ChangelogPage',
      description: 'ContractSpec changelog and release notes',
      goal: 'Keep users informed about changes and updates',
      context: MARKETING_CONTEXT,
      tags: ['changelog', 'releases'],
    }),
  ],
];

/**
 * Presentation specs for learning journey pages.
 */
export const learningPresentations: [string, PresentationSpec][] = [
  [
    '/learning',
    createComponentPresentation({
      key: 'web-landing.learning.tracks',
      componentKey: 'LearningTrackList',
      description: 'Learning tracks list',
      goal: 'Guide users through ContractSpec learning paths',
      context: 'Part of the onboarding and education experience',
      tags: [TagsEnum.Guide, 'learning', 'onboarding'],
    }),
  ],
  [
    '/learning/:trackId',
    createComponentPresentation({
      key: 'web-landing.learning.track-detail',
      componentKey: 'LearningTrackDetail',
      description: 'Learning track detail view',
      goal: 'Show progress and content for a specific learning track',
      context: 'Part of the onboarding and education experience',
      tags: [TagsEnum.Guide, 'learning', 'onboarding'],
    }),
  ],
];
