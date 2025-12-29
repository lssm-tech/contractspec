---
targets:
  - '*'
root: false
description: >-
  Governs package organization, dependency flow, and component hierarchy across
  the ContractSpec monorepo.
globs:
  - '**/*'
cursor:
  alwaysApply: true
  description: >-
    Governs package organization, dependency flow, and component hierarchy
    across the ContractSpec monorepo.
  globs:
    - '**/*'
---
# Code Organization & Dependency Architecture

"Code must live in the right layer: Contracts define behavior, libs provide infrastructure, bundles compose business logic, and apps are thin platform adapters. UI is composed from design tokens — never from raw HTML."

## Core Principles

- **Layered Architecture**: Libs → Bundles → Apps, with clear dependency flow and no circular references.
- **Spec-First Development**: Contracts and specs live in reusable libraries to enable multi-platform runtime adapters.
- **Platform Neutrality**: Business logic must be platform-agnostic; apps are thin presentation layers.
- **Component Hierarchy**: All UI must use design-system components; raw HTML elements are forbidden in application code.
- **Domain-Driven Organization**: Code is grouped by business domain, not by technical layer or file type.
- **Radical Modularity**: Files and components must be small, focused, and composable. Large files are a code smell.
- **Reusability First**: Every piece of logic, component, or service should be designed for reuse across features and platforms.

---

## Code Splitting & File Organization

**Rule**: No file should exceed 250 lines of code. Components and functions should be small, focused, and composable.

### Size Limits & Thresholds

- **Components**: Max 150 lines (including types and hooks)
- **Services/Use Cases**: Max 200 lines
- **Utilities/Helpers**: Max 100 lines
- **Files with >250 lines**: Must be split immediately

**Why**: Large files are hard to review, test, and maintain. They usually indicate multiple responsibilities that should be separated.

### Business Domain Grouping

**Rule**: Organize code by business domain, not by technical concern.

### ✅ Good: Domain-Driven Structure

