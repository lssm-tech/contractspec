import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Runtime Libraries: ContractSpec Docs',
  description:
    'Presentation runtimes for rendering ContractSpec workflows and UIs.',
};

export default function RuntimeLibrariesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Runtime Libraries</h1>
        <p className="text-muted-foreground">
          The presentation runtime libraries provide the engine for rendering
          ContractSpec-defined UIs. They handle state management, validation,
          step navigation, and component rendering for Workflows and DataViews.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Libraries</h2>

        <div className="space-y-6">
          <div className="card-subtle p-6">
            <h3 className="text-lg font-bold">
              @lssm/lib.presentation-runtime-core
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Framework-Agnostic Core</strong>. Contains the state
              machines, validation logic, and navigation rules for workflows.
              Can be used to build renderers for any platform (Vue, Svelte,
              CLI).
            </p>
          </div>

          <div className="card-subtle p-6">
            <h3 className="text-lg font-bold">
              @lssm/lib.presentation-runtime-react
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>React Bindings</strong>. Hooks (`useWorkflow`) and
              components (`WorkflowStepper`, `WorkflowStepRenderer`) for React
              Web applications. Integrates with `ui-kit-web`.
            </p>
          </div>

          <div className="card-subtle p-6">
            <h3 className="text-lg font-bold">
              @lssm/lib.presentation-runtime-react-native
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>React Native Bindings</strong>. Optimized for mobile
              experiences. Handles native navigation integration and uses
              universal components from `ui-kit`.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example: React Workflow</h2>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { useWorkflow, WorkflowStepRenderer } from '@lssm/lib.presentation-runtime-react';
import { OnboardingFlow } from './specs/onboarding';

export function OnboardingPage() {
  const workflow = useWorkflow(OnboardingFlow);

  if (workflow.isComplete) {
    return <SuccessScreen data={workflow.result} />;
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">
        {workflow.currentStep.title}
      </h1>
      
      <WorkflowStepRenderer 
        step={workflow.currentStep}
        onChange={workflow.updateData}
        errors={workflow.errors}
      />
      
      <div className="flex justify-end mt-6 gap-4">
        <button 
          onClick={workflow.prev}
          disabled={!workflow.canGoBack}
          className="btn-ghost"
        >
          Back
        </button>
        <button 
          onClick={workflow.next}
          disabled={!workflow.canProceed}
          className="btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Architecture</h2>
        <p className="text-muted-foreground">
          The runtime follows a "render-loop" pattern:
        </p>
        <ol className="text-muted-foreground list-inside list-decimal space-y-2">
          <li>
            <strong>Spec</strong>: Defines the flow, fields, and validation
            rules.
          </li>
          <li>
            <strong>Core</strong>: Tracks current step, data state, and
            validation errors.
          </li>
          <li>
            <strong>Renderer</strong>: Maps spec fields to UI components (Input,
            Select, etc.).
          </li>
          <li>
            <strong>User</strong>: Interacts with components, updating core
            state.
          </li>
          <li>
            <strong>Policy</strong>: (Optional) Re-evaluates visibility on every
            change.
          </li>
        </ol>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries/data-backend" className="btn-ghost">
          Previous: Data & Backend
        </Link>
        <Link href="/docs/libraries" className="btn-primary">
          Back to Libraries <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}




















