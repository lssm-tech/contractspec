'use client';

import type { SubmitNewsletterResult } from '@contractspec/bundle.marketing/libs/email/types';
import { ActionForm, Link as DSLink } from '@contractspec/lib.design-system';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from '@contractspec/lib.ui-kit-web/ui/input-group';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import { Muted, Small } from '@contractspec/lib.ui-kit-web/ui/typography';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { submitNewsletterSignup } from '../lib/newsletter-action';

function HydratedMailIcon() {
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	if (!isHydrated) {
		return <span aria-hidden="true" className="size-4" />;
	}

	return <Mail aria-hidden="true" className="size-4" />;
}

export default function NewsletterSignup() {
	const [submitResult, submitAction, isPending] = useActionState<
		SubmitNewsletterResult | null,
		FormData
	>(submitNewsletterSignup, null);

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
								autoComplete="email"
								data-lpignore="true"
								disabled={isPending || submitResult?.success}
								aria-label="Email address"
								className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
								required
							/>
							<InputGroupAddon aria-hidden="true">
								<HydratedMailIcon />
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
