import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';

const bundleCapabilities = [
	'declared routes, surfaces, layouts, slots, actions, and data recipes',
	'entity registries and field renderers for relation-heavy workbenches',
	'preference-aware adaptation across guidance, density, data depth, control, media, pace, and narrative',
	'auditable overlays and bounded AI patch proposals instead of free-form JSX generation',
];

const adoptionLoop = [
	'Define one `ModuleBundleSpec` with `defineModuleBundle` and keep the route and surface map explicit.',
	'Resolve the bundle with `resolveBundle` for a real user, route, device, and preference profile.',
	'Render the plan through `BundleProvider` and `BundleRenderer` so the UI stays downstream of the resolved spec.',
	'Add overlays, policy hooks, planner proposals, and telemetry only after the base route resolves cleanly.',
	'Pilot one dense domain first, such as a PM or operations workbench, before expanding the abstraction across the app.',
];

export function SpecsModuleBundlesPage() {
	return (
		<div className="space-y-10">
			<section className="space-y-3">
				<p className="editorial-kicker">Spec pack</p>
				<h1 className="font-serif text-4xl tracking-[-0.04em] md:text-5xl">
					Module bundles turn surface composition into a typed ContractSpec
					runtime instead of a pile of bespoke page code.
				</h1>
				<p className="max-w-3xl text-lg text-muted-foreground leading-8">
					The implemented package is{' '}
					<code>@contractspec/lib.surface-runtime</code>. It lets you define a
					bundle spec once, resolve it into a personalized surface plan, then
					render that plan through React without letting AI or per-route custom
					code bypass the declared system boundary.
				</p>
			</section>

			<section className="editorial-proof-strip">
				<div className="editorial-stat">
					<span className="editorial-label">Runtime promise</span>
					<span className="editorial-stat-value">
						bundle spec → resolved surface plan
					</span>
				</div>
				<p className="max-w-2xl text-muted-foreground text-sm leading-7">
					The bundle spec owns what can render, where it can render, which
					preferences matter, and how overlays and AI proposals stay bounded.
				</p>
			</section>

			<section className="grid gap-4 md:grid-cols-2">
				{bundleCapabilities.map((item) => (
					<article key={item} className="editorial-panel space-y-3">
						<h2 className="font-semibold text-xl">Bundle capability</h2>
						<p className="text-muted-foreground text-sm leading-7">{item}</p>
					</article>
				))}
			</section>

			<section className="editorial-panel space-y-5">
				<div className="space-y-2">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						1) Define the bundle
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						Start with a typed route and one surface. The runtime validates that
						you declared routes, surfaces, and verification coverage for all
						seven preference dimensions.
					</p>
				</div>
				<CodeBlock
					language="typescript"
					filename="support.workbench.bundle.ts"
					code={`import { defineModuleBundle } from "@contractspec/lib.surface-runtime/spec/define-module-bundle";

export const SupportWorkbenchBundle = defineModuleBundle({
  meta: {
    key: "support.workbench",
    version: "0.1.0",
    title: "Support Workbench",
  },
  routes: [
    {
      routeId: "support-ticket",
      path: "/operate/support/tickets/:ticketId",
      defaultSurface: "ticket-workbench",
    },
  ],
  surfaces: {
    "ticket-workbench": {
      surfaceId: "ticket-workbench",
      kind: "workbench",
      slots: [{ slotId: "primary", role: "primary", accepts: ["entity-section"], cardinality: "many" }],
      layouts: [{ layoutId: "balanced", title: "Balanced", root: { type: "slot", slotId: "primary" } }],
      data: [{ recipeId: "ticket-core", source: { kind: "entity", entityType: "support.ticket" }, hydrateInto: "ticket" }],
      verification: {
        dimensions: {
          guidance: "Surface can reveal walkthrough or inline help states.",
          density: "Layout supports compact and balanced detail modes.",
          dataDepth: "Resolver can hydrate summary or detailed ticket context.",
          control: "Advanced actions stay policy-gated.",
          media: "Surface supports text-first and hybrid assist modes.",
          pace: "Transitions and confirmations adapt to operator pace.",
          narrative: "Summary and evidence ordering stay explicit.",
        },
      },
    },
  },
});`}
				/>
			</section>

			<section className="editorial-panel space-y-5">
				<div className="space-y-2">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						2) Resolve and render the plan
					</h2>
					<p className="text-muted-foreground text-sm leading-7">
						The app renders the resolved plan, not the raw spec. That keeps
						layout choice, data hydration, overlays, and AI proposals auditable.
					</p>
				</div>
				<CodeBlock
					language="tsx"
					filename="SurfaceHost.tsx"
					code={`import { BundleProvider, BundleRenderer } from "@contractspec/lib.surface-runtime/react";
import { resolveBundle } from "@contractspec/lib.surface-runtime/runtime/resolve-bundle";

const plan = await resolveBundle(SupportWorkbenchBundle, {
  tenantId: "tenant_demo",
  workspaceId: "workspace_ops",
  actorId: "user_42",
  route: "/operate/support/tickets/123",
  params: { ticketId: "123" },
  query: {},
  device: "desktop",
  locale: "en",
  preferences: {
    guidance: "hints",
    density: "compact",
    dataDepth: "detailed",
    control: "advanced",
    media: "hybrid",
    pace: "balanced",
    narrative: "top-down",
  },
  capabilities: ["tickets.read", "tickets.update"],
});

export function SurfaceHost() {
  return (
    <BundleProvider plan={plan}>
      <BundleRenderer assistantSlotId="assistant" />
    </BundleProvider>
  );
}`}
				/>
			</section>

			<section className="grid gap-5 lg:grid-cols-2">
				<article className="editorial-panel space-y-4">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Adoption loop
					</h2>
					<ol className="list-inside list-decimal space-y-3 text-muted-foreground text-sm leading-7">
						{adoptionLoop.map((step) => (
							<li key={step}>{step}</li>
						))}
					</ol>
				</article>

				<article className="editorial-panel space-y-4">
					<h2 className="font-serif text-3xl tracking-[-0.03em]">
						Guardrails that matter
					</h2>
					<ul className="editorial-list">
						<li>
							<span className="editorial-list-marker" />
							<span>Do not stuff this behavior back into `lib.ui-kit`.</span>
						</li>
						<li>
							<span className="editorial-list-marker" />
							<span>
								Do not let AI invent undeclared components or mutate raw DOM
								state.
							</span>
						</li>
						<li>
							<span className="editorial-list-marker" />
							<span>
								Keep third-party UI libraries behind adapter subpaths only.
							</span>
						</li>
						<li>
							<span className="editorial-list-marker" />
							<span>
								Every surface still needs explicit verification coverage for the
								seven preference dimensions.
							</span>
						</li>
					</ul>
				</article>
			</section>

			<section className="editorial-panel space-y-4">
				<h2 className="font-serif text-3xl tracking-[-0.03em]">
					Continue with overlays and runtime architecture
				</h2>
				<p className="text-muted-foreground text-sm leading-7">
					Once the bundle resolves deterministically, move into safe
					customization and the wider architecture that surrounds it.
				</p>
				<div className="flex flex-wrap gap-3">
					<Link href="/docs/specs/overlays" className="btn-primary">
						Overlays
					</Link>
					<Link href="/docs/architecture" className="btn-ghost">
						Architecture overview
					</Link>
				</div>
			</section>
		</div>
	);
}
