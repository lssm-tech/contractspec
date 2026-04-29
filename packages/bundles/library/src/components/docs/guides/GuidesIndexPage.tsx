import { CodeBlock } from '@contractspec/lib.design-system';
import { HStack, VStack } from '@contractspec/lib.design-system/layout';
import { List, ListItem } from '@contractspec/lib.design-system/list';
import { H1, H2, P, Text } from '@contractspec/lib.design-system/typography';
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
		title: 'Flexible import templates',
		description:
			'Accept partner CSV, JSON, and XML files with alternate headers and localized values while preserving a canonical import contract.',
		href: '/docs/guides/data-exchange-import-templates',
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
		<VStack className="space-y-10">
			<VStack className="space-y-3">
				<Text className="editorial-kicker">Build</Text>
				<H1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					Adoption guides for teams that want to keep their code.
				</H1>
				<P className="max-w-3xl text-lg text-muted-foreground leading-8">
					These guides assume you are introducing ContractSpec into a real code
					base. Start with a narrow surface, verify the generated outputs, and
					expand only after the contract loop feels trustworthy.
				</P>
			</VStack>

			<VStack className="grid gap-4 md:grid-cols-2">
				{guides.map((guide) => (
					<Link key={guide.href} href={guide.href} className="editorial-panel">
						<HStack className="flex items-start justify-between gap-4">
							<VStack>
								<H2 className="font-semibold text-xl">{guide.title}</H2>
								<P className="mt-2 text-muted-foreground text-sm leading-7">
									{guide.description}
								</P>
							</VStack>
							<ArrowRight className="mt-1 shrink-0" size={18} />
						</HStack>
						<HStack className="mt-4 flex items-center gap-2 text-muted-foreground text-xs">
							<CheckCircle2 size={14} />
							<Text>Target time: {guide.time}</Text>
						</HStack>
					</Link>
				))}
			</VStack>

			<VStack className="editorial-panel space-y-4">
				<HStack className="flex items-center gap-2 font-semibold text-[color:var(--rust)] text-sm uppercase tracking-[0.2em]">
					<GitBranch size={16} />
					<Text>Working style</Text>
				</HStack>
				<List className="editorial-list">
					<ListItem>
						<Text>Run each guide in a branch or sandboxed workspace.</Text>
					</ListItem>
					<ListItem>
						<Text>
							Prefer one bounded surface at a time: one endpoint, one workflow,
							one integration, one unsafe module.
						</Text>
					</ListItem>
					<ListItem>
						<Text>
							Use the example and reference outputs to verify what changed, not
							just the narrative page.
						</Text>
					</ListItem>
				</List>
				<CodeBlock
					language="bash"
					filename="guides-quickstart"
					code={`# list example systems
contractspec examples list

# validate the examples in this workspace
contractspec examples validate --repo-root .`}
				/>
			</VStack>
		</VStack>
	);
}
