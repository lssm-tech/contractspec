import type { PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';
import { ReviewModel } from './review.schema';

export const ReviewListPresentation: PresentationSpec = {
  meta: {
    key: 'marketplace.review.list',
    version: 1,
    title: 'Review List',
    description: 'List of product reviews',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'review', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Show users reviews and ratings for a product.',
    context: 'Displayed on the product detail page.',
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
    key: 'marketplace.review.form',
    version: 1,
    title: 'Review Form',
    description: 'Form for submitting product reviews',
    domain: 'marketplace',
    owners: ['@marketplace-team'],
    tags: ['marketplace', 'review', 'form'],
    stability: StabilityEnum.Experimental,
    goal: 'Enable users to submit their feedback and rating for a purchase.',
    context: 'Used in the user order history or product page.',
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
