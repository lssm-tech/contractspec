import type { PresentationSpec } from '@lssm/lib.contracts';
import { ChangeCandidateModel, ReviewTaskModel } from './entities/models';

export const KbDashboardPresentation: PresentationSpec = {
  meta: {
    name: 'kb.dashboard',
    version: 1,
    title: 'KB Update Dashboard',
    description: 'Overview of KB change candidates and review tasks.',
    domain: 'knowledge',
    owners: ['@examples'],
    tags: ['dashboard', 'knowledge'],
    stability: 'experimental',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'KbDashboard',
    props: ChangeCandidateModel, // Simplified props mapping for example
  },
  targets: ['react', 'markdown'],
};

export const KbReviewListPresentation: PresentationSpec = {
  meta: {
    name: 'kb.review.list',
    version: 1,
    title: 'Review Tasks',
    description: 'List of pending review tasks for the current user.',
    domain: 'knowledge',
    owners: ['@examples'],
    tags: ['list', 'review'],
    stability: 'experimental',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ReviewTaskList',
    props: ReviewTaskModel,
  },
  targets: ['react', 'markdown'],
};

export const KbReviewFormPresentation: PresentationSpec = {
  meta: {
    name: 'kb.review.form',
    version: 1,
    title: 'Review Change',
    description: 'Form to approve or reject a KB change candidate.',
    domain: 'knowledge',
    owners: ['@examples'],
    tags: ['form', 'review'],
    stability: 'experimental',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ReviewDecisionForm',
    props: ReviewTaskModel,
  },
  targets: ['react'],
};
