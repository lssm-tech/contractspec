'use server';

import { getEmailConfig, sendEmail } from './client';
import { escapeHtml, formatMultilineHtml } from './utils';
import type { SubmitContactFormResult } from './types';

const CONTACT_MISSING_CONFIG =
  'Email service is not configured. Please contact us directly at contact@contractspec.io.';
const CONTACT_SEND_ERROR =
  'Failed to send message. Please contact us directly at contact@contractspec.io.';

export const submitContactForm = async (
  formData: FormData
): Promise<SubmitContactFormResult> => {
  const name = (formData.get('name') ?? '').toString().trim();
  const email = (formData.get('email') ?? '').toString().trim();
  const message = (formData.get('message') ?? '').toString().trim();

  if (!email) {
    return {
      success: false,
      text: 'Please fill in all required fields.',
    };
  }

  const configResult = getEmailConfig();
  if (!configResult.ok || !configResult.config) {
    return {
      success: false,
      text: configResult.errorMessage ?? CONTACT_MISSING_CONFIG,
    };
  }

  const senderName = name || email;
  const emailContentText = `
New contact form submission from ${senderName}

Contact Information:
- Name: ${name || 'Not provided'}
- Email: ${email}

Message:
${message || 'No message provided'}

---
Submitted via ContractSpec contact form
  `.trim();

  const emailContentHtml = `
    <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto;">
      <h1 style="color: #8b5cf6; margin-bottom: 12px;">New contact form submission</h1>
      <p style="margin: 0 0 12px;">From ${escapeHtml(senderName)}</p>
      <h2 style="color: #8b5cf6; margin: 16px 0 8px;">Contact Information</h2>
      <ul style="padding-left: 16px; line-height: 1.6; margin: 0 0 16px;">
        <li>Name: ${escapeHtml(name || 'Not provided')}</li>
        <li>Email: ${escapeHtml(email)}</li>
      </ul>
      <h2 style="color: #8b5cf6; margin: 16px 0 8px;">Message</h2>
      <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; background: #f9fafb; white-space: pre-wrap; line-height: 1.6;">
        ${message ? formatMultilineHtml(message) : 'No message provided'}
      </div>
      <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">Submitted via ContractSpec contact form</p>
    </div>
  `;

  const sendResult = await sendEmail(configResult.config, {
    to: [configResult.config.teamInbox],
    subject: `New Contact Form Message from ${senderName}`,
    text: emailContentText,
    html: emailContentHtml,
    replyTo: email,
    context: 'contact-form',
  });

  if (!sendResult.success) {
    return { success: false, text: CONTACT_SEND_ERROR };
  }

  return { success: true, text: 'Message sent successfully!' };
};
