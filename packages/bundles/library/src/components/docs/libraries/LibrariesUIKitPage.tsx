import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

const NATIVE_TABLE_EXAMPLE = `import { DataTable } from '@contractspec/lib.ui-kit/ui/data-table';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';

import { SHOWCASE_ROWS } from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.data';
import { useShowcaseColumns } from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.columns';
import {
  ExpandedRowContent,
  ShowcaseToolbar,
} from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.parts';

export function NativeAccountGrid() {
  const columns = useShowcaseColumns();

  const controller = useContractTable({
    data: SHOWCASE_ROWS,
    columns,
    selectionMode: 'single',
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
      toolbar={
        <ShowcaseToolbar
          controller={controller}
          label="Native primitive"
          primaryColumnId="account"
          toggleColumnId="notes"
          pinColumnId="owner"
          sortColumnIds={['arr', 'renewalDate']}
        />
      }
      loading={false}
      footer={\`Rows \${controller.rows.length}\`}
    />
  );
}`;

export function LibrariesUIKitPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">@contractspec/lib.ui-kit</h1>
				<p className="text-muted-foreground">
					Universal UI components for React Native and Web, built on top of
					<code>nativewind</code> and <code>@rn-primitives</code>.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Installation</h2>
				<InstallCommand package="@contractspec/lib.ui-kit" />
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Key Features</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>
						<strong>Universal</strong>: Components render natively on
						iOS/Android and as standard HTML on web
					</li>
					<li>
						<strong>Styled with NativeWind</strong>: Uses Tailwind CSS classes
						for styling
					</li>
					<li>
						<strong>Accessible</strong>: Leverages <code>@rn-primitives</code>{' '}
						(Radix UI for Native)
					</li>
					<li>
						<strong>Atomic Design</strong>: Exports atoms, molecules, and
						organisms
					</li>
				</ul>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Data table example</h2>
				<p className="text-muted-foreground">
					The canonical{' '}
					<Link
						href="/docs/examples/data-grid-showcase"
						className="text-[color:var(--rust)] underline underline-offset-4"
					>
						Data Grid Showcase
					</Link>{' '}
					uses <code>@contractspec/lib.ui-kit/ui/data-table</code> as the
					native-first primitive lane. It shares the same controller model as
					the web renderer while keeping the React Native / Expo surface
					explicit.
				</p>
				<CodeBlock language="tsx" code={NATIVE_TABLE_EXAMPLE} />
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Core Components</h2>
				<div className="grid gap-4 md:grid-cols-3">
					<div className="card-subtle p-4">
						<h3 className="mb-2 font-semibold">Form Controls</h3>
						<ul className="space-y-1 text-muted-foreground text-sm">
							<li>Button</li>
							<li>Input</li>
							<li>Checkbox</li>
							<li>Switch</li>
							<li>Select</li>
						</ul>
					</div>
					<div className="card-subtle p-4">
						<h3 className="mb-2 font-semibold">Layout</h3>
						<ul className="space-y-1 text-muted-foreground text-sm">
							<li>Card</li>
							<li>Stack</li>
							<li>Separator</li>
							<li>Sheet</li>
						</ul>
					</div>
					<div className="card-subtle p-4">
						<h3 className="mb-2 font-semibold">Feedback</h3>
						<ul className="space-y-1 text-muted-foreground text-sm">
							<li>Alert</li>
							<li>Skeleton</li>
							<li>Progress</li>
							<li>Tooltip</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="card-subtle space-y-3 p-6">
				<h2 className="font-bold text-2xl">Where this layer fits</h2>
				<p className="text-muted-foreground">
					Read{' '}
					<Link
						href="/docs/libraries/cross-platform-ui"
						className="text-[color:var(--rust)] underline underline-offset-4"
					>
						Cross-platform UI
					</Link>{' '}
					for the full React and React Native compatibility model around this
					native-first primitive lane.
				</p>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/libraries/schema" className="btn-ghost">
					Previous: Schema
				</Link>
				<Link href="/docs/libraries/ui-kit-web" className="btn-primary">
					Next: UI Kit Web <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
