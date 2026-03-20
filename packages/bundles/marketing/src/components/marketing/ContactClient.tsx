'use client';

import {
	ActionForm,
	Button,
	Input,
	Textarea,
} from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.ui-kit-web/ui/stack';
import {
	H1,
	H2,
	Muted,
	Small,
} from '@contractspec/lib.ui-kit-web/ui/typography';
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	MessageSquare,
} from 'lucide-react';
import { useActionState } from 'react';
import { submitContactForm } from '../../libs/email/contact';
import type { SubmitContactFormResult } from '../../libs/email/types'; // Assuming these are exported from root or similar, need to check where submitContactForm lives.
// Wait check imports again. submitContactForm is imported from @contractspec/bundle.marketing.
// In bundle.marketing, it is likely in 'src/actions' or 'src/utils'.
// I need to check where submitContactForm is defined in bundle.marketing.
import { StudioSignupSection } from './studio-signup-section';

export function ContactClient() {
	// Contact form handler
	const handleContactSubmit = async (
		_prevState: SubmitContactFormResult | null,
		formData: FormData
	): Promise<SubmitContactFormResult> => {
		const result = await submitContactForm(formData);

		if (result.success) {
			return {
				success: true,
				text: "Message sent successfully! We'll get back to you soon.",
			};
		} else {
			return {
				success: false,
				text: result.text || 'Failed to send message. Please try again.',
			};
		}
	};

	const [contactResult, contactAction, contactPending] = useActionState<
		SubmitContactFormResult | null,
		FormData
	>(handleContactSubmit, null);

	return (
		<section className="section-padding hero-gradient w-full">
			<VStack className="mx-auto max-w-4xl gap-16">
				<VStack className="gap-4 text-center">
					<H1 className="font-bold text-5xl">Get in touch</H1>
					<Muted className="text-lg">
						Choose how you'd like to connect with us
					</Muted>
				</VStack>

				{/* Studio Signup Section */}
				<StudioSignupSection />

				{/* Book a Call Section */}
				<VStack className="card-subtle gap-6 p-8" id="call">
					<HStack className="items-center gap-3">
						<Calendar className="text-blue-400" size={24} />
						<VStack className="items-start gap-1">
							<H2 className="font-bold text-2xl">Book a 20-min call</H2>
							<Muted className="text-sm">
								Schedule a walkthrough with our team to see ContractSpec in
								action
							</Muted>
						</VStack>
					</HStack>

					<div className="overflow-hidden rounded-lg border border-border">
						<object
							data="https://meet.reclaimai.com/e/f863cb29-caac-44b6-972b-1407dd9545a3"
							width="100%"
							height="700px"
							style={{ outline: 'none' }}
							aria-label="Calendar booking widget"
						/>
					</div>
				</VStack>

				{/* Send Message Section */}
				<VStack className="card-subtle gap-6 p-8" id="message">
					<HStack className="items-center gap-3">
						<MessageSquare className="text-emerald-400" size={24} />
						<VStack className="items-start gap-1">
							<H2 className="font-bold text-2xl">Send us a message</H2>
							<Muted className="text-sm">
								Have questions or feedback? We'd love to hear from you
							</Muted>
						</VStack>
					</HStack>

					<ActionForm action={contactAction}>
						<VStack className="gap-4">
							<VStack className="gap-2">
								<Small className="font-medium text-sm">Name</Small>
								<Input
									id="contact-name"
									name="name"
									type="text"
									placeholder="Your name"
									disabled={contactPending || contactResult?.success}
									required
								/>
							</VStack>

							<VStack className="gap-2">
								<Small className="font-medium text-sm">Email</Small>
								<Input
									id="contact-email"
									name="email"
									type="email"
									keyboard={{ kind: 'email' }}
									placeholder="your@email.com"
									disabled={contactPending || contactResult?.success}
									required
								/>
							</VStack>

							<VStack className="gap-2">
								<Small className="font-medium text-sm">Message</Small>
								<Textarea
									id="contact-message"
									name="message"
									placeholder="Tell us what's on your mind..."
									disabled={contactPending || contactResult?.success}
									rows={6}
									required
								/>
							</VStack>

							{contactResult && !contactPending && (
								<HStack
									className={`items-center gap-2 rounded-lg p-3 text-sm ${
										contactResult.success
											? 'border border-green-500/20 bg-green-500/10 text-green-400'
											: 'border border-red-500/20 bg-red-500/10 text-red-400'
									}`}
								>
									{contactResult.success ? (
										<CheckCircle size={16} />
									) : (
										<AlertCircle size={16} />
									)}
									<Small>{contactResult.text}</Small>
								</HStack>
							)}

							<Button
								type="submit"
								disabled={contactPending || contactResult?.success}
								className="w-full"
							>
								{contactPending ? 'Sending...' : 'Send message'}
							</Button>
						</VStack>
					</ActionForm>
				</VStack>
			</VStack>
		</section>
	);
}
