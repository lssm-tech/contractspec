# @contractspec/lib.example-shared-ui

Website: https://contractspec.io/

**Shared React components and hooks for ContractSpec example apps.**

Provides reusable UI shells, editors, dashboards, and context utilities used across ContractSpec example applications. Built on the ContractSpec design system.

## Installation

```bash
bun add @contractspec/lib.example-shared-ui
```

## Exports

- `.` -- All components, hooks, and utilities
- `./TemplateShell` -- App shell layout with navigation and slots
- `./EvolutionDashboard` -- Dashboard for spec evolution visualization
- `./EvolutionSidebar` -- Sidebar companion for the evolution dashboard
- `./SpecEditorPanel` -- Inline spec editor component
- `./MarkdownView` -- Markdown renderer
- `./LocalDataIndicator` -- Indicator for local/offline data state
- `./SaveToStudioButton` -- One-click save to ContractSpec Studio
- `./OverlayContextProvider` -- Context provider for overlay state
- `./PersonalizationInsights` -- Personalization insights panel
- `./hooks/*` -- Shared React hooks
- `./lib/*` -- Runtime context, component registry, and shared types
- `./utils/*` -- Shared utility functions
- `./overlay-types` -- Overlay type definitions

## Usage

```tsx
import { TemplateShell } from "@contractspec/lib.example-shared-ui/TemplateShell";
import { SpecEditorPanel } from "@contractspec/lib.example-shared-ui/SpecEditorPanel";

export function App() {
  return (
    <TemplateShell title="My Example">
      <SpecEditorPanel specId="user-registration" />
    </TemplateShell>
  );
}
```
