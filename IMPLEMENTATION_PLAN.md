# Documentation Code Blocks & Package Manager Tabs Implementation Plan

## Overview

Update all documentation pages in `packages/bundles/library/src/components/docs/` to:
1. Use proper syntax-highlighted code blocks
2. Add package manager tabs (bun/npm/yarn/pnpm) with shared state
3. Ensure consistent, accessible code display across 95+ documentation pages

## Current State

### What Exists
- **95+ documentation pages** with raw `<pre>` tags and Tailwind styling
- **No syntax highlighting** - code is plain text
- **No package manager tabs** - installation commands show single package manager
- **No copy functionality** on code blocks

### Existing Components (in `apps/web-landing`)
- `CodeBlock` - Shiki-based syntax highlighting (async server component)
- `CommandTabs` - Package manager tabs with localStorage persistence
- `CopyButton` - Clipboard copy with visual feedback
- `Tabs` primitive in `ui-kit-web` (Radix UI based)

### Gap
The web-landing app has excellent code display components, but they're not available to the library bundle documentation.

---

## Implementation Plan

### Phase 1: Create Design System Code Components

**Goal**: Extract/create reusable code display components in the design system.

#### 1.1 Create `CodeBlock` Component
**File**: `packages/libs/design-system/src/components/molecules/CodeBlock/`

```
CodeBlock/
├── index.ts
├── CodeBlock.tsx           # Pure UI component
├── CodeBlockClient.tsx     # Client wrapper with copy button
├── useCodeBlock.tsx        # Hook for copy functionality
└── types.ts
```

**Features**:
- Syntax highlighting via Shiki (or similar SSR-compatible library)
- Language specification with visual indicator
- Line numbers (optional)
- Copy to clipboard button
- Horizontal scroll for long lines
- Dark/light theme support via design tokens

#### 1.2 Create `CommandTabs` Component
**File**: `packages/libs/design-system/src/components/molecules/CommandTabs/`

```
CommandTabs/
├── index.ts
├── CommandTabs.tsx         # Pure UI with tab display
├── CommandTabsProvider.tsx # Context for shared state
├── usePackageManager.tsx   # Hook for preference management
└── types.ts
```

**Features**:
- Tab selection for: bun, npm, yarn, pnpm
- Shared preference via React Context
- localStorage persistence for user preference
- Consistent styling across all instances
- Default preference: bun

#### 1.3 Create `InstallCommand` Component
**File**: `packages/libs/design-system/src/components/molecules/InstallCommand/`

Convenience wrapper combining `CommandTabs` + `CodeBlock` for installation commands.

```tsx
<InstallCommand package="@contractspec/lib.contracts" />
// Automatically generates: bun add / npm install / yarn add / pnpm add
```

---

### Phase 2: Package Manager Context Provider

**Goal**: Share package manager preference across all documentation pages.

#### 2.1 Create Provider
**File**: `packages/libs/design-system/src/components/providers/PackageManagerProvider.tsx`

```tsx
interface PackageManagerContextValue {
  preference: 'bun' | 'npm' | 'yarn' | 'pnpm';
  setPreference: (pm: PackageManagerPreference) => void;
}
```

#### 2.2 Integration Point
The provider should wrap the documentation layout so all `CommandTabs` and `InstallCommand` components share the same state.

---

### Phase 3: Update Documentation Pages

**Goal**: Replace raw `<pre>` blocks with proper components across all 95+ pages.

#### 3.1 Categories to Update (by priority)

