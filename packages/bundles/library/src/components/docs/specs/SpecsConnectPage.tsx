import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';

const artifacts = [
	{
		title: 'ContextPack',
		body: 'Projects the current repo state, impacted contracts, canon packs, policy bindings, and acceptance checks into one task-scoped envelope.',
	},
	{
		title: 'PlanPacket',
		body: 'Compiles a candidate objective into ACP-aware steps plus explicit refs back to control-plane intent, plan compile, and plan verify contracts.',
	},
	{
		title: 'PatchVerdict',
		body: 'Classifies one file edit or shell command as permit, rewrite, require_review, or deny, with runtime-linked control-plane state when available.',
	},
	{
		title: 'ReviewPacket',
		body: 'Persists the evidence a human needs when Connect escalates, while keeping the local artifact trail authoritative in OSS mode.',
	},
];

const adoptionSteps = [
	'Enable `connect` in `.contractsrc.json` and keep your protected, immutable, generated, and smoke-check policies explicit.',
	'Run `contractspec connect context` and `contractspec connect plan` before risky work so the agent is operating on task-scoped evidence, not ambient repo assumptions.',
	'Gate file and shell mutations through `contractspec connect verify` or the host hook commands instead of inventing editor-specific approval logic.',
	'Inspect pending review packets locally first, then sync them to the Studio bridge only if your team wants centralized operator workflows.',
	'Use replay and harness evaluation to prove whether a prior decision stayed safe when the workspace changed.',
];

const guardrails = [
	'Connect is not a second control plane or a second package family.',
	'Verdicts are projections over existing `controlPlane.*`, ACP, workspace, and harness primitives.',
	'Studio is optional for baseline enforcement. Local artifacts remain the OSS source of truth.',
	'Destructive commands, protected paths, drift, and unknown impact stay visible instead of being hidden behind adapter magic.',
];

export function SpecsConnectPage() {
	return (
		<div className="space-y-10">
			<section className="space-y-3">
				<p className="editorial-kicker">Spec pack</p>
				<h1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					ContractSpec Connect puts coding-agent actions behind explicit,
					local-first governance.
				</h1>
				<p className="max-w-3xl text-lg text-muted-foreground leading-8">
					Connect is the adapter layer between agent-native actions and the
					existing ContractSpec stack. It reuses control-plane, ACP, workspace,
					knowledge, and harness primitives to explain what the agent is trying
					to do before a file edit or shell command lands.
				</p>
			</section>

			<section className="editorial-proof-strip">
				<div className="editorial-stat">
					<span className="editorial-label">Authoritative surfaces</span>
					<span className="editorial-stat-value">
						control plane, ACP, workspace, harness
					</span>
				</div>
				<p className="max-w-2xl text-muted-foreground text-sm leading-7">
					Connect stays narrow on purpose. It projects local evidence, maps its
					verdicts back to runtime semantics, and leaves the canonical system
					contracts where they already live.
				</p>
			</section>

			<section className="editorial-panel space-y-5">
				<div className="space-y-2">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						What you use in practice
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						The CLI and the workspace service already implement the pack. The
						main workflow is local initialization, task projection,
						verification, then optional review sync.
					</p>
				</div>
				<CodeBlock
					language="bash"
					filename="contractspec-connect"
					code={`contractspec connect init --scope workspace
contractspec connect context --task refactor-docs --paths packages/libs/contracts-spec/src/control-plane/contracts.ts --json
printf '{"objective":"Document the control-plane contract surface","commands":["bun run typecheck"]}' | contractspec connect plan --task refactor-docs --stdin --json
printf '{"operation":"edit","path":"packages/libs/contracts-spec/src/control-plane/contracts.ts"}' | contractspec connect verify --task refactor-docs --tool acp.fs.access --stdin --json
printf 'bun run typecheck' | contractspec connect verify --task refactor-docs --tool acp.terminal.exec --stdin --json
contractspec connect review list --json
contractspec connect replay <decisionId> --json`}
				/>
			</section>

			<section className="space-y-5">
				<div className="space-y-2">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						The four core artifacts
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						Every Connect command is there to emit or inspect one of these
						reviewable objects under `.contractspec/connect/*`.
					</p>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					{artifacts.map((item) => (
						<article key={item.title} className="editorial-panel space-y-3">
							<h3 className="font-semibold text-xl">{item.title}</h3>
							<p className="text-muted-foreground text-sm leading-7">
								{item.body}
							</p>
						</article>
					))}
				</div>
			</section>

			<section className="grid gap-5 lg:grid-cols-2">
				<article className="editorial-panel space-y-4">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Adopt Connect in this order
					</h2>
					<ol className="list-inside list-decimal space-y-3 text-muted-foreground text-sm leading-7">
						{adoptionSteps.map((step) => (
							<li key={step}>{step}</li>
						))}
					</ol>
				</article>

				<article className="editorial-panel space-y-4">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Boundaries that keep it trustworthy
					</h2>
					<ul className="editorial-list">
						{guardrails.map((item) => (
							<li key={item}>
								<span className="editorial-list-marker" />
								<span>{item}</span>
							</li>
						))}
					</ul>
				</article>
			</section>

			<section className="editorial-panel space-y-4">
				<h2 className="font-serif text-3xl tracking-[-0.03em]">
					Where Connect fits in the rest of the docs
				</h2>
				<p className="text-muted-foreground text-sm leading-7">
					Read the control-plane runtime page when you want the underlying
					governance contracts, then use the Studio bridge only if your team
					wants centralized review queues on top of the OSS-local evidence path.
				</p>
				<div className="flex flex-wrap gap-3">
					<Link href="/docs/architecture/control-plane" className="btn-primary">
						Control-plane runtime
					</Link>
					<Link href="/docs/studio" className="btn-ghost">
						Studio bridge
					</Link>
				</div>
			</section>
		</div>
	);
}
