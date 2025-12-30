'use client';

import { subscribeToNewsletter } from '@contractspec/bundle.studio/presentation/libs/email/newsletter';
import { SubmitNewsletterResult } from '@contractspec/bundle.studio/presentation/libs/email/types';
import { useActionState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { ActionForm, Link as DSLink } from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Small, Muted } from '@contractspec/lib.ui-kit-web/ui/typography';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@contractspec/lib.ui-kit-web/ui/input-group';

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
    <VStack className="gap-3">
      <Small className="font-semibold">Stay updated</Small>
      <Muted>
        Get the latest updates on new integrations, features, and templates.
      </Muted>
      <ActionForm action={submitAction}>
        <VStack className="gap-3">
          <HStack className="flex-wrap gap-2">
            <InputGroup>
              <InputGroupInput
                type="email"
                name="email"
                placeholder="your@email.com"
                disabled={isPending || submitResult?.success}
                aria-label="Email address"
                className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                required
              />
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  variant="secondary"
                  type="submit"
                  disabled={isPending || submitResult?.success}
                  size="sm"
                >
                  {isPending ? 'Sending…' : 'Subscribe'}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </HStack>

          {submitResult && !isPending && (
            <HStack
              className={`items-center gap-2 rounded border p-2 text-xs ${
                submitResult.success
                  ? 'border-green-500/20 bg-green-500/10 text-green-400'
                  : 'border-red-500/20 bg-red-500/10 text-red-400'
              }`}
            >
              {submitResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <Small>{submitResult.text}</Small>
            </HStack>
          )}
        </VStack>
      </ActionForm>
      <Muted className="text-xs">
        No spam. Unsubscribe anytime. Manage preferences via{' '}
        <DSLink href="/legal/privacy">Privacy</DSLink>.
      </Muted>
    </VStack>
  );
}