```
bundles/contractspec-studio/src/
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
bundles/contractspec-studio/src/
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

### Component Splitting Strategy

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

### Service Splitting Strategy

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

### Reusability Patterns

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

### Dev Heuristics — File Size & Splitting

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

## Package Responsibilities

### 1. `packages/libs/` — Shared Infrastructure & Contracts

**Purpose**: Houses shared infrastructure, contracts, utilities, and design system components used across the monorepo.

**Key Libraries**:

```
libs/
├── contracts/              # Core ContractSpec definitions (defineCommand, defineQuery, OperationSpecRegistry)
├── ai-agent/               # AI agent orchestration and LLM providers
├── evolution/              # Auto-evolution engine
├── schema/                 # Zod-based schema definitions
├── design-system/          # Shared design tokens and atoms
├── ui-kit/                 # Cross-platform UI components
├── ui-kit-web/             # Web-specific UI components
├── analytics/              # Analytics and tracking
├── observability/          # Logging, tracing, metrics
├── multi-tenancy/          # Tenant isolation utilities
├── progressive-delivery/   # Feature flags and rollouts
└── utils-typescript/       # TypeScript utilities
```

**What Goes Here**:

- Generic infrastructure with no business logic dependencies
- Contract definitions and runtime adapters
- Design system components
- Pure utilities and type helpers

**What Does NOT Go Here**:

- Business-specific logic (→ bundles)
- Platform-specific adapters (→ apps)
- Application-specific prompts or tools

**Dev Heuristics**:
✅ Is this pure infrastructure with no business logic?
✅ Can this be used by any application without modification?
✅ Does this have zero dependencies on business bundles?

---

### 2. `packages/bundles/contractspec-studio/` — Core Business Logic

**Purpose**: Contains domain logic, application services, infrastructure adapters, and reusable UI components for ContractSpec Studio. **Organized by business domain.**

**Structure** (domain-first organization):

```
contractspec-studio/
├── src/
│   ├── domain/                    # Pure business logic
│   ├── application/               # Application services
│   │   └── services/              # Auth, etc.
│   ├── modules/                   # Feature modules by domain
│   │   ├── studio/                # Visual builder
│   │   ├── lifecycle/             # Lifecycle management
│   │   ├── integrations/          # Integration marketplace
│   │   ├── evolution/             # Auto-evolution
│   │   ├── knowledge/             # Knowledge sources
│   │   └── analytics/             # Metrics and tracking
│   ├── infrastructure/            # Infrastructure adapters
│   │   ├── graphql/               # GraphQL schema and resolvers
│   │   ├── elysia/                # HTTP server
│   │   ├── byok/                  # Encryption
│   │   └── deployment/            # Deployment orchestration
│   ├── presentation/              # Reusable UI by domain
│   │   ├── studio/                # Studio-specific components
│   │   ├── lifecycle/             # Lifecycle-specific components
│   │   ├── integrations/          # Integration-specific components
│   │   └── templates/             # Reusable template components
│   └── templates/                 # Application templates (todos, recipes, etc.)
```

**What Goes Here**:

- Domain models and business rules (grouped by domain)
- Application services and use cases (grouped by domain)
- Infrastructure adapters (Prisma, GraphQL, external APIs)
- **ContractSpec-specific UI components** (highest priority in component hierarchy)
- Feature-specific molecules and organisms (organized by domain)

**What Does NOT Go Here**:

- Generic contract definitions (→ libs/contracts)
- Platform routing, middleware, or deployment config (→ apps)
- Raw HTML elements (div, button, span, input, etc.)
- Generic utilities not tied to business domains (→ libs)

**Dev Heuristics**:
✅ Can this logic run on web, mobile, and API without changes?
✅ Is this component reusable across multiple features or screens?
✅ Does this component compose from the design system, not raw HTML?
✅ Is this code grouped with related domain concepts, not scattered by file type?
✅ Does this file belong to a clear business domain (studio, lifecycle, integrations, etc.)?

---

### 3. `packages/apps/` — Platform-Specific Entry Points

**Purpose**: Thin adapters for platform-specific concerns (routing, middleware, deployment, native APIs).

**Apps**:

```
apps/
├── web-landing/            # Marketing site (Next.js)
├── overlay-editor/         # Overlay editor (Next.js)
├── cli-contractspec/          # CLI for contract management
├── cli-database/           # CLI for database management
└── cli-databases/          # CLI for multi-database management
```

**What Goes Here**:

- Next.js routing and API routes
- Platform-specific middleware (auth, i18n, feature flags)
- Deployment and build configuration
- Platform entry points and bootstrapping
- Page-level composition (importing from bundles)

**What Does NOT Go Here**:

- Business logic (→ bundles)
- Reusable UI components (→ bundles/presentation)
- Contract definitions (→ libs/contracts)
- Data fetching logic (→ bundles/application)

**Dev Heuristics**:
✅ Is this code specific to Next.js, CLI, or another platform?
✅ Does this file only wire together logic from bundles and libraries?
✅ Can this be replaced with a different framework without rewriting business logic?

---

### 4. `packages/modules/` — Lifecycle Modules

**Purpose**: Self-contained modules for lifecycle management features.

```
modules/
├── lifecycle-core/         # Core lifecycle definitions
└── lifecycle-advisor/      # AI-powered lifecycle recommendations
```

---

### 5. `packages/verticals/` — Domain-Specific Implementations

**Purpose**: Complete vertical implementations demonstrating ContractSpec in specific domains.

```
verticals/
└── pocket-family-office/   # Family office automation vertical
```

---

## Component Hierarchy — Forbidden: Raw HTML

**Rule**: Never use raw HTML elements (`div`, `button`, `span`, `input`, `form`, etc.) directly in application code.

**Component Priority** (use the highest available):

1. **ContractSpec-specific components** (`packages/bundles/contractspec-studio/src/presentation/`)
2. **Design system components** (`@contractspec/lib.design-system`)
3. **UI kit components** (`@contractspec/lib.ui-kit-web`)

### ✅ Good: Composed from Design System

```tsx
// In bundles/contractspec-studio/src/presentation/organisms/ProjectForm.tsx
import { Button } from '@contractspec/lib.design-system';
import { Input } from '@contractspec/lib.ui-kit-web';
import { FormContainer } from '../molecules/FormContainer';

