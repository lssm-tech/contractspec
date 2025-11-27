"use client";

import { submitContactForm, SubmitContactFormResult } from "@/lib/email";
import { useActionState, useState } from "react";
import { usePostHog } from "@posthog/react";

export default function ContactClient() {
  const posthog = usePostHog();

  const handleSubmit = async (
    _prevState: SubmitContactFormResult | null,
    formData: FormData
  ) => {
    const email = formData.get("email");
    const result = await submitContactForm(formData);

    if (result.success) {
      posthog.capture("contact_form_submitted", {
        email: formData.get("email"),
      });
      return {
        success: true,
        text: "Thank you! We'll get back to you within 24 hours.",
      };
    } else {
      return {
        success: false,
        text: result.error || "Something went wrong. Please try again.",
      };
    }
  };
  const [submitResult, submitAction, isPending] = useActionState<
    SubmitContactFormResult | null,
    FormData
  >(handleSubmit, null);

  return (
    <section className="section-padding hero-gradient w-full">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-5xl font-bold">Book a 15-min call</h1>
        <p className="text-lg text-muted-foreground">
          Schedule a walkthrough with our team.
        </p>

        <form action={submitAction} className="card-subtle p-6 space-y-4 mt-8">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-foreground"
            required
          />
          <button type="submit" className="btn-primary w-full">
            Schedule call
          </button>
          <p className="text-xs text-muted-foreground">
            We'll send you a calendar link within 24 hours.
          </p>

          {submitResult && !isPending && (
            <div
              className={`p-4 rounded ${
                !!submitResult.success
                  ? "bg-deep-green border border-deep-green/30"
                  : "bg-red-500 border border-red-500/30"
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
