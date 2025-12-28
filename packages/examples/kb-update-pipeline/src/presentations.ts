import { StabilityEnum } from '@contractspec/lib.contracts';
import type { PresentationSpec } from '@contractspec/lib.contracts';
import { ChangeCandidateModel, ReviewTaskModel } from './entities/models';

export const KbDashboardPresentation: PresentationSpec = {
  meta: {
    key: 'kb.dashboard',
    version: 1,
    title: 'KB Update Dashboard',
    description: 'Overview of KB change candidates and review tasks.',
    domain: 'knowledge',
    owners: ['@examples'],
    tags: ['dashboard', 'knowledge'],
    stability: StabilityEnum.Experimental,
    goal: 'Visualize status',
    context: 'Dashboard',
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
    key: 'kb.review.list',
    version: 1,
    title: 'Review Tasks',
    description: 'List of pending review tasks for the current user.',
    domain: 'knowledge',
    owners: ['@examples'],
    tags: ['list', 'review'],
    stability: StabilityEnum.Experimental,
    goal: 'List tasks',
    context: 'Inbox',
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
    key: 'kb.review.form',
    version: 1,
    title: 'Review Change',
    description: 'Form to approve or reject a KB change candidate.',
    domain: 'knowledge',
    owners: ['@examples'],
    tags: ['form', 'review'],
    stability: StabilityEnum.Experimental,
    goal: 'Review',
    context: 'Detail',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ReviewDecisionForm',
    props: ReviewTaskModel,
  },
  targets: ['react'],
};
