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

// Root imports remain supported:
import { Button, DataTable } from '@contractspec/lib.design-system';`;

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