export const ProjectForm = ({ onSubmit, isLoading }) => (
  <FormContainer onSubmit={onSubmit}>
    <Input label="Project Name" type="text" />
    <Input label="Description" type="text" />
    <Button loading={isLoading}>Create Project</Button>
  </FormContainer>
);
```

### ❌ Forbidden: Raw HTML Elements

```tsx
// NEVER do this in application code
export const ProjectForm = ({ onSubmit }) => (
  <div className="form-container">
    <input type="text" placeholder="Project Name" />
    <input type="text" placeholder="Description" />
    <button type="submit">Create Project</button>
  </div>
);
```

### Exception: Creating New Design System Components

Raw HTML is **only allowed** when creating new design system atoms within:

- `packages/libs/design-system/src/atoms/`
- Or when contributing to `@contractspec/lib.ui-kit` or `@contractspec/lib.ui-kit-web`

These new atoms must:

- Follow the design token system
- Be fully typed
- Include proper accessibility attributes
- Be documented and reviewed

---

## Dependency Flow

**Allowed**:

```
apps → bundles → libs (contracts, ai-agent, design-system, etc.)
       ↓
     No upward dependencies
```

| From         | To            | Allowed? | Notes                                                       |
| ------------ | ------------- | -------- | ----------------------------------------------------------- |
| apps         | bundles, libs | ✅       | Apps stay thin; no business logic here.                     |
| bundles      | libs          | ✅       | Business logic may consume shared infrastructure/contracts. |
| bundles      | apps          | ❌       | Forbidden upward dependency.                                |
| libs         | bundles/apps  | ❌       | Shared libs must not depend on business/app code.           |
| cross-bundle | other bundles | 🚫       | Avoid; extract to shared libs/contracts instead.            |

**Example**:

```
apps/web-landing
  └── bundles/contractspec-studio
        ├── modules/studio           (visual builder)
        ├── modules/lifecycle        (lifecycle management)
        └── libs/contracts           (core contract definitions)
```

**Forbidden**:

- `libs` importing from `bundles`
- `bundles` importing from `apps`
- Circular dependencies at any level

---

## Dev Heuristics — Where Does This Code Go?

**Generic infrastructure?** → `packages/libs/`
✅ Is this pure infrastructure without business logic?
✅ Is this a contract definition, adapter, or utility?
✅ Does it have zero dependencies on business bundles?

**Business-specific logic?** → `packages/bundles/contractspec-studio/`
✅ Is this domain logic, a use case, or a data adapter?
✅ Is this a reusable UI component?
✅ Can this be shared across platforms?
✅ Does this belong to a clear business domain (studio, lifecycle, integrations, etc.)?
✅ Is the file under 250 lines? If not, can it be split?

**Platform-specific?** → `packages/apps/`
✅ Is this Next.js routing, middleware, or deployment config?
✅ Does this only wire together imports from bundles?
✅ Is this truly platform-specific and not reusable?

**UI component?** → Check hierarchy
✅ Does a ContractSpec-specific component already exist?
✅ Does `@contractspec/lib.design-system` provide this?
✅ Does `@contractspec/lib.ui-kit-web` provide this?
✅ Is this component under 150 lines? If not, can it be split?
✅ Is this component reusable across multiple features?
❌ Am I about to use a raw `<div>` or `<button>`? → STOP, use or create a design system component.

**Reusable utility?** → Consider extraction
✅ Is this logic duplicated in 2+ places?
✅ Can this be used across multiple domains?
✅ Is this a pure function with no side effects?
→ Extract to a shared utility in the appropriate layer

**Large file?** → Split immediately
❌ Is this file over 250 lines?
❌ Does this component/service have multiple responsibilities?
❌ Are there nested components defined inline?
→ Break it down by domain, responsibility, or composition

---

## Enforcement Notes

- File length limits are hard caps: split before merging; do not defer.
- New components/services must ship already split; no “follow-up” debt allowed.
- Raw HTML prohibition is centralized here; see `frontend.mdc` for accessibility/state handling.

---

## Migration & Enforcement

- **Existing code**: Refactor opportunistically during feature work or dedicated cleanup tasks.
- **New code**: Must follow these rules from day one.
- **Code review**: Reviewers should flag violations with reference to this rule.
- **AI behavior**: AI should refuse to generate raw HTML in application code and suggest design system components.

---

## References

- See `backend.mdc` for hexagonal architecture within bundles
- See `frontend.mdc` for atomic design and component patterns
- See `contractspec-mission.mdc` for mission and context guidelines
