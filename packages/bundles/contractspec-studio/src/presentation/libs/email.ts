'use server';

import { Resend } from 'resend';

export interface SubmitContactFormResult {
  success: boolean;
  text: string;
}

export interface SubmitNewsletterResult {
  success: boolean;
  text: string;
}

export interface SubmitWaitlistResult {
  success: boolean;
  text: string;
}

export interface SubmitWaitlistApplicationResult {
  success: boolean;
  text: string;
}

export async function submitContactForm(formData: FormData) {
  try {
    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set');
      return {
        success: false,
        text: 'Email service is not configured. Please contact us directly at contact@chaman.ventures',
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Basic validation
    if (!email) {
      return {
        success: false,
        text: 'Please fill in all required fields.',
      };
    }

    const emailContent = `
New contact form submission from ${name || email}

Contact Information:
- Name: ${name || 'Not provided'}
- Email: ${email}

Message:
${message || 'No message provided'}

---
Submitted via ContractSpec contact form
    `.trim();

    await resend.emails.send({
      from: 'ContractSpec <noreply@lssm.dev>',
      to: ['contact@chaman.ventures'],
      subject: `New Contact Form Message from ${name || email}`,
      text: emailContent,
      replyTo: email,
    });

    return { success: true, text: 'Message sent successfully!' };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      text: 'Failed to send message. Please contact us directly at contact@chaman.ventures',
    };
  }
}

