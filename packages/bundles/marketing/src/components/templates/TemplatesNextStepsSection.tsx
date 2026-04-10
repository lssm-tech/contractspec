import Link from 'next/link';

export function TemplatesNextStepsSection() {
	return (
		<section className="editorial-section bg-striped">
			<div className="editorial-shell space-y-8">
				<div className="max-w-3xl space-y-4">
					<p className="editorial-kicker">From template to real system</p>
					<h2 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
						Templates become useful when the system can absorb more context.
					</h2>
					<p className="editorial-copy">
						Use templates to prove the base flow, then layer integrations,
						knowledge, and runtime behavior on top without losing the same
						contract source.
					</p>
				</div>
				<div className="grid gap-6 md:grid-cols-3">
					<div className="editorial-panel space-y-4">
						<div className="text-3xl">💳</div>
						<h3 className="font-serif text-2xl tracking-[-0.03em]">
							Add payments
						</h3>
						<p className="text-muted-foreground text-sm">
							Connect Stripe to any template for payment processing,
							subscriptions, and invoicing. Type-safe and policy-enforced.
						</p>
						<Link
							href="/docs/integrations/stripe"
							className="font-medium text-[color:var(--blue)] text-sm hover:opacity-80"
						>
							Learn more →
						</Link>
					</div>
					<div className="editorial-panel space-y-4">
						<div className="text-3xl">📧</div>
						<h3 className="font-serif text-2xl tracking-[-0.03em]">
							Add notifications
						</h3>
						<p className="text-muted-foreground text-sm">
							Send transactional emails via Postmark or Resend. Process inbound
							emails with Gmail API. SMS via Twilio.
						</p>
						<Link
							href="/docs/integrations"
							className="font-medium text-[color:var(--blue)] text-sm hover:opacity-80"
						>
							View integrations →
						</Link>
					</div>
					<div className="editorial-panel space-y-4">
						<div className="text-3xl">🧠</div>
						<h3 className="font-serif text-2xl tracking-[-0.03em]">
							Add AI and knowledge
						</h3>
						<p className="text-muted-foreground text-sm">
							Power templates with OpenAI, vector search via Qdrant, and
							structured knowledge spaces for context-aware workflows.
						</p>
						<Link
							href="/docs/knowledge"
							className="font-medium text-[color:var(--blue)] text-sm hover:opacity-80"
						>
							Learn about knowledge →
						</Link>
					</div>
				</div>
				<div className="pt-4 text-center">
					<p className="mb-4 text-muted-foreground text-sm">
						All integrations are configured per-tenant with automatic health
						checks and credential rotation.
					</p>
					<Link href="/docs/architecture" className="btn-primary">
						View Architecture
					</Link>
				</div>
			</div>
		</section>
	);
}
