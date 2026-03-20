'use client';

import {
	ActionForm,
	Button,
	Input,
	Textarea,
} from '@contractspec/lib.design-system';
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	MessageSquare,
} from 'lucide-react';
import { useActionState } from 'react';
import { submitContactForm } from '../../libs/email/contact';
import type { SubmitContactFormResult } from '../../libs/email/types';
import { StudioSignupSection } from './studio-signup-section';

export function ContactClient() {
	const handleContactSubmit = async (
		_prevState: SubmitContactFormResult | null,
		formData: FormData
	): Promise<SubmitContactFormResult> => {
		const result = await submitContactForm(formData);

		if (result.success) {
			return {
				success: true,
				text: "Message sent successfully. We'll get back to you soon.",
			};
		}

		return {
			success: false,
			text: result.text || 'Failed to send message. Please try again.',
		};
	};

	const [contactResult, contactAction, contactPending] = useActionState<
		SubmitContactFormResult | null,
		FormData
	>(handleContactSubmit, null);

	return (
		<main>
			<section className="section-padding hero-gradient border-border/70 border-b">
				<div className="editorial-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
					<div className="space-y-5">
						<p className="editorial-kicker">Contact</p>
						<h1 className="editorial-title max-w-4xl">
							Talk to the team behind the open system and the Studio product.
						</h1>
						<p className="editorial-subtitle">
							Reach out when you are evaluating the OSS foundation, deciding
							whether Studio fits your workflow, or want a direct conversation
							about adoption.
						</p>
					</div>
					<StudioSignupSection variant="compact" />
				</div>
			</section>

			<section className="editorial-section">
				<div className="editorial-shell grid gap-8 lg:grid-cols-2">
					<div className="editorial-panel space-y-6" id="call">
						<div className="space-y-3">
							<div className="badge">
								<Calendar size={14} />
								Book a conversation
							</div>
							<h2 className="font-serif text-4xl tracking-[-0.04em]">
								Walk through your current system with us.
							</h2>
							<p className="text-muted-foreground text-sm leading-7">
								Use the call when you want a direct conversation about fit,
								adoption order, or the right entry point between OSS and Studio.
							</p>
						</div>
						<div className="overflow-hidden rounded-[28px] border border-border">
							<object
								data="https://meet.reclaimai.com/e/f863cb29-caac-44b6-972b-1407dd9545a3"
								width="100%"
								height="700px"
								style={{ outline: 'none' }}
								aria-label="Calendar booking widget"
							/>
						</div>
					</div>

					<div className="editorial-panel space-y-6" id="message">
						<div className="space-y-3">
							<div className="badge">
								<MessageSquare size={14} />
								Send a message
							</div>
							<h2 className="font-serif text-4xl tracking-[-0.04em]">
								Share context, questions, or a project we should understand.
							</h2>
						</div>

						<ActionForm action={contactAction}>
							<div className="space-y-4">
								<div className="space-y-2">
									<label htmlFor="contact-name" className="font-medium text-sm">
										Name
									</label>
									<Input
										id="contact-name"
										name="name"
										type="text"
										placeholder="Your name"
										disabled={contactPending || contactResult?.success}
										required
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="contact-email"
										className="font-medium text-sm"
									>
										Email
									</label>
									<Input
										id="contact-email"
										name="email"
										type="email"
										keyboard={{ kind: 'email' }}
										placeholder="you@company.com"
										disabled={contactPending || contactResult?.success}
										required
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="contact-message"
										className="font-medium text-sm"
									>
										Message
									</label>
									<Textarea
										id="contact-message"
										name="message"
										placeholder="What are you trying to stabilize, and where is the current system breaking down?"
										disabled={contactPending || contactResult?.success}
										rows={7}
										required
									/>
								</div>

								{contactResult && !contactPending ? (
									<div
										className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${
											contactResult.success
												? 'border-green-600/20 bg-green-600/10 text-green-700'
												: 'border-red-600/20 bg-red-600/10 text-red-700'
										}`}
									>
										{contactResult.success ? (
											<CheckCircle size={16} />
										) : (
											<AlertCircle size={16} />
										)}
										<span>{contactResult.text}</span>
									</div>
								) : null}

								<Button
									type="submit"
									disabled={contactPending || contactResult?.success}
									className="w-full"
								>
									{contactPending ? 'Sending...' : 'Send message'}
								</Button>
							</div>
						</ActionForm>
					</div>
				</div>
			</section>
		</main>
	);
}
