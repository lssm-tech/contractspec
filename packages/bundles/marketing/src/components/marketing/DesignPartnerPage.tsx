import { Button } from '@contractspec/lib.design-system';
import {
	ArrowRight,
	BookOpen,
	MessageSquare,
	Rocket,
	Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Design Partner Getting Started | ContractSpec',
	description: 'Onboarding and resources for ContractSpec Design Partners.',
};

export function DesignPartnerPage() {
	return (
		<main className="flex grow flex-col">
			{/* Hero Section */}
			<section className="section-padding relative overflow-hidden">
				<div className="container mx-auto max-w-5xl">
					<div className="mb-12 max-w-3xl">
						<h1 className="mb-6 font-bold text-4xl tracking-tight sm:text-5xl">
							Welcome, Design Partner
						</h1>
						<p className="text-muted-foreground text-xl leading-relaxed">
							We're thrilled to have you on board. As a Design Partner, you play
							a critical role in shaping the future of ContractSpec. This hub
							contains everything you need to get started, collaborate with us,
							and build your first specifications.
						</p>
					</div>
				</div>
			</section>

			{/* Steps Section */}
			<section className="section-padding bg-white/5">
				<div className="container mx-auto max-w-5xl">
					<h2 className="mb-12 font-bold text-3xl">Getting Started</h2>

					<div className="grid gap-12 md:grid-cols-2">
						{/* Step 1: Access */}
						<div className="space-y-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
								<Rocket className="h-6 w-6 text-primary" />
							</div>
							<h3 className="font-semibold text-xl">1. Access the Studio</h3>
							<p className="text-muted-foreground">
								Your account has been enabled with Design Partner privileges.
								Log in to ContractSpec Studio to run the full loop from evidence
								to spec-first deliverables with your team.
							</p>
							<div className="pt-2">
								<Button asChild variant="outline">
									<Link href="https://www.contractspec.studio">
										Launch Studio <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>
						</div>

						{/* Step 2: Communication */}
						<div className="space-y-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
								<MessageSquare className="h-6 w-6 text-primary" />
							</div>
							<h3 className="font-semibold text-xl">
								2. Join the Conversation
							</h3>
							<p className="text-muted-foreground">
								We've set up a dedicated private channel for real-time feedback
								and support. Connect with our engineering team and other
								partners.
							</p>
							<div className="pt-2">
								<Button asChild variant="outline">
									<Link href="mailto:partners@contractspec.io">
										Contact Partner Success{' '}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>
						</div>

						{/* Step 3: Documentation */}
						<div className="space-y-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
								<BookOpen className="h-6 w-6 text-primary" />
							</div>
							<h3 className="font-semibold text-xl">
								3. Explore Documentation
							</h3>
							<p className="text-muted-foreground">
								Dive deep into the core concepts, API references, and
								architecture guides. Our docs are evolving, and your feedback
								helps us improve them.
							</p>
							<div className="pt-2">
								<Button asChild variant="outline">
									<Link href="/docs">
										Read the Docs <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>
						</div>

						{/* Step 4: Sync */}
						<div className="space-y-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
								<Users className="h-6 w-6 text-primary" />
							</div>
							<h3 className="font-semibold text-xl">4. Partner Syncs</h3>
							<p className="text-muted-foreground">
								We schedule bi-weekly syncs to review your progress, blockers,
								and feature requests. Check your calendar invite for the next
								session.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Expectations / FAQ */}
			<section className="section-padding">
				<div className="container mx-auto max-w-3xl">
					<h2 className="mb-8 font-bold text-3xl">What to Expect</h2>

					<div className="space-y-8">
						<div>
							<h3 className="mb-2 font-semibold text-xl">
								Fast Iteration Cycles
							</h3>
							<p className="text-muted-foreground">
								We ship updates frequently. You might see UI changes or new
								capabilities appear weekly. We'll do our best to communicate
								breaking changes in advance.
							</p>
						</div>

						<div>
							<h3 className="mb-2 font-semibold text-xl">
								Direct Engineering Access
							</h3>
							<p className="text-muted-foreground">
								You're not talking to support agents; you're talking to the
								builders. Your feedback goes directly into the issue tracker.
							</p>
						</div>

						<div>
							<h3 className="mb-2 font-semibold text-xl">Input on Roadmap</h3>
							<p className="text-muted-foreground">
								Design Partners influence priority. If a feature enables a
								critical use case for you, let us know—we often reshuffle our
								sprint to accommodate partner needs.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Footer CTA */}
			<section className="section-padding border-white/10 border-t">
				<div className="container mx-auto max-w-3xl text-center">
					<h2 className="mb-4 font-bold text-3xl">
						Have a question right now?
					</h2>
					<p className="mb-8 text-muted-foreground">
						Don't hesitate to reach out. We are here to help you succeed.
					</p>
					<Button asChild size="lg">
						<Link href="mailto:partners@contractspec.io">
							Email the Founders
						</Link>
					</Button>
				</div>
			</section>
		</main>
	);
}
