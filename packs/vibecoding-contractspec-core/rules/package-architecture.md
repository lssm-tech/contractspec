---
targets:
  - '*'
root: false
description: 'Governs package responsibilities, component hierarchy, and dependency flow across the ContractSpec monorepo.'
globs:
  - '**/*'
cursor:
  alwaysApply: true
  description: 'Governs package responsibilities, component hierarchy, and dependency flow across the ContractSpec monorepo.'
  globs:
    - '**/*'
---

# Package Architecture & Dependency Flow

"Code must live in the right layer: Contracts define behavior, libs provide infrastructure, bundles compose business logic, and apps are thin platform adapters. UI is composed from design tokens — never from raw HTML."

## Core Principles

- **Layered Architecture**: Libs → Bundles → Apps, with clear dependency flow and no circular references.
- **Spec-First Development**: Contracts and specs live in reusable libraries to enable multi-platform runtime adapters.
- **Platform Neutrality**: Business logic must be platform-agnostic; apps are thin presentation layers.
- **Component Hierarchy**: All UI must use design-system components; raw HTML elements are forbidden in application code.

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

- Raw HTML prohibition is centralized here; see `frontend.md` for accessibility/state handling.
- **Existing code**: Refactor opportunistically during feature work or dedicated cleanup tasks.
- **New code**: Must follow these rules from day one.
- **Code review**: Reviewers should flag violations with reference to this rule.
- **AI behavior**: AI should refuse to generate raw HTML in application code and suggest design system components.

---

## Tooling

- **Audit**: Run `/audit-health` to detect layer violations (business logic in apps, upward dependencies, cross-bundle imports).
- **Extract**: Use the `extract-to-bundle` skill to move misplaced logic from apps to the correct bundle/lib with import rewiring.
- **Create**: Use the `create-feature` skill to scaffold new features in the correct architectural layer from the start.
- **Hook**: The `post-edit-checks` hook automatically flags business logic patterns detected in `packages/apps/`.

## References

- See `code-splitting.md` for file size limits and splitting strategies
- See `backend.md` for hexagonal architecture within bundles
- See `frontend.md` for atomic design and component patterns
- See `contractspec-mission.md` for mission and context guidelines
- See `observability.md` and `/audit-observability` for ensuring extracted modules include proper instrumentation
