import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';

const runtimeModes = [
	{
		title: 'Managed',
		body: 'Best when the team wants the platform to own setup, routing, readiness, and mobile-safe defaults.',
	},
	{
		title: 'Local',
		body: 'Best for power users who want tenant-local execution providers and tighter data-locality control.',
	},
	{
		title: 'Hybrid',
		body: 'Best when some work should stay local while preview, review, or export flows still use managed coordination.',
	},
];

const builderLoop = [
	'Capture prompts, files, voice, and other inbound sources into a typed workspace instead of relying on a single chat transcript.',
	'Fuse the sources into decisions, assumptions, and blueprint updates with provenance and approval memory.',
	'Compile authoring work into execution lanes, then route the work to explicit provider profiles and runtime targets.',
	'Create previews, run readiness gates, and record receipts before export becomes an operator action.',
	'Keep mobile review parity so approvals, incidents, and patch proposals can be inspected away from the desktop workbench.',
];

export function SpecsBuilderControlPlanePage() {
	return (
		<div className="space-y-10">
			<section className="space-y-3">
				<p className="editorial-kicker">Spec pack</p>
				<h1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					Builder is a governed authoring control plane, not a frontier coding
					agent.
				</h1>
				<p className="max-w-3xl text-lg text-muted-foreground leading-8">
					The implemented Builder stack sits across{' '}
					<code>@contractspec/lib.builder-spec</code>,{' '}
					<code>@contractspec/lib.builder-runtime</code>,{' '}
					<code>@contractspec/lib.provider-spec</code>, and the reusable
					workbench/mobile modules. It orchestrates inputs, provider routing,
					readiness, and export decisions on top of the OSS ContractSpec
					foundation and the Studio operating layer.
				</p>
			</section>

			<section className="editorial-proof-strip">
				<div className="editorial-stat">
					<span className="editorial-label">What Builder owns</span>
					<span className="editorial-stat-value">
						fusion, routing, readiness, export
					</span>
				</div>
				<p className="max-w-2xl text-muted-foreground text-sm leading-7">
					Builder delegates synthesis and coding to external execution
					providers. Its job is to keep those runs policy-aware,
					provenance-rich, and usable from both desktop and mobile operator
					surfaces.
				</p>
			</section>

			<section className="editorial-panel space-y-5">
				<div className="space-y-2">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Implemented stack and entrypoints
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						You can use the type surfaces directly in code, or start from the
						already wired workbench and mobile review routes in the public app
						shell.
					</p>
				</div>
				<CodeBlock
					language="text"
					filename="builder-stack"
					code={`Packages
- @contractspec/lib.builder-spec
- @contractspec/lib.builder-runtime
- @contractspec/lib.provider-spec
- @contractspec/module.builder-workbench
- @contractspec/module.mobile-review

Web app routes
- /operate/builder/workspaces/:workspaceId
- /operate/builder/workspaces/:workspaceId/mobile-review/:cardId

Operate API proxy
- /api/operate/builder/queries/builder.workspace.snapshot
- /api/operate/builder/commands/builder.blueprint.patch
- /api/operate/builder/commands/builder.export.execute`}
				/>
			</section>

			<section className="grid gap-4 md:grid-cols-3">
				{runtimeModes.map((item) => (
					<article key={item.title} className="editorial-panel space-y-3">
						<h2 className="font-semibold text-xl">{item.title}</h2>
						<p className="text-muted-foreground text-sm leading-7">
							{item.body}
						</p>
					</article>
				))}
			</section>

			<section className="grid gap-5 lg:grid-cols-2">
				<article className="editorial-panel space-y-4">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Typical Builder loop
					</h2>
					<ol className="list-inside list-decimal space-y-3 text-muted-foreground text-sm leading-7">
						{builderLoop.map((step) => (
							<li key={step}>{step}</li>
						))}
					</ol>
				</article>

				<article className="editorial-panel space-y-4">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						What Builder should not become
					</h2>
					<ul className="editorial-list">
						<li>
							<span className="editorial-list-marker" />
							<span>
								Not a competitor to specialized coding agents such as Codex or
								Claude Code.
							</span>
						</li>
						<li>
							<span className="editorial-list-marker" />
							<span>
								Not a managed-only product that traps teams away from OSS-local
								runtime paths.
							</span>
						</li>
						<li>
							<span className="editorial-list-marker" />
							<span>
								Not a hidden routing layer that obscures provider provenance,
								receipts, or runtime mode.
							</span>
						</li>
						<li>
							<span className="editorial-list-marker" />
							<span>
								Not a desktop-only surface. Mobile review parity is part of the
								control-plane contract.
							</span>
						</li>
					</ul>
				</article>
			</section>

			<section className="editorial-panel space-y-5">
				<div className="space-y-2">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Use the workbench UI as the host surface
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						The reusable module already exposes the desktop workbench shell.
						Your host app keeps control of action wiring, runtime mode
						selection, and approval flows.
					</p>
				</div>
				<CodeBlock
					language="tsx"
					filename="BuilderWorkbenchHost.tsx"
					code={`import { BuilderWorkbench, useBuilderWorkbenchState } from "@contractspec/module.builder-workbench";

const state = useBuilderWorkbenchState({
  workspace: initialSnapshot.workspace,
  initialSnapshot,
});

<BuilderWorkbench
  snapshot={state.snapshot}
  promptDraft={state.promptDraft}
  onPromptDraftChange={state.setPromptDraft}
  onCapturePrompt={capturePrompt}
  onGenerateBlueprint={generateBlueprint}
  onCompilePlan={compilePlan}
  onCreatePreview={createPreview}
  onRunReadiness={runReadiness}
  onExecuteExport={executeExport}
  selectedExportRuntimeMode="hybrid"
/>;`}
				/>
			</section>

			<section className="editorial-panel space-y-4">
				<h2 className="font-serif text-3xl tracking-[-0.03em]">
					Read this with the Studio bridge in mind
				</h2>
				<p className="text-muted-foreground text-sm leading-7">
					Builder is where the OSS foundation meets the richer operating layer.
					Use the Studio overview when you want the higher-level product posture
					and team workflows on top of these contracts.
				</p>
				<div className="flex flex-wrap gap-3">
					<Link href="/docs/studio" className="btn-primary">
						Studio overview
					</Link>
					<Link href="/docs/architecture/control-plane" className="btn-ghost">
						Control-plane runtime
					</Link>
				</div>
			</section>
		</div>
	);
}