export async function subscribeToNewsletter(formData: FormData) {
  try {
    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set');
      return {
        success: false,
        text: 'Newsletter service is not configured. Please try again later.',
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const email = formData.get('email') as string;

    // Basic validation
    if (!email || !email.includes('@')) {
      return {
        success: false,
        text: 'Please enter a valid email address.',
      };
    }

    // Send welcome email
    await resend.emails.send({
      from: 'ContractSpec <noreply@lssm.dev>',
      to: [email],
      subject: 'Welcome to ContractSpec Newsletter',
      text: `
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
https://contractspec.chaman.ventures

Unsubscribe: Reply to this email with "unsubscribe"
      `.trim(),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
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
            <a href="https://contractspec.chaman.ventures" style="color: #8b5cf6;">contractspec.chaman.ventures</a>
          </p>
          <p style="color: #9ca3af; font-size: 12px;">
            To unsubscribe, reply to this email with "unsubscribe"
          </p>
        </div>
      `,
    });

    // Also notify the team
    await resend.emails.send({
      from: 'ContractSpec <noreply@lssm.dev>',
      to: ['contact@chaman.ventures'],
      subject: `New Newsletter Subscription: ${email}`,
      text: `New newsletter subscription from: ${email}`,
    });

    return { success: true, text: 'Successfully subscribed!' };
  } catch (error) {
    console.error('Failed to subscribe to newsletter:', error);
    return {
      success: false,
      text: 'Failed to subscribe. Please try again later.',
    };
  }
}

export async function joinWaitlist(formData: FormData) {
  try {
    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set');
      return {
        success: false,
        text: 'Waitlist service is not configured. Please try again later.',
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const email = formData.get('email') as string;

    // Basic validation
    if (!email || !email.includes('@')) {
      return {
        success: false,
        text: 'Please enter a valid email address.',
      };
    }

    // Send waitlist confirmation email
    await resend.emails.send({
      from: 'ContractSpec <noreply@lssm.dev>',
      to: [email],
      subject: "You're on the ContractSpec waitlist!",
      text: `
You're on the waitlist!

Thanks for joining the ContractSpec waitlist. You're now in line for early access to:

• Stabilize your AI-generated code with ContractSpec
• Multi-surface consistency (API, DB, UI, events)
• Safe regeneration without breaking changes
• AI governance and contract enforcement

We'll notify you as soon as early access is available. In the meantime, you can:

• Check out our docs: https://contractspec.chaman.ventures/docs
• Follow our progress on GitHub
• Book a demo call to see ContractSpec in action

We're excited to have you on board!

---
ContractSpec Team
https://contractspec.chaman.ventures

To remove yourself from the waitlist, reply to this email with "remove"
      `.trim(),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
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
            <li>Check out our <a href="https://contractspec.chaman.ventures/docs" style="color: #8b5cf6;">docs</a></li>
            <li>Follow our progress on GitHub</li>
            <li>Book a demo call to see ContractSpec in action</li>
          </ul>
          <p>We're excited to have you on board!</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #6b7280; font-size: 14px;">
            ContractSpec Team<br />
            <a href="https://contractspec.chaman.ventures" style="color: #8b5cf6;">contractspec.chaman.ventures</a>
          </p>
          <p style="color: #9ca3af; font-size: 12px;">
            To remove yourself from the waitlist, reply to this email with "remove"
          </p>
        </div>
      `,
    });

    // Also notify the team
    await resend.emails.send({
      from: 'ContractSpec <noreply@lssm.dev>',
      to: ['contact@chaman.ventures'],
      subject: `New Waitlist Signup: ${email}`,
      text: `New waitlist signup from: ${email}`,
    });

    return { success: true, text: 'Successfully joined waitlist!' };
  } catch (error) {
    console.error('Failed to join waitlist:', error);
    return {
      success: false,
      text: 'Failed to join waitlist. Please try again later.',
    };
  }
}

export async function submitWaitlistApplication(formData: FormData) {
  try {
    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set');
      return {
        success: false,
        text: 'Waitlist application service is not configured. Please try again later.',
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const company = formData.get('company') as string;
    const role = formData.get('role') as string;
    const whatBuilding = formData.get('whatBuilding') as string;
    const whatSolving = formData.get('whatSolving') as string;
    const teamSize = formData.get('teamSize') as string;
    const timeline = formData.get('timeline') as string;
    const openToSessions = formData.get('openToSessions') === 'on';
    const okayWithCaseStudies = formData.get('okayWithCaseStudies') === 'on';

    // Basic validation
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

    // Send confirmation email to applicant
    await resend.emails.send({
      from: 'ContractSpec <noreply@lssm.dev>',
      to: [email],
      subject: "You're on the ContractSpec design partner waitlist!",
      text: `
You're on the list.

Thanks for applying to the ContractSpec design partner program. We're slowly onboarding design partners in waves. If your use case is a good fit, we'll reach out personally.

What happens next:
• We review applications weekly
• If selected, we'll reach out via email to schedule an intro call
• During early access, you'll get hands-on support and influence over the roadmap

In the meantime:
• Check out our docs: https://contractspec.chaman.ventures/docs
• Book a demo call: https://contractspec.chaman.ventures/contact

We're excited about the possibility of working together!

---
ContractSpec Team
https://contractspec.chaman.ventures
      `.trim(),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
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
            <li>Check out our <a href="https://contractspec.chaman.ventures/docs" style="color: #8b5cf6;">docs</a></li>
            <li>Book a demo call: <a href="https://contractspec.chaman.ventures/contact" style="color: #8b5cf6;">contractspec.chaman.ventures/contact</a></li>
          </ul>
          <p>We're excited about the possibility of working together!</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #6b7280; font-size: 14px;">
            ContractSpec Team<br />
            <a href="https://contractspec.chaman.ventures" style="color: #8b5cf6;">contractspec.chaman.ventures</a>
          </p>
        </div>
      `,
    });

    // Send notification email to team with all details
    const teamEmailContent = `
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

- Team Size: ${teamSize || 'Not specified'}
- Timeline: ${timeline || 'Not specified'}

Preferences:
- Open to 1:1 product/design sessions: ${openToSessions ? 'Yes' : 'No'}
- Okay with anonymized case studies: ${okayWithCaseStudies ? 'Yes' : 'No'}

---
Submitted via ContractSpec waitlist application form
    `.trim();

    await resend.emails.send({
      from: 'ContractSpec <noreply@lssm.dev>',
      to: ['contact@chaman.ventures'],
      subject: `New Design Partner Application: ${name} (${email})`,
      text: teamEmailContent,
      replyTo: email,
    });

    return {
      success: true,
      text: 'Application submitted successfully!',
    };
  } catch (error) {
    console.error('Failed to submit waitlist application:', error);
    return {
      success: false,
      text: 'Failed to submit application. Please try again later.',
    };
  }
}
