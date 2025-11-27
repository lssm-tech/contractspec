"use server"

import { Resend } from "resend"

export type SubmitContactFormResult = {
  success: boolean;
  text: string;
};

export type SubmitNewsletterResult = {
  success: boolean;
  text: string;
};

export async function submitContactForm(formData: FormData) {
  try {
    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY environment variable is not set")
      return {
        success: false,
        error: "Email service is not configured. Please contact us directly at contact@chaman.ventures",
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const name = formData.get("name") as string
    const email = formData.get("email") as string

    // Basic validation
    if (!email) {
      return { success: false, error: "Please fill in all required fields." }
    }

    const emailContent = `
New venture proposal from ${name || email}

Contact Information:
- Name: ${name}
- Email: ${email}

Venture Details:

---
Submitted via Chaman Ventures contact form
    `.trim()

    await resend.emails.send({
      from: "Chaman Ventures <noreply@lssm.dev>",
      to: ["contact@chaman.ventures"],
      subject: `New ContractSpec Request from ${name || email}`,
      text: emailContent,
      replyTo: email,
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to send email:", error)
    return {
      success: false,
      error: "Failed to send message. Please contact us directly at contact@chaman.ventures",
    }
  }
}

export async function subscribeToNewsletter(formData: FormData) {
  try {
    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY environment variable is not set")
      return {
        success: false,
        error: "Newsletter service is not configured. Please try again later.",
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const email = formData.get("email") as string

    // Basic validation
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." }
    }

    // Send welcome email
    await resend.emails.send({
      from: "ContractSpec <noreply@lssm.dev>",
      to: [email],
      subject: "Welcome to ContractSpec Newsletter",
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
    })

    // Also notify the team
    await resend.emails.send({
      from: "ContractSpec <noreply@lssm.dev>",
      to: ["contact@chaman.ventures"],
      subject: `New Newsletter Subscription: ${email}`,
      text: `New newsletter subscription from: ${email}`,
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to subscribe to newsletter:", error)
    return {
      success: false,
      error: "Failed to subscribe. Please try again later.",
    }
  }
}
