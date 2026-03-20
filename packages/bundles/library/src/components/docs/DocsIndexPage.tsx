import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import {
	ArrowRight,
	Boxes,
	FileSearch,
	ShieldCheck,
	Waypoints,
} from 'lucide-react';
import { getDocsHomeSections, getSecondaryDocsPages } from './docsManifest';

const proofPoints = [
	{
		title: 'One system, many surfaces',
		body: 'Define explicit contracts once, then keep APIs, UI, data, events, and agent-facing surfaces aligned.',
		icon: Boxes,
	},
	{
		title: 'Incremental adoption',
		body: 'Start with one endpoint, one workflow, or one unsafe module. You do not need a rewrite to begin.',
		icon: Waypoints,
	},
	{
		title: 'Operator-grade controls',
		body: 'Carry policy, auditability, migrations, tracing, and integration boundaries forward with the same system model.',
		icon: ShieldCheck,
	},
];

export function DocsIndexPage() {
	const sections = getDocsHomeSections();
	const secondary = getSecondaryDocsPages().slice(0, 6);

	return (
		<div className="space-y-12">
			<section className="space-y-6">
				<p className="editorial-kicker">OSS documentation</p>
				<h1 className="editorial-title max-w-5xl">
					Build AI-native systems on explicit contracts, then add Studio when
					you want the operating layer.
				</h1>
				<p className="editorial-subtitle">
					These docs are optimized for OSS adopters first. Learn the contract
					model, generate and govern surfaces safely, wire integrations, and run
					the system in production without giving up ownership of your code.
				</p>
				<div className="flex flex-wrap gap-3">
					<Link
						href="/docs/getting-started/start-here"
						className="btn-primary text-sm"
					>
						Start with OSS <ArrowRight size={16} />
					</Link>
					<Link href="/docs/studio" className="btn-ghost text-sm">
						See what Studio adds
					</Link>
				</div>
			</section>

			<section className="grid gap-5 md:grid-cols-3">
				{proofPoints.map((item) => {
					const Icon = item.icon;
					return (
						<article key={item.title} className="editorial-panel space-y-3">
							<div className="flex items-center gap-3">
								<div className="rounded-full border border-border/80 bg-background/85 p-2">
									<Icon size={18} />
								</div>
								<h2 className="font-semibold text-xl">{item.title}</h2>
							</div>
							<p className="editorial-copy text-sm">{item.body}</p>
						</article>
					);
				})}
			</section>

			<section className="editorial-panel space-y-5">
				<div className="space-y-2">
					<p className="editorial-kicker">Quick start</p>
					<h2 className="editorial-panel-title">Start with one contract</h2>
					<p className="editorial-copy text-sm">
						Use the CLI and core libraries to define one explicit capability,
						generate the surface, and validate the contract boundary before you
						expand.
					</p>
				</div>
				<CodeBlock
					language="bash"
					filename="docs-quick-start"
					code={`bun add -D contractspec
bun add @contractspec/lib.contracts-spec @contractspec/lib.schema

contractspec init
contractspec create --type operation
contractspec build src/contracts/mySpec.ts
contractspec validate src/contracts/mySpec.ts`}
				/>
			</section>

			<section className="space-y-5">
				<div className="space-y-2">
					<p className="editorial-kicker">Primary path</p>
					<h2 className="editorial-panel-title">
						Move through the system in the right order
					</h2>
					<p className="editorial-copy text-sm">
						Start with onboarding, then learn the model, then build and operate
						with confidence. The primary docs path is intentionally shorter than
						the full route inventory.
					</p>
				</div>

				<div className="grid gap-5 lg:grid-cols-2">
					{sections.map((section) => (
						<article key={section.key} className="editorial-panel space-y-4">
							<div>
								<p className="editorial-kicker">{section.title}</p>
								<h3 className="mt-2 font-serif text-3xl tracking-[-0.03em]">
									{section.title}
								</h3>
								<p className="mt-3 text-muted-foreground text-sm leading-7">
									{section.description}
								</p>
							</div>
							<div className="space-y-3">
								{section.featured.map((page) => (
									<Link
										key={page.href}
										href={page.href}
										className="flex items-start justify-between gap-4 rounded-[22px] border border-border/70 bg-background/70 p-4 transition-colors hover:border-[color:rgb(162_79_42_/_0.45)]"
									>
										<div>
											<h4 className="font-semibold text-base">{page.title}</h4>
											<p className="mt-1 text-muted-foreground text-sm leading-6">
												{page.description}
											</p>
										</div>
										<ArrowRight className="mt-1 shrink-0" size={16} />
									</Link>
								))}
							</div>
						</article>
					))}
				</div>
			</section>

			<section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
				<article className="editorial-panel space-y-4">
					<div className="space-y-2">
						<p className="editorial-kicker">Reference and evidence</p>
						<h2 className="editorial-panel-title">
							Use generated docs and examples as proof, not just narrative copy
						</h2>
						<p className="editorial-copy text-sm">
							The reference index and example catalog stay close to the repo
							truth. Use them when you need exact public surfaces, not just the
							explanatory layer.
						</p>
					</div>
					<div className="grid gap-4 md:grid-cols-2">
						<Link href="/docs/reference" className="docs-footer-link">
							<div className="flex items-center gap-2 text-muted-foreground text-sm">
								<FileSearch size={16} />
								<span>Reference index</span>
							</div>
							<p className="text-muted-foreground text-sm">
								Search generated contract docs, versions, tags, and visibility
								metadata.
							</p>
						</Link>
						<Link href="/docs/examples" className="docs-footer-link">
							<div className="flex items-center gap-2 text-muted-foreground text-sm">
								<Boxes size={16} />
								<span>Examples</span>
							</div>
							<p className="text-muted-foreground text-sm">
								Browse runnable examples and follow the reference routes back to
								their source artifacts.
							</p>
						</Link>
					</div>
				</article>

				<article className="editorial-panel space-y-4">
					<div className="space-y-2">
						<p className="editorial-kicker">Secondary reading</p>
						<h2 className="editorial-panel-title">Why ContractSpec</h2>
						<p className="editorial-copy text-sm">
							Positioning, comparisons, and philosophy remain available, but
							they no longer define the main docs path.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						{secondary.map((page) => (
							<Link key={page.href} href={page.href} className="docs-chip-link">
								{page.title}
							</Link>
						))}
					</div>
				</article>
			</section>
		</div>
	);
}
