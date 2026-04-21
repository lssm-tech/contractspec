import { ButtonLink, CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { getExample } from '@contractspec/module.examples/catalog';
import { FileCode2, Play, TerminalSquare } from 'lucide-react';
import { getExampleShowcaseData } from './exampleShowcaseData';

interface ExampleShowcasePageProps {
	exampleKey: string;
}

export function ExampleShowcasePage({ exampleKey }: ExampleShowcasePageProps) {
	const showcase = getExampleShowcaseData(exampleKey);
	const example = getExample(exampleKey);

	if (!showcase || !example) {
		return null;
	}

	const title = example.meta.title ?? example.meta.key;
	const summary = example.meta.summary ?? example.meta.description ?? '';
	const packageName = example.entrypoints.packageName;

	return (
		<div className="space-y-10">
			<section className="space-y-5">
				<p className="editorial-kicker">Meetup-ready example</p>
				<h1 className="editorial-title max-w-5xl">{title}</h1>
				<p className="editorial-subtitle">{showcase.lead}</p>
				<p className="editorial-copy max-w-4xl">{summary}</p>
				<div className="flex flex-wrap gap-3">
					{showcase.sandboxHref ? (
						<ButtonLink href={showcase.sandboxHref}>Open sandbox</ButtonLink>
					) : null}
					<ButtonLink href={showcase.referenceHref} variant="outline">
						Generated reference
					</ButtonLink>
				</div>
			</section>

			<section className="grid gap-5 lg:grid-cols-3">
				{showcase.sandboxHref ? (
					<article className="editorial-panel space-y-4">
						<div className="flex items-center gap-3">
							<div className="rounded-full border border-border/80 bg-background/85 p-2">
								<Play size={18} />
							</div>
							<h2 className="font-semibold text-xl">Sandbox preview</h2>
						</div>
						<p className="editorial-copy text-sm">
							Load the same public browser surface used for the prepared live
							demo.
						</p>
						<ButtonLink href={showcase.sandboxHref} size="sm">
							Open preview
						</ButtonLink>
					</article>
				) : null}

				<article className="editorial-panel space-y-4">
					<div className="flex items-center gap-3">
						<div className="rounded-full border border-border/80 bg-background/85 p-2">
							<FileCode2 size={18} />
						</div>
						<h2 className="font-semibold text-xl">Reference docs</h2>
					</div>
					<p className="editorial-copy text-sm">
						Inspect the generated contract-facing material instead of relying on
						marketing summaries.
					</p>
					<ButtonLink href={showcase.referenceHref} size="sm" variant="outline">
						Open reference
					</ButtonLink>
				</article>

				<article className="editorial-panel space-y-4">
					<div className="flex items-center gap-3">
						<div className="rounded-full border border-border/80 bg-background/85 p-2">
							<TerminalSquare size={18} />
						</div>
						<h2 className="font-semibold text-xl">Package context</h2>
					</div>
					<p className="editorial-copy text-sm">
						Use the agent-facing package page for fast repo orientation, then
						jump to the source directory.
					</p>
					<p className="rounded-[18px] border border-border/70 bg-background/75 px-4 py-3 font-mono text-sm">
						{packageName}
					</p>
					<div className="flex flex-wrap gap-2">
						<ButtonLink href={showcase.llmsHref} size="sm" variant="outline">
							LLMS page
						</ButtonLink>
						<ButtonLink href={showcase.repoHref} size="sm" variant="outline">
							GitHub source
						</ButtonLink>
					</div>
				</article>
			</section>

			<section className="editorial-panel space-y-5">
				<div className="space-y-2">
					<p className="editorial-kicker">Talk commands</p>
					<h2 className="editorial-panel-title">
						Exact local commands for the meetup lane
					</h2>
					<p className="editorial-copy text-sm">
						Build the example package, then launch the web shell and open the
						prepared docs or sandbox route.
					</p>
				</div>
				<CodeBlock
					language="bash"
					filename={`${exampleKey}-meetup-runbook`}
					code={showcase.localCommands}
				/>
				<p className="text-muted-foreground text-sm">
					For the full fallback order and safe live-edit workflow, use{' '}
					<Link href="https://github.com/lssm-tech/contractspec/blob/main/docs/meetup-agent-examples-runbook.md">
						the meetup runbook
					</Link>
					.
				</p>
			</section>
		</div>
	);
}
