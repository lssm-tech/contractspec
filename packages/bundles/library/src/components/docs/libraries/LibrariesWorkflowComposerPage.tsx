import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesWorkflowComposerPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">Workflow Composer</h1>
				<p className="text-lg text-muted-foreground">
					`@contractspec/lib.workflow-composer` injects
					tenant-/role-/device-specific steps into base WorkflowSpecs and keeps
					transitions valid.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Installation</h2>
				<InstallCommand package="@contractspec/lib.workflow-composer" />
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Register extensions</h2>
				<CodeBlock
					language="typescript"
					code={`const composer = new WorkflowComposer();

composer.register({
  workflow: 'billing.invoiceApproval',
  tenantId: 'acme',
  customSteps: [
    {
      after: 'validate-invoice',
      inject: {
        id: 'acme-legal',
        type: 'human',
        label: 'ACME Legal Review',
      },
      transitionTo: 'final-approval',
    },
  ],
  hiddenSteps: ['internal-audit'],
});`}
				/>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Compose at runtime</h2>
				<CodeBlock
					language="typescript"
					code={`const tenantWorkflow = composer.compose({
  base: BaseInvoiceWorkflow,
  tenantId: 'acme',
});

workflowRunner.execute(tenantWorkflow, ctx);`}
				/>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/libraries" className="btn-ghost">
					Back to Libraries
				</Link>
				<Link href="/docs/libraries/workflows" className="btn-primary">
					Next: Workflow Runtime <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
