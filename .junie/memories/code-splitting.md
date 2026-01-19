# Code Splitting & File Organization

"Files and components must be small, focused, and composable. Large files are a code smell. Every piece of logic should be designed for reuse across features and platforms."

## Core Principles

- **Radical Modularity**: Files and components must be small, focused, and composable. Large files are a code smell.
- **Single Responsibility**: Each file should have one clear purpose and responsibility.
- **Reusability First**: Every piece of logic, component, or service should be designed for reuse across features and platforms.
- **Domain-Driven Organization**: Code is grouped by business domain, not by technical layer or file type.

---

## Size Limits & Thresholds

**Rule**: No file should exceed 250 lines of code. Components and functions should be small, focused, and composable.

### Hard Limits

- **Components**: Max 150 lines (including types and hooks)
- **Services/Use Cases**: Max 200 lines
- **Utilities/Helpers**: Max 100 lines
- **Files with >250 lines**: Must be split immediately

**Why**: Large files are hard to review, test, and maintain. They usually indicate multiple responsibilities that should be separated.

---

## Business Domain Grouping

**Rule**: Organize code by business domain, not by technical concern.

### ✅ Good: Domain-Driven Structure

```
bundles/studio/src/
├── application/
│   ├── services/              # Core application services
│   │   ├── auth.ts
│   │   └── index.ts
├── modules/
│   ├── studio/                # Visual builder domain
│   │   ├── index.ts
│   │   └── versioning.ts
│   ├── lifecycle/             # Lifecycle management domain
│   │   ├── index.ts
│   │   └── index.test.ts
│   ├── integrations/          # Integration marketplace domain
│   │   ├── index.ts
│   │   └── index.test.ts
│   ├── evolution/             # Auto-evolution domain
│   │   ├── index.ts
│   │   └── index.test.ts
│   ├── knowledge/             # Knowledge sources domain
│   │   ├── index.ts
│   │   └── index.test.ts
│   └── analytics/             # Analytics & metrics domain
│       ├── index.ts
│       └── index.test.ts
├── domain/
│   └── index.ts
├── infrastructure/
│   ├── graphql/               # GraphQL adapters
│   ├── elysia/                # HTTP server adapters
│   ├── byok/                  # Bring-your-own-key encryption
│   └── deployment/            # Deployment orchestration
└── presentation/
    ├── studio/                # Studio UI components
    │   ├── molecules/
    │   │   ├── ComponentPalette.tsx
    │   │   ├── PropertyEditor.tsx
    │   │   └── DeploymentPanel.tsx
    │   └── organisms/
    │       ├── SpecEditor.tsx
    │       ├── SpecPreview.tsx
    │       └── StudioCanvas.tsx
    ├── lifecycle/             # Lifecycle UI components
    │   ├── atoms/
    │   │   └── LifecycleStageCard.tsx
    │   ├── molecules/
    │   │   └── RecommendationsList.tsx
    │   └── organisms/
    │       ├── LifecycleJourney.tsx
    │       ├── MilestoneTracker.tsx
    │       └── StageTransitionCeremony.tsx
    └── integrations/          # Integration UI components
        ├── molecules/
        │   └── IntegrationCard.tsx
        └── organisms/
            ├── IntegrationMarketplace.tsx
            └── KnowledgeSourceList.tsx
```

### ❌ Forbidden: Technical Grouping

```
bundles/studio/src/
├── services/               # Too generic, mixed domains
│   ├── studio.service.ts
│   ├── lifecycle.service.ts
│   └── integrations.service.ts
├── entities/               # All entities mixed together
│   ├── project.ts
│   ├── spec.ts
│   ├── integration.ts
│   └── user.ts
└── components/             # All UI mixed together
    ├── StudioCanvas.tsx
    ├── LifecycleJourney.tsx
    └── IntegrationMarketplace.tsx
```

---

## Component Splitting Strategy

**When to split a component**:

1. Component exceeds 150 lines
2. Multiple responsibilities are present
3. Repeated logic appears in multiple places
4. Nested components are defined inline
5. Component has more than 5-7 props

**How to split**:

