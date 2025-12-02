'use client';

import { submitContactForm, SubmitContactFormResult } from '@/lib/email';
import { useActionState, useState } from 'react';
import { usePostHog } from '@posthog/react';

export default function ContactClient() {
  const posthog = usePostHog();

  const handleSubmit = async (
    _prevState: SubmitContactFormResult | null,
    formData: FormData
  ) => {
    const email = formData.get('email');
    const result = await submitContactForm(formData);

    if (result.success) {
      posthog.capture('contact_form_submitted', {
        email: formData.get('email'),
      });
      return {
        success: true,
        text: "Thank you! We'll get back to you within 24 hours.",
      };
    } else {
      return {
        success: false,
        text: result.error || 'Something went wrong. Please try again.',
      };
    }
  };
  const [submitResult, submitAction, isPending] = useActionState<
    SubmitContactFormResult | null,
    FormData
  >(handleSubmit, null);

  return (
    <section className="section-padding hero-gradient w-full">
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <h1 className="text-5xl font-bold">Book a 15-min call</h1>
        <p className="text-muted-foreground text-lg">
          Schedule a walkthrough with our team.
        </p>

        <form action={submitAction} className="card-subtle mt-8 space-y-4 p-6">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            className="bg-background border-border text-foreground w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:outline-none"
            required
          />
          <button type="submit" className="btn-primary w-full">
            Schedule call
          </button>
          <p className="text-muted-foreground text-xs">
            We'll send you a calendar link within 24 hours.
          </p>

          {submitResult && !isPending && (
            <div
              className={`rounded p-4 ${
                submitResult.success
                  ? 'bg-deep-green border-deep-green/30 border'
                  : 'border border-red-500/30 bg-red-500'
              }`}
            >
              {submitResult.text}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
