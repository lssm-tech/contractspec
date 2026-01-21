'use server';

import { getEmailConfig, sendEmail } from './client';
import { escapeHtml, formatMultilineHtml } from './utils';
import type { SubmitWaitlistApplicationResult } from './types';

const APPLICATION_MISSING_CONFIG =
  'Waitlist application service is not configured. Please try again later.';
const APPLICATION_SEND_ERROR =
  'Failed to submit application. Please try again later or contact us directly.';

export const submitWaitlistApplication = async (
  formData: FormData
): Promise<SubmitWaitlistApplicationResult> => {
  const email = (formData.get('email') ?? '').toString().trim();
  const name = (formData.get('name') ?? '').toString().trim();
  const company = (formData.get('company') ?? '').toString().trim();
  const role = (formData.get('role') ?? '').toString().trim();
  const useCase = (formData.get('useCase') ?? '').toString().trim();
  const currentStack = (formData.get('currentStack') ?? '').toString().trim();
  const whatBuilding = (formData.get('whatBuilding') ?? '').toString().trim();
  const whatSolving = (formData.get('whatSolving') ?? '').toString().trim();
  const teamSize = (formData.get('teamSize') ?? '').toString().trim();
  const timeline = (formData.get('timeline') ?? '').toString().trim();

  const openToSessions = formData.get('openToSessions') === 'on';
  const okayWithCaseStudies = formData.get('okayWithCaseStudies') === 'on';

  if (!email || !email.includes('@')) {
    return {
      success: false,
      text: 'Please enter a valid email address.',
    };
  }

  if (!name || !whatBuilding || !whatSolving) {
    return {
      success: false,
      text: 'Please fill in all required fields.',
    };
  }

  const configResult = getEmailConfig();
  if (!configResult.ok || !configResult.config) {
    return {
      success: false,
      text: configResult.errorMessage ?? APPLICATION_MISSING_CONFIG,
    };
  }

  const applicantText = `
You're on the list.

Thanks for applying to the ContractSpec design partner program. We're slowly onboarding design partners in waves. If your use case is a good fit, we'll reach out personally.

What happens next:
• We review applications weekly
• If selected, we'll reach out via email to schedule an intro call
• During early access, you'll get hands-on support and influence over the roadmap

In the meantime:
• Check out our docs: https://contractspec.io/docs
• Book a demo call: https://contractspec.io/contact

We're excited about the possibility of working together!

---
ContractSpec Team
https://contractspec.io
  `.trim();

  const applicantHtml = `
    <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto;">
      <h1 style="color: #8b5cf6;">You're on the list.</h1>
      <p>Thanks for applying to the ContractSpec design partner program. We're slowly onboarding design partners in waves. If your use case is a good fit, we'll reach out personally.</p>
      <h2 style="color: #8b5cf6; margin-top: 24px;">What happens next:</h2>
      <ul style="line-height: 1.8;">
        <li>We review applications weekly</li>
        <li>If selected, we'll reach out via email to schedule an intro call</li>
        <li>During early access, you'll get hands-on support and influence over the roadmap</li>
      </ul>
      <h2 style="color: #8b5cf6; margin-top: 24px;">In the meantime:</h2>
      <ul style="line-height: 1.8;">
        <li>Check out our <a href="https://contractspec.io/docs" style="color: #8b5cf6;">docs</a></li>
        <li>Book a demo call: <a href="https://contractspec.io/contact" style="color: #8b5cf6;">contractspec.io/contact</a></li>
      </ul>
      <p>We're excited about the possibility of working together!</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <p style="color: #6b7280; font-size: 14px;">
        ContractSpec Team<br />
        <a href="https://contractspec.io" style="color: #8b5cf6;">contractspec.io</a>
      </p>
    </div>
  `;

  const applicantSend = await sendEmail(configResult.config, {
    to: [{ email }],
    subject: "You're on the ContractSpec design partner waitlist!",
    text: applicantText,
    html: applicantHtml,
    context: 'waitlist-application-welcome',
  });

  if (!applicantSend.success) {
    return { success: false, text: APPLICATION_SEND_ERROR };
  }

  const preferencesText = `
Open to 1:1 product/design sessions: ${openToSessions ? 'Yes' : 'No'}
Okay with anonymized case studies: ${okayWithCaseStudies ? 'Yes' : 'No'}
  `.trim();

  const teamEmailText = `
New Design Partner Waitlist Application

Contact Information:
- Name: ${name}
- Email: ${email}
${company ? `- Company/Project: ${company}` : ''}
${role ? `- Role: ${role}` : ''}

Application Details:
- What are you building with AI today?
${whatBuilding}

- What do you hope ContractSpec will solve for you?
${whatSolving}

- Primary use case: ${useCase || 'Not specified'}
- Current stack: ${currentStack || 'Not specified'}
- Team Size: ${teamSize || 'Not specified'}
- Timeline: ${timeline || 'Not specified'}

Preferences:
- Open to 1:1 product/design sessions: ${openToSessions ? 'Yes' : 'No'}
- Okay with anonymized case studies: ${okayWithCaseStudies ? 'Yes' : 'No'}

---
Submitted via ContractSpec waitlist application form
  `.trim();

  const teamEmailHtml = `
    <div style="font-family: sans-serif; max-width: 720px; margin: 0 auto;">
      <h1 style="color: #8b5cf6;">New Design Partner Waitlist Application</h1>
      <h2 style="color: #8b5cf6; margin: 16px 0 8px;">Contact Information</h2>
      <ul style="padding-left: 16px; line-height: 1.6; margin: 0 0 16px;">
        <li>Name: ${escapeHtml(name)}</li>
        <li>Email: ${escapeHtml(email)}</li>
        ${company ? `<li>Company/Project: ${escapeHtml(company)}</li>` : ''}
        ${role ? `<li>Role: ${escapeHtml(role)}</li>` : ''}
      </ul>
      <h2 style="color: #8b5cf6; margin: 16px 0 8px;">Application Details</h2>
      <p style="margin: 0 0 8px; font-weight: 600;">What are you building with AI today?</p>
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: #f9fafb; white-space: pre-wrap; line-height: 1.6;">
        ${formatMultilineHtml(whatBuilding)}
      </div>
      <p style="margin: 16px 0 8px; font-weight: 600;">What do you hope ContractSpec will solve for you?</p>
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: #f9fafb; white-space: pre-wrap; line-height: 1.6;">
        ${formatMultilineHtml(whatSolving)}
      </div>
      <ul style="padding-left: 16px; line-height: 1.6; margin: 16px 0;">
        <li>Primary use case: ${escapeHtml(useCase || 'Not specified')}</li>
        <li>Current stack: ${escapeHtml(currentStack || 'Not specified')}</li>
        <li>Team Size: ${escapeHtml(teamSize || 'Not specified')}</li>
        <li>Timeline: ${escapeHtml(timeline || 'Not specified')}</li>
      </ul>
      <h2 style="color: #8b5cf6; margin: 16px 0 8px;">Preferences</h2>
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: #f9fafb; line-height: 1.6;">
        ${formatMultilineHtml(preferencesText)}
      </div>
      <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">Submitted via ContractSpec waitlist application form</p>
    </div>
  `;

  const teamSend = await sendEmail(configResult.config, {
    to: [configResult.config.teamInbox],
    subject: `New Design Partner Application: ${name} (${email})`,
    text: teamEmailText,
    html: teamEmailHtml,
    replyTo: email,
    context: 'waitlist-application-team-notification',
  });

  if (!teamSend.success) {
    return { success: false, text: APPLICATION_SEND_ERROR };
  }

  return {
    success: true,
    text: 'Application submitted successfully!',
  };
};
