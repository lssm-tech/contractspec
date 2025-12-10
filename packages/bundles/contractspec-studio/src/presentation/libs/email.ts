'use server';

export { submitContactForm } from './email/contact';
export { subscribeToNewsletter } from './email/newsletter';
export { joinWaitlist } from './email/waitlist';
export { submitWaitlistApplication } from './email/waitlist-application';
export type {
  SubmitContactFormResult,
  SubmitNewsletterResult,
  SubmitWaitlistResult,
  SubmitWaitlistApplicationResult,
  EmailSendOutcome,
} from './email/types';
