'use client';

import { subscribeToNewsletter, SubmitNewsletterResult } from '@lssm/bundle.contractspec-studio/presentation/libs/email';
import { useActionState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewsletterSignup() {
  const handleSubmit = async (
    _prevState: SubmitNewsletterResult | null,
    formData: FormData
  ) => {
    const result = await subscribeToNewsletter(formData);

    if (result.success) {
      return {
        success: true,
        text: 'Thanks for subscribing! Check your inbox for a confirmation.',
      };
    } else {
      return {
        success: false,
        text: result.text || 'Something went wrong. Please try again.',
      };
    }
  };

  const [submitResult, submitAction, isPending] = useActionState<
    SubmitNewsletterResult | null,
    FormData
  >(handleSubmit, null);

  return (
    <div className="space-y-3">
      <h3 className="mb-2 font-bold">Stay updated</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        Get the latest updates on new integrations, features, and templates.
      </p>
      <form action={submitAction} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail
              className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
              size={16}
            />
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              disabled={isPending || submitResult?.success}
              className="bg-background border-border w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Email address"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPending || submitResult?.success}
            className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-violet-500/50"
          >
            {isPending ? '...' : 'Subscribe'}
          </button>
        </div>

        {submitResult && !isPending && (
          <div
            className={`flex items-center gap-2 rounded p-2 text-xs ${
              submitResult.success
                ? 'border border-green-500/20 bg-green-500/10 text-green-400'
                : 'border border-red-500/20 bg-red-500/10 text-red-400'
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
      <p className="text-muted-foreground text-xs">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
