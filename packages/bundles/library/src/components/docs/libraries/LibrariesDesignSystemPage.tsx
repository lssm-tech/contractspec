import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

const DESIGN_SYSTEM_TABLE_EXAMPLE = `import { Button, DataTable } from '@contractspec/lib.design-system';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';

import { SHOWCASE_ROWS } from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.data';
import { useShowcaseColumns } from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.columns';
import {
  ExpandedRowContent,
  ShowcaseToolbar,
} from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.parts';

export function AccountHealthTable() {
  const columns = useShowcaseColumns();

  const controller = useContractTable({
    data: SHOWCASE_ROWS,
    columns,
    selectionMode: 'multiple',
    initialState: {
      sorting: [{ id: 'arr', desc: true }],
      pagination: { pageIndex: 0, pageSize: 4 },
      columnVisibility: { notes: false },
      columnPinning: { left: ['account'], right: [] },
    },
    renderExpandedContent: (row) => <ExpandedRowContent row={row} />,
    getCanExpand: () => true,
  });

  return (
    <DataTable
      controller={controller}
      title="Account health"
      description="Composed table surface for the canonical account grid."
      headerActions={<Button variant="outline">Reset</Button>}
      toolbar={
        <ShowcaseToolbar
          controller={controller}
          label="Client mode"
          primaryColumnId="account"
          toggleColumnId="notes"
          pinColumnId="owner"
          sortColumnIds={['arr', 'renewalDate']}
        />
      }
      loading={false}
      emptyState={<div>No rows available.</div>}
      footer={\`Page \${controller.pageIndex + 1} of \${controller.pageCount}\`}
    />
  );
}`;

const THEME_TAILWIND_EXAMPLE = `import {
  DesignSystemThemeProvider,
  resolveThemeModeTokens,
  themeSpecToCssVariables,
  themeSpecToTailwindCss,
  themeSpecToTailwindPreset,
} from '@contractspec/lib.design-system';

const tokens = resolveThemeModeTokens(themeSpec, 'light', {
  targets: ['tenant:acme'],
});

export default themeSpecToTailwindPreset(tokens);

const css = themeSpecToTailwindCss(
  themeSpecToCssVariables(themeSpec, { targets: ['tenant:acme'] }),
  { includeCustomVariant: true }
);

export function TenantSurface({ children }: { children: React.ReactNode }) {
  return (
    <DesignSystemThemeProvider
      theme={themeSpec}
      targets={['tenant:acme']}
      mode="dark"
      applyCssVariables
    >
      {children}
    </DesignSystemThemeProvider>
  );
}`;

const FOCUSED_SUBPATHS_EXAMPLE = `import { themeSpecToTailwindPreset } from '@contractspec/lib.design-system/theme';
import { Select } from '@contractspec/lib.design-system/controls';
import { FormDialog } from '@contractspec/lib.design-system/forms';
import { HStack } from '@contractspec/lib.design-system/layout';
import { AdaptivePanel } from '@contractspec/lib.design-system/components/overlays';
import { ObjectReferenceHandler } from '@contractspec/lib.design-system/components/object-reference';

// Root imports remain supported:
import { Button, DataTable } from '@contractspec/lib.design-system';`;

const OBJECT_REFERENCE_EXAMPLE = `import {
  ObjectReferenceHandler,
  createDefaultObjectReferenceActions,
  createMapsReferenceActions,
  type ObjectReferenceDescriptor,
  type ObjectReferenceOpenHrefHandler,
} from '@contractspec/lib.design-system';

const customerContact: ObjectReferenceDescriptor = {
  id: 'user.amina',
  kind: 'user',
  label: 'Amina Laurent',
  description: 'Customer success owner',
  href: '/customers/acme/users/amina',
  properties: [
    {
      id: 'user.amina.email',
      kind: 'email',
      label: 'Email',
      value: 'amina@example.com',
    },
    {
      id: 'user.amina.phone',
      kind: 'phone',
      label: 'Phone',
      value: '+33 1 23 45 67 89',
    },
  ],
  sections: [
    {
      id: 'customer-site',
      title: 'Primary site',
      properties: [
        {
          id: 'customer-site.address',
          kind: 'address',
          label: 'Paris office',
          value: '10 rue de Rivoli, 75001 Paris',
          actions: createMapsReferenceActions({
            id: 'customer-site.address',
            kind: 'address',
            label: 'Paris office',
            value: '10 rue de Rivoli, 75001 Paris',
          }),
        },
      ],
    },
  ],
};

const openHref: ObjectReferenceOpenHrefHandler = (href, _event, options) => {
  if (options.target === 'new-page') {
    window.open(href, '_blank', 'noopener,noreferrer');
    return;
  }

  window.location.assign(href);
};

<ObjectReferenceHandler
  reference={customerContact}
  actions={createDefaultObjectReferenceActions(customerContact)}
  interactivityVisibility="icon"
  openTarget="same-page"
  panelMode="responsive"
  mobilePanelMode="drawer"
  desktopPanelMode="sheet"
  responsiveBreakpoint="md"
  openHref={openHref}
/>;`;

