import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

const WEB_PRIMITIVE_EXAMPLE = `import { DataTable } from '@contractspec/lib.ui-kit-web/ui/data-table';
import { useContractTable } from '@contractspec/lib.presentation-runtime-react';

import { SHOWCASE_ROWS } from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.data';
import { useShowcaseColumns } from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.columns';
import {
  ExpandedRowContent,
  ShowcaseToolbar,
} from '@contractspec/example.data-grid-showcase/ui/data-grid-showcase.parts';

export function WebAccountGrid() {
  const columns = useShowcaseColumns();

  const controller = useContractTable({
    data: SHOWCASE_ROWS,
    columns,
    selectionMode: 'single',
    initialState: {
      sorting: [{ id: 'lastActivityAt', desc: true }],
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
          label="Web primitive"
          primaryColumnId="account"
          toggleColumnId="notes"
          pinColumnId="owner"
          sortColumnIds={['arr', 'renewalDate']}
        />
      }
      loading={false}
      emptyState={<div>No rows available.</div>}
      footer={\`Rows \${controller.totalItems}\`}
    />
  );
}`;

export function LibrariesUIKitWebPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">@contractspec/lib.ui-kit-web</h1>
				<p className="text-muted-foreground">
					Web-first React and Next primitives for ContractSpec. The canonical
					data-table example uses this package to render the raw browser table
					layer directly, without the design-system shell on top.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Installation</h2>
				<InstallCommand package="@contractspec/lib.ui-kit-web" />
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Data table example</h2>
				<p className="text-muted-foreground">
					This is the raw browser lane from the canonical{' '}
					<Link
						href="/docs/examples/data-grid-showcase"
						className="text-[color:var(--rust)] underline underline-offset-4"
					>
						Data Grid Showcase
					</Link>
					. It demonstrates the primitive renderer with sorting, pagination,
					single selection, column visibility, column resizing, left/right
					pinning, row expansion, loading, and empty-state slots.
				</p>
				<CodeBlock
					language="tsx"
					filename="web-account-grid.tsx"
					code={WEB_PRIMITIVE_EXAMPLE}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">What this layer owns</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>The raw table renderer and browser interaction model.</li>
					<li>
						Pagination, column visibility menus, pin menus, resize handles, and
						empty/loading states.
					</li>
					<li>
						Accessibility helpers and other web-specific primitives that stay
						outside the native-first package.
					</li>
				</ul>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/libraries/ui-kit" className="btn-ghost">
					Previous: UI Kit
				</Link>
				<Link href="/docs/libraries/design-system" className="btn-primary">
					Next: Design System <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
