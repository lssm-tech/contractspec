import type { ExampleSpec } from '@contractspec/lib.contracts-spec/examples/types';
import type {
	TemplateDefinition,
	TemplateId,
} from '@contractspec/lib.example-shared-ui';
import { buildExampleDocsHref } from '@contractspec/module.examples/catalog';
import Link from 'next/link';

const RICH_SANDBOX_TEMPLATE_IDS = new Set<string>([
	'todos-app',
	'messaging-app',
	'recipe-app-i18n',
	'saas-boilerplate',
	'crm-pipeline',
	'data-grid-showcase',
	'visualization-showcase',
	'agent-console',
	'workflow-system',
	'marketplace',
	'integration-hub',
	'analytics-dashboard',
	'ai-chat-assistant',
	'policy-safe-knowledge-assistant',
]);

export function hasRichSandboxPreview(templateId: string): boolean {
	return RICH_SANDBOX_TEMPLATE_IDS.has(templateId);
}

export interface SandboxFallbackPreviewProps {
	templateId: TemplateId;
	example?: ExampleSpec;
	template?: TemplateDefinition;
}

export function SandboxFallbackPreview({
	templateId,
	example,
	template,
}: SandboxFallbackPreviewProps) {
	const title = example?.meta.title ?? template?.name ?? templateId;
	const description =
		example?.meta.summary ??
		example?.meta.description ??
		template?.description ??
		'ContractSpec example package available from the public catalog.';
	const tags = example?.meta.tags ?? template?.tags ?? [];
	const packageName = example?.entrypoints.packageName ?? template?.package;
	const docsHref = example ? buildExampleDocsHref(example.meta.key) : null;
	const llmsHref = packageName
		? `/llms/${packageName.replace('@contractspec/', '')}`
		: null;
	const repoHref = packageName?.startsWith('@contractspec/example.')
		? `https://github.com/lssm-tech/contractspec/tree/main/packages/examples/${packageName.replace(
				'@contractspec/example.',
				''
			)}`
		: null;

	return (
		<section className="space-y-6">
			<div className="space-y-3">
				<p className="editorial-kicker">Template package</p>
				<h2 className="font-serif text-3xl tracking-[-0.03em]">{title}</h2>
				<p className="max-w-3xl text-muted-foreground text-sm leading-7">
					{description}
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-3">
				<div className="space-y-1">
					<p className="font-medium text-sm">Package</p>
					<p className="break-words font-mono text-muted-foreground text-xs">
						{packageName ?? templateId}
					</p>
				</div>
				<div className="space-y-1">
					<p className="font-medium text-sm">Visibility</p>
					<p className="text-muted-foreground text-sm">
						{example?.meta.visibility ?? 'local'}
					</p>
				</div>
				<div className="space-y-1">
					<p className="font-medium text-sm">Stability</p>
					<p className="text-muted-foreground text-sm">
						{example?.meta.stability ?? 'template'}
					</p>
				</div>
			</div>

			{tags.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{tags.map((tag) => (
						<span
							key={tag}
							className="rounded-full border border-border bg-muted px-3 py-1 text-muted-foreground text-xs"
						>
							{tag}
						</span>
					))}
				</div>
			) : null}

			<div className="flex flex-wrap gap-3">
				{docsHref ? (
					<Link className="btn-primary" href={docsHref}>
						Open docs
					</Link>
				) : null}
				{llmsHref ? (
					<Link className="btn-ghost" href={llmsHref}>
						LLMS page
					</Link>
				) : null}
				{repoHref ? (
					<Link className="btn-ghost" href={repoHref}>
						Source
					</Link>
				) : null}
			</div>
		</section>
	);
}
