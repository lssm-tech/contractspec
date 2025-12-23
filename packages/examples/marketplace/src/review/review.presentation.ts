import type { PresentationSpec } from '@lssm/lib.contracts';
import { ReviewModel } from './review.schema';

export const ReviewListPresentation: PresentationSpec = {
  meta: {
    name: 'marketplace.review.list',
    version: 1,
    description: 'List of product reviews',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'review', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ReviewList',
    props: ReviewModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['marketplace.reviews.enabled'],
  },
};

export const ReviewFormPresentation: PresentationSpec = {
  meta: {
    name: 'marketplace.review.form',
    version: 1,
    description: 'Form for submitting product reviews',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'review', 'form'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ReviewForm',
    props: ReviewModel,
  },
  targets: ['react'],
  policy: {
    flags: ['marketplace.reviews.enabled'],
  },
};
