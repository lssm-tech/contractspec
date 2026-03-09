# @contractspec/lib.presentation-runtime-react

Website: https://contractspec.io/


React bindings for ContractSpec presentations (Workflows, DataViews).

## Purpose

To render ContractSpec-defined UIs in standard React web applications.

## Installation

```bash
npm install @contractspec/lib.presentation-runtime-react
# or
bun add @contractspec/lib.presentation-runtime-react
```

## Key Concepts

- **useWorkflow**: Hook to drive a multi-step workflow.
- **WorkflowStepper**: UI component to show progress.
- **WorkflowStepRenderer**: Component to render the current step's form or content.

## Usage

```tsx
import {
  useWorkflow,
  WorkflowStepRenderer,
} from '@contractspec/lib.presentation-runtime-react';
import { MyWorkflowSpec } from './specs';

export function WorkflowPage() {
  const workflow = useWorkflow(MyWorkflowSpec);

  return (
    <div>
      <WorkflowStepRenderer workflow={workflow} />
      <button onClick={workflow.next}>Next</button>
    </div>
  );
}
```

## Surface-runtime slot integration

When using `@contractspec/lib.surface-runtime`, workflow components can fill slots:

1. **Slot content**: Pass `WorkflowStepper` or `WorkflowStepRenderer` as `slotContent` to `BundleRenderer` for slots that `accepts` include `workflow-stepper` or a custom widget kind.
2. **Slot declaration**: In your bundle spec, declare a slot with `accepts: ['custom-widget']` and wire the workflow component as slot content when rendering.
3. **State**: Use `useWorkflow` in the parent; pass the workflow instance to `WorkflowStepRenderer` so step state is preserved within the surface layout.

Example: a slot with `accepts: ['custom-widget']` can render `<WorkflowStepRenderer workflow={workflow} />` as its content.


































