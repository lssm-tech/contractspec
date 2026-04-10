import { CodeBlock } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function GuideFirstModuleBundlePage() {
	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<h1 className="font-bold text-4xl">Build a first module bundle</h1>
				<p className="text-lg text-muted-foreground">
					Define one bundle spec, resolve it for a real route and preference
					profile, then render the resulting surface plan through the React host
					layer.
				</p>
			</div>

			<div className="card-subtle space-y-4 p-6">
				<h2 className="font-bold text-2xl">What you&apos;ll build</h2>
				<ul className="space-y-2 text-muted-foreground text-sm">
					<li>One `ModuleBundleSpec` with a route and workbench surface.</li>
					<li>One `ResolvedSurfacePlan` from `resolveBundle`.</li>
					<li>One React host using `BundleProvider` and `BundleRenderer`.</li>
				</ul>
			</div>

			<div className="space-y-6">
				<div className="space-y-3">
					<h2 className="font-bold text-2xl">1) Define the bundle spec</h2>
					<p className="text-muted-foreground text-sm">
						The bundle spec is the durable contract. It owns route selection,
						surface shape, layouts, data recipes, and verification coverage for
						all seven preference dimensions.
					</p>
					<CodeBlock
						language="typescript"
						filename="src/bundles/support.workbench.bundle.ts"
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
      slots: [
        { slotId: "primary", role: "primary", accepts: ["entity-section"], cardinality: "many" },
        { slotId: "assistant", role: "assistant", accepts: ["assistant-panel"], cardinality: "many", mutableByAi: true, mutableByUser: true },
      ],
      layouts: [
        { layoutId: "balanced", title: "Balanced", root: { type: "slot", slotId: "primary" } },
      ],
      data: [
        { recipeId: "ticket-core", source: { kind: "entity", entityType: "support.ticket" }, hydrateInto: "ticket" },
      ],
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
					<p className="text-muted-foreground text-sm">
						Expected output: `defineModuleBundle` validates the route, surface,
						and verification dimensions at runtime.
					</p>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">2) Resolve the plan</h2>
					<p className="text-muted-foreground text-sm">
						Resolve against a real route, device, and preference profile. This
						is where the runtime chooses the surface, layout, bindings, and
						audit reasons.
					</p>
					<CodeBlock
						language="typescript"
						filename="src/runtime/resolve-support-workbench.ts"
						code={`import { resolveBundle } from "@contractspec/lib.surface-runtime/runtime/resolve-bundle";

export const supportWorkbenchPlan = await resolveBundle(
  SupportWorkbenchBundle,
  {
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
  }
);`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: a `ResolvedSurfacePlan` with `bundleKey`,
						`surfaceId`, `layoutId`, `bindings`, `adaptation`, and audit
						reasons.
					</p>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-2xl">3) Render the plan</h2>
					<p className="text-muted-foreground text-sm">
						The host app renders the resolved plan, not the raw spec. That keeps
						layout selection, overlays, and AI proposals downstream of the
						declared bundle contract.
					</p>
					<CodeBlock
						language="tsx"
						filename="src/app/support/SurfaceHost.tsx"
						code={`import { BundleProvider, BundleRenderer } from "@contractspec/lib.surface-runtime/react";

export function SurfaceHost() {
  return (
    <BundleProvider plan={supportWorkbenchPlan}>
      <BundleRenderer assistantSlotId="assistant" />
    </BundleProvider>
  );
}`}
					/>
					<p className="text-muted-foreground text-sm">
						Expected output: the route renders according to the resolved layout
						root and slot plan instead of bespoke page assembly.
					</p>
				</div>

				<div className="card-subtle space-y-3 p-6">
					<h3 className="font-semibold text-lg">Verification checks</h3>
					<ul className="space-y-2 text-muted-foreground text-sm">
						<li>The resolved `surfaceId` matches the route you expected.</li>
						<li>
							The `layoutId` is stable for the active view and preferences.
						</li>
						<li>
							The plan carries audit reasons and all seven adaptation
							dimensions.
						</li>
						<li>Assistant or overlay work stays within declared slots.</li>
					</ul>
				</div>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/specs/module-bundles" className="btn-primary">
					Back to module bundles <ChevronRight size={16} />
				</Link>
				<Link href="/docs/specs/overlays" className="btn-ghost">
					Next: overlays
				</Link>
			</div>
		</div>
	);
}
