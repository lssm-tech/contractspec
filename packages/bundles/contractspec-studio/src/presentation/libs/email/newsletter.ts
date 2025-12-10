'use server';

import { getEmailConfig, sendEmail } from './client';
import { formatMultilineHtml } from './utils';
import type { SubmitNewsletterResult } from './types';

const NEWSLETTER_MISSING_CONFIG =
  'Newsletter service is not configured. Please try again later.';
const NEWSLETTER_SEND_ERROR =
  'Failed to subscribe. Please try again later or contact us directly.';

export const subscribeToNewsletter = async (
  formData: FormData
): Promise<SubmitNewsletterResult> => {
  const email = (formData.get('email') ?? '').toString().trim();

  if (!email || !email.includes('@')) {
    return {
      success: false,
      text: 'Please enter a valid email address.',
    };
  }

  const configResult = getEmailConfig();
  if (!configResult.ok || !configResult.config) {
    return {
      success: false,
      text: configResult.errorMessage ?? NEWSLETTER_MISSING_CONFIG,
    };
  }

  const welcomeText = `
Welcome to ContractSpec!

Thanks for subscribing to our newsletter. You'll receive updates on:

• New integrations (Stripe, OpenAI, Qdrant, and more)
• Product features and improvements
• New templates and examples
• Architecture insights and best practices
• Documentation updates

Stay tuned for exciting updates!

---
ContractSpec Team
https://contractspec.lssm.tech

Unsubscribe: Reply to this email with "unsubscribe"
  `.trim();

  const welcomeHtml = `
    <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto;">
      <h1 style="color: #8b5cf6;">Welcome to ContractSpec!</h1>
      <p>Thanks for subscribing to our newsletter. You'll receive updates on:</p>
      <ul style="line-height: 1.8;">
        <li>New integrations (Stripe, OpenAI, Qdrant, and more)</li>
        <li>Product features and improvements</li>
        <li>New templates and examples</li>
        <li>Architecture insights and best practices</li>
        <li>Documentation updates</li>
      </ul>
      <p>Stay tuned for exciting updates!</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <p style="color: #6b7280; font-size: 14px;">
        ContractSpec Team<br />
        <a href="https://contractspec.lssm.tech" style="color: #8b5cf6;">contractspec.lssm.tech</a>
      </p>
      <p style="color: #9ca3af; font-size: 12px;">
        To unsubscribe, reply to this email with "unsubscribe"
      </p>
    </div>
  `;

  const userSend = await sendEmail(configResult.config, {
    to: [{ email }],
    subject: 'Welcome to ContractSpec Newsletter',
    text: welcomeText,
    html: welcomeHtml,
    context: 'newsletter-welcome',
  });

  if (!userSend.success) {
    return { success: false, text: NEWSLETTER_SEND_ERROR };
  }

  const teamNotificationText = `New newsletter subscription from: ${email}`;
  const teamNotificationHtml = `
    <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto;">
      <p style="margin: 0 0 8px;">New newsletter subscription</p>
      <p style="margin: 0;"><strong>Email:</strong> ${formatMultilineHtml(email)}</p>
    </div>
  `;

  const teamSend = await sendEmail(configResult.config, {
    to: [configResult.config.teamInbox],
    subject: `New Newsletter Subscription: ${email}`,
    text: teamNotificationText,
    html: teamNotificationHtml,
    context: 'newsletter-team-notification',
  });

  if (!teamSend.success) {
    return { success: false, text: NEWSLETTER_SEND_ERROR };
  }

  return { success: true, text: 'Successfully subscribed!' };
};
