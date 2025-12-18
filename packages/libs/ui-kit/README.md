# @lssm/lib.ui-kit

Universal UI components for React Native and Web, built on top of `nativewind` and `@rn-primitives`.

## Purpose

To provide a set of high-quality, accessible, and unstyled components that work seamlessly across mobile (React Native) and web (React/Next.js) platforms. This library serves as the foundation for the LSSM design system.

## Installation

```bash
npm install @lssm/lib.ui-kit
# or
bun add @lssm/lib.ui-kit
```

## Key Concepts

- **Universal**: Components are designed to render natively on iOS/Android and as standard HTML on the web.
- **Styled with NativeWind**: Uses Tailwind CSS classes for styling, enabling rapid UI development with a familiar syntax.
- **Accessible Primitives**: Leverages `@rn-primitives` (Radix UI for Native) to ensure accessibility best practices.
- **Atomic Design**: Exports atoms, molecules, and organisms to build complex UIs.

## Exports

The library exports components via subpaths to allow for tree-shaking and cleaner imports.

### Core UI Components

- `accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`
- `breadcrumb`, `button`, `card`, `checkbox`, `collapsible`, `command`
- `context-menu`, `date-picker`, `dialog`, `dropdown-menu`, `form`
- `hover-card`, `input`, `label`, `menubar`, `navigation-menu`, `popover`
- `progress`, `radio-group`, `select`, `separator`, `sheet`, `skeleton`
- `slider`, `switch`, `table`, `tabs`, `textarea`, `toggle-group`, `toggle`, `tooltip`

### Layout & Utilities

- `stack`, `text`, `typography`
- `useColorScheme`

### Higher-Order Patterns (Molecules/Organisms)

- `marketing/*`: `Hero`, `FeatureGrid`, `PricingTable`
- `usecases/*`: `UseCaseCard`, `UserStoryCard`
- `molecules/*`: `SearchAndFilter`, `Autocomplete`
- `organisms/*`: `ListPage`, `ErrorBoundary`

## Usage

```tsx
import { Button } from '@lssm/lib.ui-kit/ui/button';
import { Text } from '@lssm/lib.ui-kit/ui/text';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@lssm/lib.ui-kit/ui/card';

export function MyComponent() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent className="gap-4">
        <Text>This is a universal component.</Text>
        <Button onPress={() => console.log('Clicked!')}>Click me</Button>
      </CardContent>
    </Card>
  );
}
```


























