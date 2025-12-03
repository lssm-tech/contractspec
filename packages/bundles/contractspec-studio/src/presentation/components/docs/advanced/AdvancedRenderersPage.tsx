import Link from '@lssm/lib.ui-link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Custom Renderers: ContractSpec Docs',
//   description: 'Build custom renderers for different platforms and frameworks.',
// };

export function AdvancedRenderersPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Custom Renderers</h1>
        <p className="text-muted-foreground text-lg">
          ContractSpec ships with React and React Native renderers. You can
          build custom renderers for any framework.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Overview</h2>
          <p className="text-muted-foreground">
            The presentation runtime libraries (
            <code>@lssm/lib.presentation-runtime-react</code> and
            <code>@lssm/lib.presentation-runtime-react-native</code>) provide
            hooks and components to render ContractSpec-defined UI like
            workflows and data views. You can extend these or create custom
            implementations for other frameworks.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Using the React Renderer</h2>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`import { useWorkflow, WorkflowStepRenderer } from '@lssm/lib.presentation-runtime-react';
import { MyWorkflowSpec } from './specs';

export function WorkflowPage() {
  const workflow = useWorkflow(MyWorkflowSpec);

  return (
    <div>
      <h1>{workflow.currentStep.title}</h1>
      <WorkflowStepRenderer workflow={workflow} />
      <button onClick={workflow.next} disabled={!workflow.canProceed}>
        Next
      </button>
    </div>
  );
}`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Custom Platform Support</h2>
          <p className="text-muted-foreground">
            To support a new platform (e.g., Vue, Svelte), you would:
          </p>
          <ol className="text-muted-foreground list-inside list-decimal space-y-2">
            <li>
              Implement the core workflow state machine (from{' '}
              <code>@lssm/lib.presentation-runtime-core</code>)
            </li>
            <li>
              Create framework-specific hooks/components for step rendering
            </li>
            <li>
              Handle validation and submission via the ContractSpec I/O schemas
            </li>
          </ol>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Link href="/docs" className="btn-primary">
            Back to docs <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