const ADAPTIVE_PANEL_EXAMPLE = `import { AdaptivePanel } from '@contractspec/lib.design-system/components/overlays';

<AdaptivePanel
  open={open}
  onOpenChange={setOpen}
  trigger={<button type="button">Edit</button>}
  title="Edit customer"
  description="Update contact and site details."
  mode="responsive"
  mobileMode="drawer"
  desktopMode="sheet"
  breakpoint="md"
  sheetSide="right"
  drawerDirection="bottom"
>
  {content}
</AdaptivePanel>;`;

const OBJECT_REFERENCE_PROMPT = `Find every user-facing address, phone number, email, user, customer, file, URL, and tenant-specific object reference currently rendered as inert text.

Replace each one with ObjectReferenceHandler from @contractspec/lib.design-system. Keep descriptors data-only: id, kind, label, value, href, openTarget, properties, sections, metadata, iconKey, and ariaLabel are allowed; React callbacks belong in handler props only.

Use properties and sections for rich references. For example, a user reference can expose email, phone, address, files, and customer links in one panel instead of rendering separate disconnected strings.

Use panelMode="responsive" by default. Let desktop render a sheet and small screens render a bottom drawer through AdaptivePanel. Do not call Sheet or Drawer directly for this interaction unless a lower-level primitive is being implemented.

Use openTarget="same-page" unless product requirements explicitly require a new page. Put custom copy, navigation, analytics, permissions, or tenant-specific actions in copyHandler, openHref, actionHandlers, onAction, and onActionError.

For addresses, use createMapsReferenceActions so users can choose Google Maps, Apple Maps, or Waze. For email and phone references, prefer createDefaultObjectReferenceActions unless a product-specific action set is required.

After replacing references, verify keyboard access, visible affordance choice (none, underline, or icon), safe href behavior, mobile drawer layout, and desktop sheet layout.`;

