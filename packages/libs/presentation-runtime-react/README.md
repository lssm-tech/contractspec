# @lssm/lib.presentation-runtime-react

React bindings for ContractSpec presentations (Workflows, DataViews).

## Purpose

To render ContractSpec-defined UIs in standard React web applications.

## Installation

```bash
npm install @lssm/lib.presentation-runtime-react
# or
bun add @lssm/lib.presentation-runtime-react
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
} from '@lssm/lib.presentation-runtime-react';
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


























