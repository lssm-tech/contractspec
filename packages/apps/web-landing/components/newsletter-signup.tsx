"use client";

import { subscribeToNewsletter, SubmitNewsletterResult } from "@/lib/email";
import { useActionState } from "react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function NewsletterSignup() {
  const handleSubmit = async (
    _prevState: SubmitNewsletterResult | null,
    formData: FormData
  ) => {
    const result = await subscribeToNewsletter(formData);

    if (result.success) {
      return {
        success: true,
        text: "Thanks for subscribing! Check your inbox for a confirmation.",
      };
    } else {
      return {
        success: false,
        text: result.error || "Something went wrong. Please try again.",
      };
    }
  };

  const [submitResult, submitAction, isPending] = useActionState<
    SubmitNewsletterResult | null,
    FormData
  >(handleSubmit, null);

  return (
    <div className="space-y-3">
      <h3 className="font-bold mb-2">Stay updated</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get the latest updates on new integrations, features, and templates.
      </p>
      <form action={submitAction} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              disabled={isPending || submitResult?.success}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              aria-label="Email address"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPending || submitResult?.success}
            className="px-4 py-2 bg-violet-500 hover:bg-violet-600 disabled:bg-violet-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
          >
            {isPending ? "..." : "Subscribe"}
          </button>
        </div>

        {submitResult && !isPending && (
          <div
            className={`flex items-center gap-2 text-xs p-2 rounded ${
              submitResult.success
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {submitResult.success ? (
              <CheckCircle size={14} />
            ) : (
              <AlertCircle size={14} />
            )}
            <span>{submitResult.text}</span>
          </div>
        )}
      </form>
      <p className="text-xs text-muted-foreground">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
