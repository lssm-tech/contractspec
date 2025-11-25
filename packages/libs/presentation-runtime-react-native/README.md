# @lssm/lib.presentation-runtime-react-native

React Native bindings for ContractSpec presentations.

## Purpose

To render ContractSpec-defined UIs in React Native (Expo) applications, using native components from `@lssm/lib.ui-kit`.

## Installation

```bash
npm install @lssm/lib.presentation-runtime-react-native
# or
bun add @lssm/lib.presentation-runtime-react-native
```

## Key Concepts

- **Native Optimized**: Uses native navigation patterns where applicable.
- **Universal**: API parity with `@lssm/lib.presentation-runtime-react` where possible.

## Usage

Similar to the React runtime, but imports from this package.

```tsx
import { useWorkflow } from '@lssm/lib.presentation-runtime-react-native';
// ... usage
```















