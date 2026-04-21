'use server';

import { subscribeToNewsletter } from '@contractspec/bundle.marketing/libs/email/newsletter';
import type { SubmitNewsletterResult } from '@contractspec/bundle.marketing/libs/email/types';

export async function submitNewsletterSignup(
	_prevState: SubmitNewsletterResult | null,
	formData: FormData
): Promise<SubmitNewsletterResult> {
	const result = await subscribeToNewsletter(formData);

	if (result.success) {
		return {
			success: true,
			text: 'Thanks for subscribing! Check your inbox for a confirmation.',
		};
	}

	return {
		success: false,
		text: result.text || 'Something went wrong. Please try again.',
	};
}