```tsx
// ❌ Bad: Monolithic component (300+ lines)
export const StudioWorkspace = () => {
  // 50 lines of state management
  // 100 lines of data fetching logic
  // 150 lines of JSX with inline components
  return <div>{/* Massive JSX tree */}</div>;
};

// ✅ Good: Split into focused components
// StudioWorkspace.tsx (50 lines)
export const StudioWorkspace = () => {
  const project = useStudioProject();
  return (
    <WorkspaceLayout>
      <StudioHeader project={project} />
      <StudioCanvas project={project} />
      <PropertyEditor project={project} />
      <DeploymentPanel project={project} />
    </WorkspaceLayout>
  );
};

// useStudioProject.ts (40 lines)
export const useStudioProject = () => {
  // Focused hook for data fetching
};

// StudioHeader.tsx (30 lines)
export const StudioHeader = ({ project }) => {
  // Focused component
};

// StudioCanvas.tsx (40 lines)
export const StudioCanvas = ({ project }) => {
  // Focused component
};
```

---

## Service Splitting Strategy

**When to split a service**:

1. Service exceeds 200 lines
2. Multiple use cases are handled
3. Different domains are mixed
4. Complex orchestration logic

**How to split**:

```typescript
// ❌ Bad: God service (500+ lines)
export class ContractSpecService {
  createProject() {
    /* ... */
  }
  deploySpec() {
    /* ... */
  }
  evolveContract() {
    /* ... */
  }
  manageIntegrations() {
    /* ... */
  }
  trackLifecycle() {
    /* ... */
  }
  // ... 20 more methods
}

// ✅ Good: Focused services by domain
// project.service.ts (150 lines)
export class ProjectService {
  createProject() {
    /* ... */
  }
  updateProject() {
    /* ... */
  }
  listProjects() {
    /* ... */
  }
}

// deployment.service.ts (120 lines)
export class DeploymentService {
  deploySpec() {
    /* ... */
  }
  rollbackDeployment() {
    /* ... */
  }
}

// evolution.service.ts (100 lines)
export class EvolutionService {
  evolveContract() {
    /* ... */
  }
  suggestImprovements() {
    /* ... */
  }
}

// integration.service.ts (80 lines)
export class IntegrationService {
  connectIntegration() {
    /* ... */
  }
  validateConnection() {
    /* ... */
  }
}
```

---

## Reusability Patterns

**Extract reusable logic**:

```typescript
// ❌ Bad: Duplicated logic across files
// In project.service.ts
const formatSpecVersion = (version: number) => {
  return `v${version.toString().padStart(3, '0')}`;
};

// In deployment.service.ts
const formatSpecVersion = (version: number) => {
  return `v${version.toString().padStart(3, '0')}`;
};

// ✅ Good: Shared utility
// libs/utils-typescript/src/format.util.ts
export const formatSpecVersion = (version: number) => {
  return `v${version.toString().padStart(3, '0')}`;
};

// Both services import and use it
import { formatSpecVersion } from '@contractspec/lib.utils-typescript';
```

**Design for composition**:

```tsx
// ✅ Good: Composable components
export const Card = ({ children, className }) => (
  <div className={cn('rounded-lg border p-4', className)}>
    {children}
  </div>
)

export const CardHeader = ({ children }) => (
  <div className="mb-2 font-semibold">{children}</div>
)

export const CardContent = ({ children }) => (
  <div>{children}</div>
)

// Used in multiple domains
<Card>
  <CardHeader>Project: my-api</CardHeader>
  <CardContent>12 specs deployed</CardContent>
</Card>

<Card>
  <CardHeader>Integration</CardHeader>
  <CardContent>Connected to Stripe</CardContent>
</Card>
```

---

## Dev Heuristics — File Size & Splitting

✅ Is this file under 250 lines?
✅ Does this file have a single, clear responsibility?
✅ Is the code organized by business domain, not by file type?
✅ Can this logic be reused in other features or platforms?
✅ Are components small enough to understand in one screen?
✅ Would splitting this file make the codebase easier to navigate?
❌ Am I about to add a 10th method to this service? → Split it.
❌ Does this component do 3+ different things? → Split it.
❌ Am I copy-pasting this logic for the 2nd time? → Extract it.

---

## Enforcement Notes

- File length limits are hard caps: split before merging; do not defer.
- New components/services must ship already split; no "follow-up" debt allowed.
- **Existing code**: Refactor opportunistically during feature work or dedicated cleanup tasks.
- **New code**: Must follow these rules from day one.
- **Code review**: Reviewers should flag violations with reference to this rule.
- **AI behavior**: AI should proactively suggest splitting when files approach limits.

---

## References

- See `package-architecture.md` for where code should live (libs vs bundles vs apps)
- See `backend.md` for hexagonal architecture within bundles
- See `frontend.md` for atomic design and component patterns