1. **getting-started/** (7 pages) - HIGHEST PRIORITY
   - InstallationPage.tsx - Add package manager tabs
   - HelloWorldPage.tsx - Syntax highlighting
   - CLIPage.tsx - Command syntax highlighting
   - DatabaseToolsPage.tsx
   - DeveloperToolsPage.tsx
   - DataViewTutorialPage.tsx
   - VSCodeExtensionPage.tsx

2. **libraries/** (27 pages) - HIGH PRIORITY
   - All library documentation needs proper code examples
   - Installation commands need package manager tabs

3. **specs/** (6 pages)
   - TypeScript code examples need syntax highlighting

4. **integrations/** (14 pages)
   - Configuration code examples

5. **architecture/** (5 pages)
   - Code architecture examples

6. **advanced/** (7 pages)
   - Advanced configuration code

7. **safety/** (6 pages)
8. **studio/** (6 pages)
9. **knowledge/** (5 pages)
10. **comparison/** (6 pages)
11. **ops/** (2 pages)
12. **manifesto/** (1 page)

#### 3.2 Update Pattern

**Before**:
```tsx
<div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
  <pre>{`bun add @contractspec/lib.contracts`}</pre>
</div>
```

**After** (installation command):
```tsx
<InstallCommand package="@contractspec/lib.contracts" />
```

**After** (code example):
```tsx
<CodeBlock
  language="typescript"
  code={`import { defineCommand } from '@contractspec/lib.contracts';

const createUser = defineCommand({
  name: 'createUser',
  input: z.object({ email: z.string().email() }),
  output: z.object({ id: z.string() }),
});`}
/>
```

---

### Phase 4: Testing & Validation

1. **Visual Testing**: Verify syntax highlighting renders correctly
2. **Functionality Testing**: Verify copy button and tab switching work
3. **Persistence Testing**: Verify localStorage preference persists
4. **Accessibility Testing**: Verify keyboard navigation and screen reader support
5. **Responsive Testing**: Verify code blocks work on mobile

---

## Critical Files to Modify

### New Files (Design System)
- `packages/libs/design-system/src/components/molecules/CodeBlock/index.ts`
- `packages/libs/design-system/src/components/molecules/CodeBlock/CodeBlock.tsx`
- `packages/libs/design-system/src/components/molecules/CodeBlock/types.ts`
- `packages/libs/design-system/src/components/molecules/CommandTabs/index.ts`
- `packages/libs/design-system/src/components/molecules/CommandTabs/CommandTabs.tsx`
- `packages/libs/design-system/src/components/molecules/CommandTabs/types.ts`
- `packages/libs/design-system/src/components/molecules/InstallCommand/index.ts`
- `packages/libs/design-system/src/components/molecules/InstallCommand/InstallCommand.tsx`
- `packages/libs/design-system/src/components/providers/PackageManagerProvider.tsx`
- `packages/libs/design-system/src/index.ts` (update exports)

### Documentation Pages (95+ files)
All files in `packages/bundles/library/src/components/docs/` subdirectories

---

## Dependencies to Add

```json
{
  "shiki": "^3.20.0"  // Already in web-landing, add to design-system
}
```

---

## Design Decisions (Confirmed)

### Theme
- **`github-dark-dimmed`** - Already used in web-landing, familiar VS Code-style

### Line Numbers
- **Disabled by default** - Cleaner look, enable via prop when needed for longer examples

### Language Support (All Common)
- typescript/tsx (primary)
- javascript/jsx
- bash/shell
- json
- yaml
- graphql
- sql
- python
- go
- rust
- css/scss
- html

### Component Location
- **Design System** (`packages/libs/design-system`) - Reusable across all apps

### Why Shiki?
- Already used in web-landing (proven in codebase)
- SSR-compatible
- Excellent TypeScript support
- VS Code themes available
- Good performance

### Package Manager Default
- Default: `bun` (aligns with project's bun-first approach)
- Persisted in localStorage under `package-manager-preference`

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Shiki bundle size | Use dynamic imports, tree-shake unused languages |
| SSR hydration mismatch | Use client-only wrapper for interactive features |
| 95+ files to update | Start with getting-started (highest impact), batch others |
| Breaking existing styles | Keep backward-compatible wrapper initially |

---

## Execution Order

### Step 1: Create Design System Components
1. Create `CodeBlock` component with Shiki syntax highlighting
2. Create `CommandTabs` component with package manager tabs
3. Create `InstallCommand` convenience wrapper
4. Create `PackageManagerProvider` context
5. Export all from `packages/libs/design-system/src/index.ts`
6. Add `shiki` dependency to design-system package

### Step 2: Update Documentation Layout
1. Wrap documentation layout with `PackageManagerProvider`

### Step 3: Update Documentation Pages (by priority)
1. **getting-started/** (7 pages) - InstallationPage, HelloWorldPage, CLIPage, etc.
2. **libraries/** (27 pages) - All library docs
3. **specs/** (6 pages)
4. **integrations/** (14 pages)
5. **architecture/** (5 pages)
6. **advanced/** (7 pages)
7. Remaining categories (safety, studio, knowledge, comparison, ops, manifesto)

### Step 4: Validation
1. Build and verify no TypeScript errors
2. Visual review of syntax highlighting
3. Test package manager tab switching and persistence
4. Test copy functionality