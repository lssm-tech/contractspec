'use server';

import { getEmailConfig, sendEmail } from './client';
import { formatMultilineHtml } from './utils';
import type { SubmitWaitlistResult } from './types';

const WAITLIST_MISSING_CONFIG =
  'Waitlist service is not configured. Please try again later.';
const WAITLIST_SEND_ERROR =
  'Failed to join waitlist. Please try again later or contact us directly.';

export const joinWaitlist = async (
  formData: FormData
): Promise<SubmitWaitlistResult> => {
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
      text: configResult.errorMessage ?? WAITLIST_MISSING_CONFIG,
    };
  }

  const waitlistText = `
You're on the waitlist!

Thanks for joining the ContractSpec waitlist. You're now in line for early access to:

• Stabilize your AI-generated code with ContractSpec
• Multi-surface consistency (API, DB, UI, events)
• Safe regeneration without breaking changes
• AI governance and contract enforcement

We'll notify you as soon as early access is available. In the meantime, you can:

• Check out our docs: https://contractspec.lssm.tech/docs
• Follow our progress on GitHub
• Book a demo call to see ContractSpec in action

We're excited to have you on board!

---
ContractSpec Team
https://contractspec.lssm.tech

To remove yourself from the waitlist, reply to this email with "remove"
  `.trim();

  const waitlistHtml = `
    <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto;">
      <h1 style="color: #8b5cf6;">You're on the waitlist!</h1>
      <p>Thanks for joining the ContractSpec waitlist. You're now in line for early access to:</p>
      <ul style="line-height: 1.8;">
        <li>Stabilize your AI-generated code with ContractSpec</li>
        <li>Multi-surface consistency (API, DB, UI, events)</li>
        <li>Safe regeneration without breaking changes</li>
        <li>AI governance and contract enforcement</li>
      </ul>
      <p>We'll notify you as soon as early access is available. In the meantime, you can:</p>
      <ul style="line-height: 1.8;">
        <li>Check out our <a href="https://contractspec.lssm.tech/docs" style="color: #8b5cf6;">docs</a></li>
        <li>Follow our progress on GitHub</li>
        <li>Book a demo call to see ContractSpec in action</li>
      </ul>
      <p>We're excited to have you on board!</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <p style="color: #6b7280; font-size: 14px;">
        ContractSpec Team<br />
        <a href="https://contractspec.lssm.tech" style="color: #8b5cf6;">contractspec.lssm.tech</a>
      </p>
      <p style="color: #9ca3af; font-size: 12px;">
        To remove yourself from the waitlist, reply to this email with "remove"
      </p>
    </div>
  `;

  const userSend = await sendEmail(configResult.config, {
    to: [{ email }],
    subject: "You're on the ContractSpec waitlist!",
    text: waitlistText,
    html: waitlistHtml,
    context: 'waitlist-welcome',
  });

  if (!userSend.success) {
    return { success: false, text: WAITLIST_SEND_ERROR };
  }

  const teamNotificationText = `New waitlist signup from: ${email}`;
  const teamNotificationHtml = `
    <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto;">
      <p style="margin: 0 0 8px;">New waitlist signup</p>
      <p style="margin: 0;"><strong>Email:</strong> ${formatMultilineHtml(email)}</p>
    </div>
  `;

  const teamSend = await sendEmail(configResult.config, {
    to: [configResult.config.teamInbox],
    subject: `New Waitlist Signup: ${email}`,
    text: teamNotificationText,
    html: teamNotificationHtml,
    context: 'waitlist-team-notification',
  });

  if (!teamSend.success) {
    return { success: false, text: WAITLIST_SEND_ERROR };
  }

  return { success: true, text: 'Successfully joined waitlist!' };
};
