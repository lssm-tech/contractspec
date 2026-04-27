import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ArrowRight, CheckCircle2, GitBranch } from 'lucide-react';

const guides = [
	{
		title: 'Adopt one endpoint in Next.js',
		description:
			'Start inside a live app with one operation, one generated surface, and one clearly bounded change.',
		href: '/docs/guides/nextjs-one-endpoint',
		time: '25 min',
	},
	{
		title: 'Import an existing codebase',
		description:
			'Stabilize what already exists instead of treating adoption as a rewrite project.',
		href: '/docs/guides/import-existing-codebases',
		time: '20 min',
	},
	{
		title: 'Validation and typing',
		description:
			'Keep runtime validation and TypeScript behavior aligned from the same source definitions.',
		href: '/docs/guides/spec-validation-and-typing',
		time: '20 min',
	},
	{
		title: 'Build a contract-driven form',
		description:
			'Use FormSpec to keep data shape, fields, layout, policy, and submit behavior aligned.',
		href: '/docs/guides/contract-driven-forms',
		time: '25 min',
	},
	{
		title: 'Generate docs and clients',
		description:
			'Publish stable docs, schemas, and client-facing artifacts from the contract layer.',
		href: '/docs/guides/generate-docs-clients-schemas',
		time: '20 min',
	},
	{
		title: 'Docs pipeline',
		description:
			'Feed generated reference material into the docs site without confusing ownership.',
		href: '/docs/guides/docs-generation-pipeline',
		time: '20 min',
	},
	{
		title: 'Build a first module bundle',
		description:
			'Define one bundle spec, resolve a surface plan, and render it through the React host layer.',
		href: '/docs/guides/first-module-bundle',
		time: '20 min',
	},
	{
		title: 'Host the Builder workbench',
		description:
			'Wire a Builder workspace snapshot, common commands, runtime modes, and mobile review links into the reusable host.',
		href: '/docs/guides/host-builder-workbench',
		time: '20 min',
	},
	{
		title: 'Use Connect in a repo',
		description:
			'Enable Connect, verify agent actions locally, and inspect the resulting review and replay artifacts.',
		href: '/docs/guides/connect-in-a-repo',
		time: '15 min',
	},
	{
		title: 'Author release capsules',
		description:
			'Pair changesets with structured release capsules and generate the artifacts that changelog and upgrade flows consume.',
		href: '/docs/guides/release-capsules',
		time: '15 min',
	},
	{
		title: 'CI diff gating',
		description:
			'Use deterministic checks to catch drift and risky changes before they ship.',
		href: '/docs/guides/ci-contract-diff-gating',
		time: '15 min',
	},
];

export function GuidesIndexPage() {
	return (
		<div className="space-y-10">
			<div className="space-y-3">
				<p className="editorial-kicker">Build</p>
				<h1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					Adoption guides for teams that want to keep their code.
				</h1>
				<p className="max-w-3xl text-lg text-muted-foreground leading-8">
					These guides assume you are introducing ContractSpec into a real code
					base. Start with a narrow surface, verify the generated outputs, and
					expand only after the contract loop feels trustworthy.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{guides.map((guide) => (
					<Link key={guide.href} href={guide.href} className="editorial-panel">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h2 className="font-semibold text-xl">{guide.title}</h2>
								<p className="mt-2 text-muted-foreground text-sm leading-7">
									{guide.description}
								</p>
							</div>
							<ArrowRight className="mt-1 shrink-0" size={18} />
						</div>
						<div className="mt-4 flex items-center gap-2 text-muted-foreground text-xs">
							<CheckCircle2 size={14} />
							<span>Target time: {guide.time}</span>
						</div>
					</Link>
				))}
			</div>

			<div className="editorial-panel space-y-4">
				<div className="flex items-center gap-2 font-semibold text-[color:var(--rust)] text-sm uppercase tracking-[0.2em]">
					<GitBranch size={16} />
					Working style
				</div>
				<ul className="editorial-list">
					<li>
						<span className="editorial-list-marker" />
						<span>Run each guide in a branch or sandboxed workspace.</span>
					</li>
					<li>
						<span className="editorial-list-marker" />
						<span>
							Prefer one bounded surface at a time: one endpoint, one workflow,
							one integration, one unsafe module.
						</span>
					</li>
					<li>
						<span className="editorial-list-marker" />
						<span>
							Use the example and reference outputs to verify what changed, not
							just the narrative page.
						</span>
					</li>
				</ul>
				<CodeBlock
					language="bash"
					filename="guides-quickstart"
					code={`# list example systems
contractspec examples list

# validate the examples in this workspace
contractspec examples validate --repo-root .`}
				/>
			</div>
		</div>
	);
}
