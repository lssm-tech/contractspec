# @contractspec/lib.presentation-runtime-react-native

Website: https://contractspec.io/


React Native bindings for ContractSpec presentations.

## Purpose

To render ContractSpec-defined UIs in React Native (Expo) applications, using native components from `@contractspec/lib.ui-kit`.

## Installation

```bash
npm install @contractspec/lib.presentation-runtime-react-native
# or
bun add @contractspec/lib.presentation-runtime-react-native
```

## Key Concepts

- **Native Optimized**: Uses native navigation patterns where applicable.
- **Universal**: API parity with `@contractspec/lib.presentation-runtime-react` where possible.

## Usage

Similar to the React runtime, but imports from this package.

```tsx
import { useWorkflow } from '@contractspec/lib.presentation-runtime-react-native';
// ... usage
```


































