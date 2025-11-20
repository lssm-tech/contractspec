# @lssm/lib.presentation-runtime-core

Core logic for ContractSpec presentation runtimes.

## Purpose

To provide the shared, framework-agnostic state management and logic for executing workflows and rendering presentations defined in ContractSpec.

## Installation

```bash
npm install @lssm/lib.presentation-runtime-core
# or
bun add @lssm/lib.presentation-runtime-core
```

## Key Concepts

- **Workflow State**: Manages the progression of steps in a `WorkflowSpec`.
- **Step Navigation**: Logic for next/previous/submit actions.
- **Validation**: Integration with Zod schemas for step validation.

## Exports

- Types and state machines for workflows.
- Validation helpers.

## Usage

Typically used internally by `@lssm/lib.presentation-runtime-react` or `@lssm/lib.presentation-runtime-react-native`.



