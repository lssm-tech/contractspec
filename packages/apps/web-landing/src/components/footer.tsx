import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';
import NewsletterSignup from './newsletter-signup';

function FooterColumn({
	title,
	links,
}: {
	title: string;
	links: Array<{ href: string; label: string; external?: boolean }>;
}) {
	return (
		<div className="space-y-4">
			<h3 className="font-medium text-sm uppercase tracking-[0.08em]">
				{title}
			</h3>
			<ul className="space-y-3 text-muted-foreground text-sm">
				{links.map((link) => (
					<li key={link.href}>
						<Link
							href={link.href}
							className="hover:text-foreground"
							target={link.external ? '_blank' : undefined}
							rel={link.external ? 'noopener noreferrer' : undefined}
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default function Footer() {
	return (
		<footer className="border-border/80 border-t bg-[rgb(251_247_240_/_0.82)]">
			<div className="editorial-shell px-4 py-14 md:px-6 lg:px-8 lg:py-16">
				<div className="editorial-proof-strip mb-10 rounded-[36px]">
					<div className="max-w-2xl space-y-3">
						<p className="editorial-kicker">Stay close to the roadmap</p>
						<h2 className="font-serif text-3xl tracking-[-0.04em]">
							Follow how the open system evolves into the operating product.
						</h2>
						<p className="editorial-copy text-sm">
							Release notes, template drops, Studio updates, and the product
							thinking behind them.
						</p>
					</div>
					<div className="w-full max-w-md">
						<NewsletterSignup />
					</div>
				</div>

				<div className="grid gap-10 border-border/80 border-t pt-10 md:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
					<div className="space-y-5">
						<p className="editorial-kicker">ContractSpec</p>
						<h3 className="font-serif text-3xl tracking-[-0.04em]">
							The open spec system for AI-native software.
						</h3>
						<p className="editorial-copy max-w-md text-sm">
							Start with the OSS foundation when you want explicit contracts,
							safe regeneration, and multi-surface consistency. Move into Studio
							when you want the operating layer on top.
						</p>
						<div className="flex items-center gap-4 text-muted-foreground">
							<Link
								href="https://github.com/lssm-tech/contractspec"
								className="hover:text-foreground"
							>
								<Github size={18} />
							</Link>
							<Link
								href="https://linkedin.com/company/contractspec"
								className="hover:text-foreground"
							>
								<Linkedin size={18} />
							</Link>
							<Link
								href="mailto:contact@contractspec.io"
								className="hover:text-foreground"
							>
								<Mail size={18} />
							</Link>
						</div>
					</div>

					<FooterColumn
						title="Open system"
						links={[
							{ href: '/product', label: 'How it works' },
							{ href: '/templates', label: 'Templates' },
							{ href: '/docs', label: 'Documentation' },
							{
								href: 'https://github.com/lssm-tech/contractspec',
								label: 'GitHub',
								external: true,
							},
						]}
					/>
					<FooterColumn
						title="Studio"
						links={[
							{
								href: 'https://www.contractspec.studio',
								label: 'Open Studio',
								external: true,
							},
							{ href: '/pricing', label: 'Packaging' },
							{ href: '/design-partner', label: 'Design partner' },
							{ href: '/contact', label: 'Talk to us' },
						]}
					/>
					<FooterColumn
						title="Company"
						links={[
							{ href: '/changelog', label: 'Changelog' },
							{ href: '/contribute', label: 'Contribute' },
							{ href: '/legal/privacy', label: 'Privacy' },
							{ href: '/legal/terms', label: 'Terms' },
						]}
					/>
				</div>

				<div className="mt-10 flex flex-col gap-3 border-border/80 border-t pt-6 text-muted-foreground text-sm md:flex-row md:items-center md:justify-between">
					<p>Built with ContractSpec © {new Date().getFullYear()}</p>
					<div className="flex gap-5">
						<Link href="/llms.txt" className="hover:text-foreground">
							LLM guide
						</Link>
						<Link href="/install" className="hover:text-foreground">
							Start with OSS
						</Link>
						<Link
							href="https://www.contractspec.studio"
							className="hover:text-foreground"
						>
							Explore Studio
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