export function LibrariesDesignSystemPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">@contractspec/lib.design-system</h1>
				<p className="text-muted-foreground">
					High-level design system components, patterns, and layouts for LSSM
					applications. Built on top of <code>@contractspec/lib.ui-kit</code>.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Installation</h2>
				<InstallCommand package="@contractspec/lib.design-system" />
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">What It Provides</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>
						<strong>Composite Components</strong>: Molecules and Organisms that
						solve common UI problems
					</li>
					<li>
						<strong>Layouts</strong>: Ready-to-use page structures for
						dashboards, marketing sites, and lists
					</li>
					<li>
						<strong>Data Views</strong>: Standardized renderers for lists,
						tables, and detail views
					</li>
					<li>
						<strong>Forms</strong>: Zod-integrated form layouts and components
					</li>
					<li>
						<strong>Code Display</strong>: Syntax-highlighted code blocks with
						package manager tabs
					</li>
					<li>
						<strong>Platform Utilities</strong>: Hooks for responsive and
						adaptive design
					</li>
					<li>
						<strong>Object References</strong>: Clickable references for
						addresses, phone numbers, users, customers, files, URLs, and custom
						objects
					</li>
					<li>
						<strong>Adaptive Panels</strong>: One panel API that resolves to a
						desktop sheet or mobile drawer
					</li>
					<li>
						<strong>Theme Bridge</strong>: ThemeSpec to Tailwind variables,
						presets, CSS text, and runtime light/dark mode
					</li>
					<li>
						<strong>Legal Templates</strong>: Compliant templates for Terms,
						Privacy, and GDPR
					</li>
				</ul>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">ThemeSpec to Tailwind</h2>
				<p className="text-muted-foreground">
					The theme bridge keeps <code>ThemeSpec</code> as the source of truth
					and exposes no-generation Tailwind helpers, optional CSS text
					serialization, runtime CSS variables, light/dark modes, and OKLCH
					color pass-through.
				</p>
				<CodeBlock language="tsx" code={THEME_TAILWIND_EXAMPLE} />
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Focused import surfaces</h2>
				<p className="text-muted-foreground">
					New code can use focused subpaths for theme, controls, forms, and
					layout while existing root imports remain compatible.
				</p>
				<CodeBlock language="tsx" code={FOCUSED_SUBPATHS_EXAMPLE} />
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Actionable object references</h2>
				<p className="text-muted-foreground">
					Use <code>ObjectReferenceHandler</code> whenever a product surface
					renders an object that may need quick interaction: addresses, phone
					numbers, emails, users, customers, files, URLs, and tenant-specific
					objects. The goal is to avoid inert references while keeping the
					descriptor contract declarative enough for OSS consumers and future
					contract-generated surfaces.
				</p>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="card-subtle p-4">
						<h3 className="mb-2 font-semibold">Descriptor model</h3>
						<ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
							<li>
								References use data-only descriptors: <code>id</code>,{' '}
								<code>kind</code>, <code>label</code>, <code>value</code>,{' '}
								<code>href</code>, <code>openTarget</code>,{' '}
								<code>metadata</code>, <code>iconKey</code>, and{' '}
								<code>ariaLabel</code>.
							</li>
							<li>
								Rich references use nested <code>properties</code> and{' '}
								<code>sections</code>, so one user or customer can expose email,
								phone, address, files, and links inside the same panel.
							</li>
							<li>
								Reference kinds are <code>address</code>, <code>email</code>,{' '}
								<code>phone</code>, <code>user</code>, <code>customer</code>,{' '}
								<code>file</code>, <code>url</code>, and <code>custom</code>.
							</li>
						</ul>
					</div>
					<div className="card-subtle p-4">
						<h3 className="mb-2 font-semibold">Runtime behavior</h3>
						<ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
							<li>
								Choose visibility with <code>interactivityVisibility</code>:
								<code>none</code>, <code>underline</code>, or <code>icon</code>.
							</li>
							<li>
								Detail navigation defaults to <code>same-page</code>; set{' '}
								<code>openTarget="new-page"</code> on the handler, reference, or
								action when a new page is required.
							</li>
							<li>
								Host apps provide behavior through <code>copyHandler</code>,{' '}
								<code>openHref</code>, <code>actionHandlers</code>,{' '}
								<code>onAction</code>, and <code>onActionError</code>.
							</li>
						</ul>
					</div>
					<div className="card-subtle p-4">
						<h3 className="mb-2 font-semibold">Default actions</h3>
						<ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
							<li>
								<code>createDefaultObjectReferenceActions</code> adds copy,
								open, email, phone, and map actions when the descriptor supports
								them.
							</li>
							<li>
								<code>createMapsReferenceActions</code> creates Google Maps,
								Apple Maps, Waze, or geo actions for address references.
							</li>
							<li>
								Safe href handling allows expected app, web, email, phone, and
								map URLs while rejecting unsafe schemes.
							</li>
						</ul>
					</div>
					<div className="card-subtle p-4">
						<h3 className="mb-2 font-semibold">Extension points</h3>
						<ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
							<li>
								Use <code>renderTrigger</code>, <code>renderDetail</code>,{' '}
								<code>renderAction</code>, <code>renderProperty</code>,{' '}
								<code>renderSection</code>, and <code>iconRenderer</code> to
								wrap or overload presentation.
							</li>
							<li>
								Keep tenant-specific permissions, analytics, and integration
								side effects at the host boundary through runtime handlers.
							</li>
						</ul>
					</div>
				</div>
				<CodeBlock language="tsx" code={OBJECT_REFERENCE_EXAMPLE} />
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Adaptive panels</h2>
				<p className="text-muted-foreground">
					<code>AdaptivePanel</code> is the shared overlay decision for surfaces
					that should feel native on both desktop and small screens. Its default
					responsive mode renders a sheet at the configured desktop breakpoint
					and a drawer below it. <code>ObjectReferenceHandler</code> uses this
					panel contract through <code>panelMode</code>,{' '}
					<code>mobilePanelMode</code>, <code>desktopPanelMode</code>, and{' '}
					<code>responsiveBreakpoint</code>.
				</p>
				<CodeBlock language="tsx" code={ADAPTIVE_PANEL_EXAMPLE} />
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Prompt for adoption work</h2>
				<p className="text-muted-foreground">
					Use this prompt when asking an agent or downstream OSS consumer to
					replace inert references across an application.
				</p>
				<CodeBlock language="text" code={OBJECT_REFERENCE_PROMPT} />
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Data table example</h2>
				<p className="text-muted-foreground">
					This is the composed lane from the canonical{' '}
					<Link
						href="/docs/examples/data-grid-showcase"
						className="text-[color:var(--rust)] underline underline-offset-4"
					>
						Data Grid Showcase
					</Link>
					. The design-system wrapper owns title, description, header actions,
					and the opinionated card shell on top of the raw web primitive.
				</p>
				<CodeBlock language="tsx" code={DESIGN_SYSTEM_TABLE_EXAMPLE} />
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Key Exports</h2>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="card-subtle p-4">
						<h3 className="mb-2 font-semibold">Organisms</h3>
						<ul className="space-y-1 text-muted-foreground text-sm">
							<li>AppShell, PageOutline</li>
							<li>AppLayout, AppHeader, AppSidebar</li>
							<li>MarketingLayout, HeroSection</li>
							<li>ListCardPage, ListTablePage</li>
						</ul>
					</div>
					<div className="card-subtle p-4">
						<h3 className="mb-2 font-semibold">Data & Forms</h3>
						<ul className="space-y-1 text-muted-foreground text-sm">
							<li>DataTable</li>
							<li>DataViewTable</li>
							<li>DataViewRenderer</li>
							<li>ZodForm</li>
							<li>FormLayout, FormDialog</li>
						</ul>
					</div>
					<div className="card-subtle p-4">
						<h3 className="mb-2 font-semibold">Code Display</h3>
						<ul className="space-y-1 text-muted-foreground text-sm">
							<li>CodeBlock (syntax highlighting)</li>
							<li>CommandTabs (package manager tabs)</li>
							<li>InstallCommand (convenience wrapper)</li>
							<li>CopyButton</li>
						</ul>
					</div>
					<div className="card-subtle p-4">
						<h3 className="mb-2 font-semibold">Providers</h3>
						<ul className="space-y-1 text-muted-foreground text-sm">
							<li>PackageManagerProvider</li>
						</ul>
					</div>
					<div className="card-subtle p-4">
						<h3 className="mb-2 font-semibold">References & Overlays</h3>
						<ul className="space-y-1 text-muted-foreground text-sm">
							<li>ObjectReferenceHandler</li>
							<li>createDefaultObjectReferenceActions</li>
							<li>createMapsReferenceActions</li>
							<li>AdaptivePanel</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="card-subtle space-y-3 p-6">
				<h2 className="font-bold text-2xl">Where this layer fits</h2>
				<p className="text-muted-foreground">
					Read{' '}
					<Link
						href="/docs/libraries/application-shell"
						className="text-[color:var(--rust)] underline underline-offset-4"
					>
						Application shell
					</Link>{' '}
					for the shared sidebar, topbar, command search, mobile navigation, and{' '}
					<code>PageOutline</code> pattern. Read{' '}
					<Link
						href="/docs/libraries/cross-platform-ui"
						className="text-[color:var(--rust)] underline underline-offset-4"
					>
						Cross-platform UI
					</Link>{' '}
					for the package split between shared runtime controllers, leaf
					platform primitives, and this composed design-system layer.
				</p>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/libraries/ui-kit-web" className="btn-ghost">
					Previous: UI Kit Web
				</Link>
				<Link href="/docs/libraries/accessibility" className="btn-primary">
					Next: Accessibility <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
