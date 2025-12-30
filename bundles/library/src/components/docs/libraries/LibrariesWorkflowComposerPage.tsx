// export const metadata: Metadata = {
//   title: 'Workflow Composer | ContractSpec',
//   description: 'Tenant-aware workflow extensions without forking specs.',
// };

export function LibrariesWorkflowComposerPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Workflow Composer</h1>
        <p className="text-muted-foreground text-lg">
          `@contractspec/lib.workflow-composer` injects
          tenant-/role-/device-specific steps into base WorkflowSpecs and keeps
          transitions valid.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Register extensions</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`const composer = new WorkflowComposer();

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
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Compose at runtime</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`const tenantWorkflow = composer.compose({
  base: BaseInvoiceWorkflow,
  tenantId: 'acme',
});

workflowRunner.execute(tenantWorkflow, ctx);`}
        </pre>
      </div>
    </div>
  );
}
